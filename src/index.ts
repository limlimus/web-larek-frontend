import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel, CatalogModel, OrderModel } from './types/models';
import {
	BasketBattonView,
	CatalogView,
	ProductCard,
	BasketView,
	Modal,
	OrderForm,
	ContactsForm,
	SuccessView,
} from './types/views';
import { IProductItem } from './types';
import { AppApi } from './components/base/api';
import { TFormData } from './types';
import { API_URL } from './utils/constants';
import { Presenter } from './components/base/presenters';

//===инициализация

const api = new AppApi(API_URL);
const events = new EventEmitter();
const modal = new Modal();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const previewCard = new ProductCard('card-preview');
const basketCard = new ProductCard('card-basket');
const catalogCard = new ProductCard('card-catalog');
const catalogView = new CatalogView(catalogCard);
const basketViewInstance = new BasketBattonView(() => {
	events.emit('basket:open');
});

const basketView = new BasketView();
const orderForm = new OrderForm('order');
const contactsForm = new ContactsForm('contacts');
const successView = new SuccessView('success');

const basketButtonPresenter = new Presenter(events, {
	eventName: 'basket:changed',
	callback: (message: {
		items: Array<Record<string, string>>;
		string: number;
	}) => {
		basketViewInstance.render(message.items.length);
	},
});

const catalogPresenter = new Presenter(events, {
	eventName: 'catalog:changed',
	callback: (products: IProductItem[]) => {
		catalogView.render({
			products,
			callback: (product) => {
				events.emit('preview:open', product);
			},
		});
	},
});

const previewProductPresenter = new Presenter(events, {
	eventName: 'preview:open',
	callback: (product: IProductItem) => {

		const previewCardHtml = previewCard.render({
			product,
			callback: (item: IProductItem) => {
				events.emit('UI:basket-add', item);
				modal.close();
			},
		});
		modal.render(previewCardHtml);
		modal.open();
	},
});

const basketPresenter = new Presenter(events, {
	eventName: 'basket:open',
	callback: () => {
		const basketListHtml = basketModel.getBasketItems().map((item, index) =>
			basketCard.render({
				product: {
					...item,
					basketIndex: index,
				},
				callback: () => {
					events.emit('UI:basket-remove', item);
				},
			})
		);
		const basketViewHtml = basketView.render({
			totalPrice: basketModel.calcTotal(),
			itemList: basketListHtml,
			callback: () => {
				events.emit('order:open');
			},
		});
		modal.render(basketViewHtml);
		modal.open();
	},
});

const orderFormPresenter = new Presenter(events, {
	eventName: 'order:open',
	callback: () => {
		const orderFormHtml = orderForm.render(() => {
			events.emit('order:submit', () => orderForm.getFormValue());
			events.emit('contacts:open');
		});
		modal.render(orderFormHtml);
	},
});

const contactsFormPresenter = new Presenter(events, {
	eventName: 'contacts:open',
	callback: () => {
		const contactsFormHtml = contactsForm.render(() => {
			events.emit('contacts:submit', () => contactsForm.getFormValue());
		});
		modal.render(contactsFormHtml);
	},
});

const successViewPresenter = new Presenter(events, {
	eventName: 'success:open',
	callback: () => {
		const successViewHtml = successView.render({
			totalPrice: basketModel.calcTotal(),
			callback: () => {
				events.emit('order:close');
			},
		});
		modal.render(successViewHtml);
	},
});

function main() {
	api.getProduts().then((response) => catalogModel.setItems(response.items));

	events.on('UI:basket-add', (product: IProductItem) =>
		basketModel.add(product)
	);

	events.on('UI:basket-remove', (product: IProductItem) =>
		basketModel.remove(product)
	);

	events.on('order:submit', (orderFormData: Partial<TFormData>) => {
		orderModel.updateOrder(orderFormData);
		events.emit('contacts:open');
	});

	events.on('contacts:submit', (contactsFormData: Partial<TFormData>) => {
		orderModel.updateOrder(contactsFormData);
		api.createOrder(orderModel.getOrderData()).then((response) => {
			events.emit('success:open', { totalPrice: basketModel.calcTotal() });
		});
	});

	events.on('order:close', () => {
		modal.close();
		basketModel.clearBasket();
	});
}

main();
