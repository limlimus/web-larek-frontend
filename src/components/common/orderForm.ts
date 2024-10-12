import { ensureElement } from '../../utils/utils';
import { TFormData, IForm, TPayment } from '../../types';
import { Form } from '../base/form';

//класс отображения формы заказа
export class OrderForm extends Form<Partial<TFormData>> implements IForm {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;
	protected payment: TPayment | undefined;

	constructor(templateId: string, callback: () => void) {
		super(templateId, callback);
	}

	//метод рендера элемента
	render(): HTMLFormElement {
		this.cardButton = ensureElement<HTMLButtonElement>(
			'[name="card"]',
			this.formElement
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'[name="cash"]',
			this.formElement
		);
		this.inputAddress = ensureElement<HTMLInputElement>(
			'.form__input',
			this.formElement
		);
		this.clearOrderForm();
		this.cardButton.addEventListener('click', (event) =>
			this.handlePaymentClick(event)
		);
		this.cashButton.addEventListener('click', (event) =>
			this.handlePaymentClick(event)
		);
		this.inputAddress.addEventListener('keyup', () =>
			this.checkValidationAddress()
		);
		this.checkValidationAddress();
		return this.formElement;
	}

	//метод валидации адреса
	checkValidationAddress(): void {
		this.formElement.checkValidity();
		this.setText(this.inputError, this.inputAddress.validationMessage);
		const isValid = !!this.payment && this.formElement.checkValidity();
		this.valid = isValid;
		if (!isValid) {
			this.errors = 'Необходимо выбрать способ оплаты и ввести адрес';
		}
	}

	//переключение способа оплаты
	toggleCard(state: boolean = true): void {
		this.toggleClass(this.cardButton, 'button_alt-active', state);
		if (state) {
			this.payment = 'Онлайн';
		}
	}

	toggleCash(state: boolean = true): void {
		this.toggleClass(this.cashButton, 'button_alt-active', state);
		if (state) {
			this.payment = 'При получении';
		}
	}

	//метод получения выбранного способа оплаты
	handlePaymentClick(event: MouseEvent): void {
		const button = event.target;
		this.toggleCard(button === this.cardButton);
		this.toggleCash(button === this.cashButton);

		this.checkValidationAddress();
	}

	//возвращает данные формы
	getFormValue(): Partial<TFormData> {
		const formData = super.getFormData();
		formData.payment = this.payment;
		return formData;
	}
	//очищает форму
	clearOrderForm(): void {
		this.clearValue();
		this.toggleCard(false);
		this.toggleCash(false);
	}
}
