import {categories} from './categories.js';
export const expenses = {
	"category": {
		"id": "category",
		"label": {
			"es": "Categoría",
			"en": "Category"
		},
		"type": "select",
		"required": true,
		"parentClass": "col col-sm-12 col-md-6",
		"options": categories
	},
	"expenseName": {
		"id": "expenseName",
		"label": {
			"es": "Nombre",
			"en": "Name"
		},
		"type": "text",
		"required": true,
		"parentClass": "col col-sm-12 col-md-6"
	},
	"amount": {
		"id": "amount",
		"label": {
			"es": "Monto",
			"en": "Amount"
		},
		"type": "number",
		"required": true,
		"parentClass": "col col-sm-12 col-md-6"
	},
	"date": {
		"id": "date",
		"label": {
			"es": "Fecha de la operación",
			"en": "Date of the operation"
		},
		"type": "datetime-local",
		"required": true,
		"parentClass": "col col-sm-12 col-md-6"
	},
	"save-expense": {
		"id": "save-expense",
		"label": {
			"es": "Guardar gasto",
			"en": "Save expense"
		},
		"type": "button",
		"required": false,
		"parentClass": "form-button",
		"onClick": "saveExpense()"
	}
}