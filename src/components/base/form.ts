import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

export class Form<T extends Record<string, unknown>> extends Component {
	protected formTemplate: HTMLTemplateElement;
	protected formElement: HTMLFormElement;
	protected submitButton: HTMLButtonElement;
	protected inputError: HTMLSpanElement;

	constructor(templateId: string, callback: () => void) {
		super();
		this.formTemplate = ensureElement<HTMLTemplateElement>(
			`#${templateId}`,
			document
		);
		const container = this.formTemplate.content.cloneNode(true) as HTMLElement;
		this.formElement = ensureElement<HTMLFormElement>('.form', container);
		this.inputError = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.formElement
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.formElement
		);
		this.formElement.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			callback();
		});
	}

	//метод, очищающий поля формы
	clearValue(): void {
		this.formElement.reset();
	}

	set valid(value: boolean) {
    this.setDisabled(this.submitButton, !value);
	}

	set errors(value: string) {
		this.setText(this.inputError, value);
	}
	//метод получения данных формы
	getFormData(): T {
		const formData = new FormData(this.formElement);
		const formValues = {} as T;
		formData.forEach((value, key: keyof T) => {
			formValues[key] = value as unknown as T[keyof T];
		});
		return formValues;
	}
}
