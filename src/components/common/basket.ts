import { Component } from '../base/component';
import { ProductCard } from './card';
import { ensureElement } from '../../utils/utils';

//класс отображения корзины
export class BasketView extends Component {
	protected items: ProductCard[];
	protected template: HTMLTemplateElement;
	protected basketList: HTMLElement;
	protected submitButton: HTMLButtonElement;
	protected basketTotalPrice: HTMLElement;

	constructor() {
		super();
		this.template = ensureElement<HTMLTemplateElement>('#basket', document);
		this.basketTotalPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.template.content
		);
	}

	//рендер корзины
	render(data: {
		totalPrice: number;
		itemList?: HTMLElement[];
		callback?: () => void;
	}): HTMLElement {
		this.setText(this.basketTotalPrice, `${data.totalPrice} синапсов`);
		const container = this.template.content.cloneNode(true) as HTMLElement;
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		// блокировка кнопки при 0
		if (!data.totalPrice) {
			this.setDisabled(this.submitButton, true);
		}

		this.submitButton.addEventListener('click', () => {
			if (data.callback) {
				data.callback();
			}
		});
		if (data.itemList) {
			const basketList = ensureElement<HTMLElement>('.basket__list', container);
			data.itemList.forEach((item) => {
				basketList.appendChild(item);
			});
		}
		this.clean();
		return container;
	}

	//метод очищает темплейт
	clean(): void {
		this.setText(this.basketTotalPrice, ``);
	}
}

// класс отображения кнопки корзины
export class BasketBattonView extends Component {
	protected basketCounter: HTMLElement;
	protected basketOpenButton: HTMLElement;
	constructor(callback: () => void) {
		super();
		this.basketOpenButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			document
		);
		this.basketCounter = ensureElement<HTMLButtonElement>(
			'.header__basket-counter',
			document
		);
		this.setText(this.basketCounter, '0');
		this.basketOpenButton.addEventListener('click', callback);
	}

	render(count: number): void {
		this.setText(this.basketCounter, `${count}`);
	}
}
