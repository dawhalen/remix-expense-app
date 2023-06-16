import { prisma } from './database.server';

function requireUserId(userId) {
    if (!userId) {
        throw new Error('User is undefined.');
    }
}

export async function addExpense(userId, expenseData) {
    try {
        requireUserId(userId);
        return await prisma.expense.create({
            data: {
                title: expenseData.title,
                amount: +expenseData.amount,
                date: new Date(expenseData.date),
                User: { connect: { id: userId } },
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add expense.');
    }
}

export async function getExpenses(userId) {
    try {
        requireUserId(userId);
        const searchArgs = { where: { userId: userId }, orderBy: { date: "asc" } };
        return await prisma.expense.findMany(searchArgs);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get expenses.');
    }
}

export async function getExpense(userId, expenseId) {
    try {
        requireUserId(userId);
        console.log(expenseId, userId);
        return await prisma.expense.findFirstOrThrow({ where: { id: expenseId, userId: userId } });
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get expense.');
    }
}

export async function deleteExpense(userId, expenseId) {
    try {
        requireUserId(userId);
        return await prisma.expense.delete({ where: { id: expenseId , userId: userId } });
    } catch (error) {
        console.log(error);
        throw new Error('Failed to delete expense.');
    }
}

export async function updateExpense(userId, expenseId, expenseData) {
    try {
        requireUserId(userId);
        const existingExpense = await getExpense(userId, expenseId);
        if (!existingExpense) {
            throw new Error("Invalid expense");
        }
        const expenseProps = {
            title: expenseData.title,
            amount: +expenseData.amount,
            date: new Date(expenseData.date)
        }
        return await prisma.expense.update({
            where: { id: expenseId },
            data: expenseProps
        });
    } catch (error) {
        console.log(error);
        throw new Error('Failed to update expense.');
    }
}