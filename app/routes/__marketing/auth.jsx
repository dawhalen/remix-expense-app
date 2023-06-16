import AuthForm from '~/components/auth/AuthForm';
import authStyles from '~/styles/auth.css';
import { validateCredentials } from '../../util/validation.server';
import { login, signUp } from '../../util/auth.server';
import { redirect } from '@remix-run/node';

export default function AuthPage() {
    return (
        <>
            <AuthForm />
        </>
    );
}

export function links() {
    return [{ rel: 'stylesheet', href: authStyles }];
}

export async function action({ request }) {
    const searchParams = new URL(request.url).searchParams;
    const authMode = searchParams.get('mode') || 'login';
    const formData = await request.formData();
    const credentials = Object.fromEntries(formData);

    //validate user input
    try {
        validateCredentials(credentials);
    } catch (error) {
        return error;
    }

    if (authMode === "login") {
        try {
            return await login(credentials);
        } catch (error) {
            console.log(error);
            if (error.status === 401) {
                return { credentials: error.message };
            }
        }
        return { credentials: "Something went wrong." };
    } else if (authMode === "signup") {
        try {
            return await signUp(credentials);
        } catch (error) {
            console.log(error);
            if (error.status === 422) {
                return { credentials: error.message };
            }
        }
        return { credentials: "Something went wrong." };
    }
}