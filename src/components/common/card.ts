import { Component } from '../base/component';
import { IProductItem } from '../../types/index';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface IRenderData {
	product: IProductItem;
	callback: Function;
}

// класс отображения карточки товара
export class ProductCard extends Component {
	protected productTemeplate: HTMLTemplateElement;
	protected product: IProductItem;
	protected titleProduct: HTMLElement;
	protected priceElement: HTMLSpanElement;
	protected button: HTMLButtonElement;
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement;
	protected descriptionProduct?: HTMLElement;
	protected basketItemIndex?: HTMLElement;

	constructor(protected templateId: string) {
		super();
		this.productTemeplate = ensureElement<HTMLTemplateElement>(
			`#${templateId}`,
			document
		);
		this.titleProduct = ensureElement<HTMLElement>(
			'.card__title',
			this.productTemeplate.content
		);
		this.priceElement = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.productTemeplate.content
		);
		this.button = ensureElement<HTMLButtonElement>(
			'button',
			this.productTemeplate.content
		);
		this.imageElement =
			this.productTemeplate.content.querySelector('.card__image');

		this.categoryElement =
			this.productTemeplate.content.querySelector('.card__category');

		this.descriptionProduct =
			this.productTemeplate.content.querySelector('.card__text');

		this.basketItemIndex = this.productTemeplate.content.querySelector(
			'.basket__item-index'
		);
	}

	//метод рендера карточки
	render(data: IRenderData): HTMLElement {
    this.setText(this.titleProduct, data.product.title);
    this.setText(this.priceElement, `${data.product.price} синапсов`);

		if (this.basketItemIndex) {
			this.setText(this.basketItemIndex, `${data.product.basketIndex + 1}`);
		}

		this.setImage(this.imageElement, `${CDN_URL}${data.product.image}`);
		this.setText(this.descriptionProduct, data.product.description);
		this.setText(this.categoryElement, data.product.category);
		const cloned = this.productTemeplate.content.cloneNode(true) as HTMLElement;
    const actionButton = ensureElement<HTMLButtonElement>('button', cloned)
		actionButton.addEventListener(
			'click',
			() => data.callback(data.product)
		);

    if(this.templateId === 'card-preview') {
      if (data.product.price === null) {
        this.setDisabled(actionButton, true);
      }
    }

		this.clean();
		return cloned;
	}

	//метод очистки темплейта
	clean(): void {
    this.setText(this.titleProduct, '');
    this.setText(this.priceElement, '');
		if (this.imageElement) {
      this.setImage(this.imageElement, '');
		}
		if (this.descriptionProduct) {
      this.setText(this.descriptionProduct, '');
		}
		if (this.categoryElement) {
      this.setText(this.categoryElement, '');
		}
    if (this.basketItemIndex) {
      this.setText(this.basketItemIndex, '');
    }
	}
}
