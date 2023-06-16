import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FaPlus, FaDownload } from "react-icons/fa";
import ExpenseList from '~/components/expenses/ExpensesList'
import { getExpenses } from "../../util/expenses.server";
import { getUserFromSession, requireUserSession } from "../../util/auth.server";

export default function ExpensesLayout() {

    const expenseList = useLoaderData();
    const hasExpenses = expenseList && expenseList.length > 0;

    return (
        <>
            <Outlet />
            <main>
                <section id="expenses-actions">
                    <Link to="add">
                        <FaPlus />
                        <span>Add Expense</span>
                    </Link>
                    <a href="/expenses/raw">
                        <FaDownload />
                        <span>Load Raw Data</span>
                    </a>
                </section>
                {hasExpenses && <ExpenseList expenses={expenseList} />}
                {!hasExpenses && <section id="no-expenses">
                    <h1>No expenses found</h1>
                    <p>Try <Link to="add">adding one</Link>.</p>
                </section>}
            </main>
        </>
    )
}

export async function loader({ request }) {
    await requireUserSession(request);
    const userId = await getUserFromSession(request);
    return await getExpenses(userId);
}
