import { Loader } from "../Utilities/loader.js";
import { Toast } from "../Utilities/toast.js";

export class CustomError extends Error {
	constructor(name, message, code) {
		super(message);
		this.name = name;
		this.statusCode = code;
		Loader.hide();
		const delay = 10000;
		if (code >= 500) {
			return Toast.error(message, delay);
		}
		Toast.warning(message, delay);
	}
}