import { useNavigate } from '@remix-run/react';
import ExpenseForm from `~/components/expenses/ExpenseForm`;
import Modal from '~/components/util/Modal';
import { addExpense } from '../../../util/expenses.server';
import { redirect } from '@remix-run/node';
import { validateExpenseInput } from '../../../util/validation.server';
import { requireUserSession } from '../../../util/auth.server';

export default function AddExpensesPage(){
    const navigate = useNavigate();

    function closeHandler() {
        // navigate programatically
        navigate('..');
    }

    return (
        <Modal onClose={closeHandler}>
            <ExpenseForm />
        </Modal>
    );
}

export async function action({request, params}){
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);
    const userId = await requireUserSession(request);

    try {
        validateExpenseInput(expenseData);
    } catch (error) {
        return error;
    }

    await addExpense(userId, expenseData);
    return redirect("/expenses");
}