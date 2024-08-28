import { IProductItem, IModal, IForm, TFormData } from '.';
import { ensureElement } from '../utils/utils';
import { CDN_URL } from '../utils/constants'

//===отображения

//базовый класс отображений
abstract class View {
	protected submitButton?: HTMLButtonElement;
  constructor() {}
	render(data: unknown): HTMLElement | void {}

	checkValidation?(condition: boolean): void {
		if (condition) {
			this.submitButton.classList.add('disabled');
		} else {
			this.submitButton.classList.remove('disabled');
		}
	}
	ensureElement = ensureElement;
}

//const cards = itemList.map( catalogCard.render(product, callback(колбек должен вызвать событие preview:open(productID)) ()=> this.clickCatalogItem(product)

// класс отображения карточки товара
export class ProductCard extends View {
	protected productTemeplate: HTMLTemplateElement;
	protected product: IProductItem;
	protected titleProduct: HTMLElement;
	protected priceElement: HTMLSpanElement;
	protected button: HTMLButtonElement;
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement;
	protected descriptionProduct?: HTMLElement;
	protected basketItemIndex?: HTMLElement;

	constructor(templateId: string) {
		super();
		this.productTemeplate = document.getElementById(templateId) as HTMLTemplateElement;
		this.titleProduct = this.productTemeplate.content.querySelector('.card__title');
		this.priceElement = this.productTemeplate.content.querySelector('.card__price');
		this.button = this.productTemeplate.content.querySelector('.card__button');
		this.imageElement = this.productTemeplate.content.querySelector('.card__image');
		this.categoryElement =
			this.productTemeplate.content.querySelector('.card__category');
		this.descriptionProduct =
			this.productTemeplate.content.querySelector('.card__text');
		this.basketItemIndex = this.productTemeplate.content.querySelector(
			'.basket__item-index'
		);
	}

	//метод рендера карточки
	render(data: { product: IProductItem; callback: Function }): HTMLElement {
		this.ensureElement(this.productTemeplate);
		this.titleProduct.textContent = data.product.title;
		this.priceElement.textContent = `${data.product.price}`;
		//this.button.addEventListener('click', () => data.callback(data.product));

		if (this.basketItemIndex) {
			this.basketItemIndex.textContent = `${data.product.basketIndex + 1}`;
		}
		if (this.imageElement) {
			this.imageElement.src = `${CDN_URL}${data.product.image}`;
		}
		if (this.descriptionProduct) {
			this.descriptionProduct.textContent = data.product.description;
		}
		if (this.categoryElement) {
			this.categoryElement.textContent = data.product.category;
		}
		const cloned = this.productTemeplate.content.cloneNode(true) as HTMLElement;
    cloned.querySelector('.card__button').addEventListener('click', () => data.callback(data.product));
		this.clean();
		return cloned;
	}

	//метод очистки темплейта
	clean(): void {
		this.titleProduct.textContent = '';
		this.priceElement.textContent = '';
		if (this.imageElement) {
			this.imageElement.src = '';
		}
		if (this.descriptionProduct) {
			this.descriptionProduct.textContent = '';
		}
		if (this.categoryElement) {
			this.categoryElement.textContent = '';
		}
		this.button.removeEventListener<'click'>;
	}
}

//класс отображения каталога
export class CatalogView extends View {
	protected container: HTMLElement;
	protected cards: ProductCard[];
	constructor(private catalogCard: ProductCard) {
		super();
		this.container = document.querySelector('.gallery') as HTMLElement;
	}
	render(data: {
		products: IProductItem[];
		callback: (product: IProductItem) => void;
	}): HTMLElement {
		this.ensureElement(this.container);
		this.container.innerHTML = '';
		const cards = data.products.map((product) =>
			this.catalogCard.render({ product, callback: data.callback })
		);
console.log(cards)
		cards.forEach((card) => {
			this.container.append(card);
		});

		return this.container;
	}
}

//класс отображения корзины
export class BasketView extends View {
	protected items: ProductCard[];
	protected template: HTMLTemplateElement;
	protected basketList: HTMLElement;
	protected submitButton: HTMLButtonElement;
	protected basketTotalPrice: HTMLElement;

	constructor() {
		super();
		this.template = document.getElementById('basket') as HTMLTemplateElement;
		this.basketList = this.template.querySelector('.basket__list');
		this.submitButton = this.template.querySelector('.basket__button');
		this.basketTotalPrice = this.template.querySelector('.basket__price');
	}

	//рендер корзины
	render(data: {
		totalPrice: number;
		itemList?: HTMLElement[];
		callback?: () => void;
	}): HTMLElement {
		if (data.itemList) {
			data.itemList.map((item) => {
				this.basketList.appendChild(item);
			});
			return this.basketList;
		}
		this.submitButton.addEventListener('click', () => data.callback());
		this.basketTotalPrice.textContent = `${data.totalPrice}`;
		super.checkValidation(!data.totalPrice);
		const container = this.template.cloneNode(true) as HTMLElement;
		this.ensureElement(container);
		this.clean();
		return container;
	}

	clean(): void {
		this.basketTotalPrice.textContent = ``;
		this.submitButton.removeEventListener<'click'>;
	}
}

//класс отображения модального окна
export class Modal extends View implements IModal {
	protected closeButton: HTMLButtonElement;
	protected container: HTMLElement;
	protected content: HTMLElement;
	constructor() {
		super();
		this.container = document.getElementById('modal-container');
		this.ensureElement(this.container);
		this.closeButton = this.container.querySelector('.modal__close');
		this.content = this.container.querySelector('.modal__content');
		//document.addEventListener('click', (event) =>
		//	this.handleCloseOnOverlay(event)
		//);
		this.container.addEventListener('keydown', (event) =>
			this.handleClosePopupOnEsc(event)
		);
		this.closeButton.addEventListener('click', (event) =>
			this.handleCloseWithButton(event)
		);
	}

	//метод открытия модального окна
	open(): void {
		this.ensureElement(this.container);
		this.container.classList.add('modal_active');
	}

	// метод рендера модального окна
	render(value: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.replaceChildren(value);
	}

	//метод закрытия модального окна
	close(): void {
		this.container.classList.remove('modal_active');
		this.content.innerHTML = '';
	}

	//метод, закрывающий попап по кнопке закрытия
	handleCloseWithButton(event: MouseEvent): void {
		this.close();
		event.stopPropagation();
	}

	//метод, закрывающий попап кликом по оверлею
	handleCloseOnOverlay(event: MouseEvent): void {
		if (event.target !== this.container) {
			this.close();
			document.removeEventListener<'click'>;
		}
	}

	//метод, закрывающий попап клавишей Esc
	handleClosePopupOnEsc(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			this.close();
		}
	}
}

//класс отображения формы заказа
export class OrderForm extends View implements IForm {
	protected formElement: HTMLFormElement;
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected inputField: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected formTemplate: HTMLTemplateElement;

	constructor(templateId: string) {
		super();
		this.formTemplate = document.getElementById(templateId) as HTMLTemplateElement;
		this.ensureElement(this.formTemplate);
		this.formElement = this.formTemplate.content.querySelector('.form');
		this.inputField = this.formElement.querySelector('.form__input');
		this.cardButton = this.formElement.querySelector('[name="card"]');
		this.cashButton = this.formElement.querySelector('[name="cash"]');
		this.submitButton = this.formElement.querySelector('.button');
	}

	//метод рендера элемента
	render(callback: () => void): HTMLFormElement {
		this.cardButton.addEventListener('click', (event) =>
			this.handlePaymentClick(event)
		);
		this.cashButton.addEventListener('click', (event) =>
			this.handlePaymentClick(event)
		);
		this.submitButton.addEventListener('click', callback);
		const condition =
			!(
				this.cardButton.classList.contains('.button_alt-active') ||
				this.cardButton.classList.contains('.button_alt-active')
			) || !this.inputField.validity.valid;
		super.checkValidation(condition);
		const container = this.formTemplate.cloneNode(true) as HTMLFormElement;
		return container;
	}

	//метод получения выбранного способа оплаты
	handlePaymentClick(event: MouseEvent): void {
		const button = event.target;
		if (button === this.cardButton) {
			this.cardButton.classList.add('.button_alt-active');
			this.cashButton.classList.remove('.button_alt-active');
		}
		if (button === this.cashButton) {
			this.cashButton.classList.add('.button_alt-active');
			this.cardButton.classList.remove('.button_alt-active');
		}
	}

	//возвращает данные формы
	getFormValue(): Partial<TFormData> {
		const FormData: Partial<TFormData> = {};
		if (this.cardButton.classList.contains('button_alt-active')) {
			FormData.payment = 'Онлайн';
		}
		if (this.cashButton.classList.contains('button_alt-active')) {
			FormData.payment = 'При получении';
		}
		FormData.address = this.inputField.value;
		return FormData;
	}

	//метод, очищающий поля формы
	clearValue(): void {
		this.formElement.reset();
	}
}

//класс отображения формы контактов
export class ContactsForm extends View implements IForm {
	protected formElement: HTMLFormElement;
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected formTemplate: HTMLTemplateElement;

	constructor(templateId: string) {
		super();
		this.formTemplate = document.getElementById(templateId) as HTMLTemplateElement;

		this.formElement = this.formTemplate.content.querySelector('.form');
		this.inputEmail = this.formElement.querySelector('[name="email"]');
		this.inputPhone = this.formElement.querySelector('[name="phone"]');
		this.submitButton = this.formElement.querySelector('.button');
	}

	//метод рендера элемента
	render(callback: () => void): HTMLFormElement {
		this.inputEmail.addEventListener('keydown', (evt: KeyboardEvent) => {
			super.checkValidation(!this.inputEmail.validity.valid);
		});
		this.inputPhone.addEventListener('keydown', (evt: KeyboardEvent) => {
			this.checkValidation(!this.inputPhone.validity.valid);
		});
		this.submitButton.addEventListener('click', callback);
		const container = this.formTemplate.cloneNode(true) as HTMLFormElement;
		return container;
	}

	//сохраняет данные полей ввода формы
	getFormValue(): Partial<TFormData> {
		const FormData: Partial<TFormData> = {};
		FormData.email = this.inputEmail.value;
		FormData.phone = this.inputPhone.value;
		return FormData;
	}

	//метод, очищающий поля формы
	clearValue(): void {
		this.formElement.reset();
	}
}

//класс отображения сообщения об успешной оплате
export class SuccessView extends View {
	protected successButton: HTMLButtonElement;
	protected successText: HTMLElement;
	protected template: HTMLTemplateElement;
	protected container: HTMLElement;

	constructor(templateId: string) {
		super();
		this.template = document.getElementById(templateId) as HTMLTemplateElement;
		this.ensureElement(this.template);
		this.successText = this.template.querySelector('.film__description');
		this.successButton = this.template.querySelector('.order-success__close');
	}

	// метод рендера элемента
	render(data: { totalPrice: number; callback: () => void }): HTMLElement {
		this.successText.textContent = `Списано ${data.totalPrice} синапсов`;
		this.successButton.addEventListener('order: close', () => data.callback);
		const container = this.template.cloneNode(true) as HTMLElement;
		this.clean();
		return container;
	}

	// метод очищает текст сообщения и снимает слушатель
	clean(): void {
		this.successText.textContent = `Списано 0 синапсов`;
		this.successButton.removeEventListener<'click'>;
	}
}

// класс отображения кнопки корзины
export class BasketBattonView extends View {
	protected basketCounter: HTMLElement;
	protected basketOpenButton: HTMLElement;
	constructor(callback: () => void) {
		super();
		this.basketOpenButton = document.querySelector('.header__basket');
		this.ensureElement(this.basketOpenButton);
		this.basketCounter = document.querySelector('.header__basket-counter');
		this.basketCounter.textContent = '0';
		this.basketOpenButton.addEventListener('click', callback);
	}

	render(count: number): void {
		this.basketCounter.textContent = `${count}`;
	}
}
