import { useNavigate } from '@remix-run/react';
import ExpenseForm from `~/components/expenses/ExpenseForm`;
import Modal from '~/components/util/Modal';
import { getExpense } from '~/util/expenses.server';
import { updateExpense } from '~/util/expenses.server';
import { validateExpenseInput } from '~/util/validation.server';
import { json, redirect } from '@remix-run/node';
import { addExpense, deleteExpense } from '../../../util/expenses.server';
import { requireUserSession } from '../../../util/auth.server';

export default function GetExpensePage(){
    const navigate = useNavigate();

    function closeHandler() {
        // navigate programatically
        navigate('..');
    }

    return (
        <Modal onClose={closeHandler}>
            <ExpenseForm/>
        </Modal>
    );
}

export async function loader({request, params}){
    const userId = await requireUserSession(request);
    return await getExpense(userId, params.id);
}

export async function action({request, params}){
    const userId = await requireUserSession(request);

    if (request.method === "POST") {
        const formData = await request.formData();
        const expenseData = Object.fromEntries(formData);

        // validate expense data before update
        try {
            validateExpenseInput(expenseData);
        } catch (error) {
            return error;
        }

        addExpense(userId, expenseData);
        return redirect("/expenses")
    } else if (request.method === "PATCH") {
        const formData = await request.formData();
        const expenseData = Object.fromEntries(formData);

        // validate expense data before update
        try {
            validateExpenseInput(expenseData);
        } catch (error) {
            return error;
        }

        await updateExpense(userId, params.id, expenseData);
        return redirect('/expenses');
    } else if (request.method === "DELETE" ) {
        await deleteExpense(userId, params.id);
        return json({deletedId: params.id});
    } else {
        return json({message: "Unsupported method"}, 403)
    }
}

export function meta({data}){
    return [{
      title: data.title,
    }];
  }