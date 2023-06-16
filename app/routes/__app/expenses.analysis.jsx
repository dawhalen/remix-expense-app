import ExpenseStatistics from '~/components/expenses/ExpenseStatistics';
import Chart from '~/components/expenses/Chart';
import Error from '~/components/util/Error';
import { getExpenses } from '~/util/expenses.server';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useCatch } from '@remix-run/react';
import { requireUserSession } from '../../util/auth.server';



export default function ExpenseAnalysisPage() {
    const expenseList = useLoaderData();

    return (
        <main>
            <h1>Expense Analysis Page</h1>
            <Chart expenses={expenseList} />
            <ExpenseStatistics expenses={expenseList} />
        </main>
    );
}

export async function loader({ request }) {
    const userId =await requireUserSession(request);
    const expenseList = await getExpenses(userId);

    if (!expenseList || expenseList.length === 0) {
        throw json({ message: "Did not find any expenses." }, { status: 404, statusText: "No expenses found." });
    }

    return expenseList;
}

export function CatchBoundary() {
    const caughtResp = useCatch();

    return (
        <main>
            <Error>
                <h1>{caughtResp.data?.message || "Something went wrong... please try again later."}</h1>
                <p>You haven't added any expenses yet... you should <Link to="/expenses/add">add some</Link> first!</p>
            </Error>
        </main>
    );
}