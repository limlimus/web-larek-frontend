import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel, CatalogModel, OrderModel } from './types/models';
import { BasketBattonView, BasketView } from './components/common/basket';

import { SuccessView } from './components/common/success';
import { ProductCard } from './components/common/card';
import { Modal } from './components/common/modal';
import { OrderForm } from './components/common/orderForm';
import { ContactsForm } from './components/common/contactsForm';
import { CatalogView } from './components/common/catalogView';
import { IProductItem } from './types';
import { AppApi } from './components/base/api';
import { TFormData } from './types';
import { API_URL } from './utils/constants';
import { Presenter } from './components/base/presenter';

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
const orderForm = new OrderForm('order', () => {
	events.emit('order:submit', orderForm.getFormValue());
	events.emit('contacts:open');
});
const contactsForm = new ContactsForm('contacts', () => {
	events.emit('contacts:submit', contactsForm.getFormValue());
});
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
		const basketViewHtml = renderBasket();
		modal.render(basketViewHtml);
		modal.open();
	},
});

const orderFormPresenter = new Presenter(events, {
	eventName: 'order:open',
	callback: () => {
		const orderFormHtml = orderForm.render();
		modal.render(orderFormHtml);
		//
		const basketData = {
			items: basketModel.getBasketItemsId(),
			totalPrice: basketModel.calcTotal(),
		};
		orderModel.setBasketData(basketData);
	},
});

const contactsFormPresenter = new Presenter(events, {
	eventName: 'contacts:open',
	callback: () => {
		const contactsFormHtml = contactsForm.render();
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

function renderBasket(): HTMLElement {
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
	return basketViewHtml;
}

function main(): void {
	api
		.getProduts()
		.then((response) => catalogModel.setItems(response.items))
		.catch((error) => {
			alert(
				'Произошла ошибка при получении данных. Пожалуйста, попробуйте позже.'
			);
		});

	events.on('UI:basket-add', (product: IProductItem) =>
		basketModel.add(product)
	);

	events.on('UI:basket-remove', (product: IProductItem) => {
		basketModel.remove(product);
		const basketViewHtml = renderBasket();
		modal.render(basketViewHtml);
	});

	events.on('order:submit', (orderFormData: Partial<TFormData>) => {
		orderModel.updateOrder(orderFormData);
		events.emit('contacts:open');
	});

	events.on('contacts:submit', (contactsFormData: Partial<TFormData>) => {
		orderModel.updateOrder(contactsFormData);
		api
			.createOrder(orderModel.getOrderData())
			.then((response) => {
				events.emit('success:open', { totalPrice: basketModel.calcTotal() });
			})
			.catch((error) => {
				alert(
					'Произошла ошибка при получении данных. Пожалуйста, попробуйте позже.'
				);
			});
	});

	events.on('order:close', () => {
		modal.close();
		basketModel.clearBasket();
	});
}

main();
