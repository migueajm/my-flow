import { SecureStorageManager } from './Utilities/storage.js';

let state = {
	salary: SecureStorageManager.load('salary') || 0,
	expenses: SecureStorageManager.load('expenses') || [],
	filters: { type: 'all' }
};

let listeners = [];

export const subscribe = fn => listeners.push(fn);

const notify = () => listeners.forEach(fn => fn(state));

export const setSalary = s => {
	state.salary = s;
	SecureStorageManager.save('salary', s);
	notify();
};

export const getSalary = () => {
	return (new SecureStorageManager()).get('salary');
};

export const addExpense = e => {
	e.expenseId = Date.now();
	state.expenses.push(e);
	SecureStorageManager.save('expenses', state.expenses);
	notify();
};

export const updateExpense = (id, updatedExpense) => {
	state.expenses = state.expenses.map(e => e.id === id ? { ...e, ...updatedExpense } : e);
	SecureStorageManager.save('expenses', state.expenses);
	notify();
};

export const deleteExpense = id => {
	state.expenses = state.expenses.filter(e => e.id != id);
	SecureStorageManager.save('expenses', state.expenses);
	notify();
};

export const getExpense = id => {
	return state.expenses.find(e => e.expenseId === id);
};

export const setFilter = f => {
	state.filters = { ...state.filters, ...f };
	notify();
};

export const getState = () => state;