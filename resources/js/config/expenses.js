import {categories} from './categories.js';
export const expenses = {
	"expenseId": {
		"id": "expenseId",
		"label": {
			"es": "#",
			"en": "#"
		},
		"type": "text",
		"required": true,
		"hidden": true,
		"parentClass": "col col-sm-12",
	},
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
	}
}