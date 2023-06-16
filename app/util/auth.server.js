import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { prisma } from './database.server';
import { compare, hash } from 'bcryptjs';

const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: false, //process.env.NODE_ENV === "production",
        secrets: [SESSION_SECRET],
        sameSite: "lax",
        maxAge: 30 * 24 * 30 * 30,
        httpOnly: true,
    }
});

async function createUserSession(userId, redirectPath){
    const session = await sessionStorage.getSession();
    session.set("userId", userId);
    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export async function destroyUserSession(request, redirectPath) {
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session)
        }
    });
}

export async function getUserFromSession(request){
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    const userId = session.get('userId');
    if (!userId) {
        return null;
    }
    return userId;
}

export async function requireUserSession(request){
    const userId = await getUserFromSession(request);
    if (!userId) {
        throw redirect("/auth?mode=login")
    }
    return userId;
}

export async function signUp(credentials) {
    try {
        // check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: credentials.email
            }
        });
        if (existingUser) {
            const error = new Error("A user with this email address already exists.");
            error.status = 422;
            throw error;
        }
        // create the user
        const passwordHash = await hash(credentials.password, 12)
        const createdUser = await prisma.user.create({
            data: {
                email: credentials.email,
                password: passwordHash,
            }
        });
        return createUserSession(createdUser.id, "/expenses");
    } catch (error) {
        console.log(error);

        if (error.status === 422) {
            throw error;
        }
        throw new Error("Error creating user.");
    }
}

export async function login(credentials){
    try {
        // check if user record exists
        const foundUser = await prisma.user.findFirst({
            where: {
                email: credentials.email
            }
        });
        if (!foundUser) {
            const error = new Error("Could not authenticate with those credentials.");
            error.status = 401;
            throw error;
        }
        // check the password is correct
        const correctPassword = await compare(credentials.password, foundUser.password);
        if (!correctPassword) {
            const error = new Error("Could not authenticate with those credentials.");
            error.status = 401;
            throw error;
        }
        return createUserSession(foundUser.id, "/expenses");
        
    } catch(error) {
        console.log(error);

        if (error.status === 401) {
            throw error;
        }
        throw new Error("Error authenticating.");
    }
}