import { requireUserSession } from "../util/auth.server";
import { getExpenses } from "../util/expenses.server";

export async function loader({ request }) {
    const userId = await requireUserSession(request);
    return getExpenses(userId);
}