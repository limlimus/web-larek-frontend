import { IProductItem } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { ProductCard } from './card';
import { IEvents } from '../base/events';

//класс отображения каталога
export class CatalogView extends Component {
	protected container: HTMLElement;
	protected cards: ProductCard[];
	constructor(private catalogCard: ProductCard) {
		super();
		this.container = ensureElement<HTMLElement>('.gallery', document);
	}

	render(data: {
		products: IProductItem[];
		callback: (product: IProductItem) => void;
	}): HTMLElement {
		this.container.innerHTML = '';
		const cards = data.products.map((product) =>
			this.catalogCard.render({ product, callback: data.callback })
		);
		cards.forEach((card) => {
			this.container.append(card);
		});
		return this.container;
	}
}
