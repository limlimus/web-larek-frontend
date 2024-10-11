import { ensureElement } from '../../utils/utils';
import { TFormData, IForm } from '../../types';
import { Form } from '../base/form';

//класс отображения формы контактов
export class ContactsForm extends Form<Partial<TFormData>> implements IForm {
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;

	constructor(templateId: string, callback: () => void) {
		super(templateId, callback);
	}

	//метод рендера элемента
	render(): HTMLFormElement {
		this.inputEmail = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.formElement
		);
		this.inputPhone = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.formElement
		);

		this.inputEmail.addEventListener('keyup', () => {
			this.checkValidationContactsForm();
		});

		this.inputPhone.addEventListener('keyup', (evt: KeyboardEvent) => {
			this.checkValidationContactsForm();
		});

		this.checkValidationContactsForm();
		return this.formElement;
	}

	// метод валидации формы контактов
	checkValidationContactsForm(): void {
		const isValid: boolean = this.formElement.checkValidity();
		this.valid = isValid;
		if (!isValid) {
			this.errors = 'Необходимо  ввести телефон и адрес электронной почты';
		}
	}

	//сохраняет данные полей ввода формы - общий
	getFormValue(): Partial<TFormData> {
		const FormData = super.getFormData();
		return FormData;
	}
}
