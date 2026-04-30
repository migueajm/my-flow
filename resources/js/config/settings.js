export const settings = {
	"salary": {
		"id": "salary",
		"label": {
			"es": "Salario",
			"en": "Salary"
		},
		"type": "text",
		"required": true,
		"parentClass": "col col-sm-12 col-md-6"
	},
	"save-settings": {
		"id": "save-settings",
		"label": {
			"es": "Guardar configuración",
			"en": "Save settings"
		},
		"type": "button",
		"required": false,
		"parentClass": "form-button",
		"onClick": "saveSettings()"
	}
}