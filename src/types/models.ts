import {
	ICatalogItems,
	IOrderModel,
	IProductItem,
	IBasketModel,
	TProductId,
	TFormData,
} from '.';
import { EventEmitter, IEvents } from '../components/base/events';

//===модели

//класс модели данных корзины товаров
export class BasketModel extends EventEmitter implements IBasketModel {
	protected _items: IProductItem[];
	protected total: number | null;
	constructor(protected events: IEvents) {
		super();
		this.events = events;
	}

	//ищет товар по id
	protected findItem(
		id: TProductId,
		items: IProductItem[]
	): IProductItem | null {
		const item = items.find((item) => item.id === id);
		if (item) {
			return item;
		} else {
			console.error(`Товар с id ${id} не найден.`);
			return null;
		}
	}

	//добавляет товар в корзину, проверяет по id его наличие в каталоге товаров
	add(item: IProductItem): void {
		const foundItem = this.findItem(item.id, this._items);

		if (!foundItem) {
			this._items.push(foundItem);
		} else {
			console.error(`Товар с id ${item.id} уже добавлен.`);
			return;
		}
		this._changed();
	}

	//удаляет товар с указанным id из корзины
	remove(product: IProductItem): void {
		const itemToRemove = this.findItem(product.id, this._items);
		if (!itemToRemove) {
			return;
		}
		this._items = this._items.filter((item) => item.id !== product.id);
		this.total = this.calcTotal();
		this._changed();
	}

	//выдает список товаров в корзине
	getBasketItems() {
		return this._items;
	}

	//возвращает id товаров в корзине| товар с ценой 0 не должен попадать в запрос на сервер
	getBasketItemsId() {
		return this._items
			.filter((item) => item.price !== null)
			.map((item) => item.id);
	}

	//генерирует уведомление об изменении
	protected _changed() {
		this.calcTotal();
		this.events.emit('basket:changed', {
			items: Array.from(this._items.keys()),
			totalPrice: this.total,
		});
	}

	//считает сумму всех TProductInBasketInfo.price в корзине
	calcTotal() {
		let total = 0;
		for (const item of this._items) {
			if (item.price !== null) {
				total += item.price;
			}
		}
		return total;
	}

	//очищает корзину
	clearBasket() {
		this._items.map((item) => this.remove(item));
	}
}

//класс модели данных каталога товаров
export class CatalogModel extends EventEmitter implements ICatalogItems {
	protected _items: IProductItem[];
	constructor(protected events: IEvents) {
		super();
		this.events = events;
	}

	//сохраняет список продуктов в каталог
	setItems(items: IProductItem[]): void {
		this._items = items;
		this._changed();
	}

	//ищет по id итем и возаращает продукт
	getProduct(id: TProductId): IProductItem | null {
		const item = this._items.find((item) => item.id === id);
		if (item) {
			return item;
		} else {
			console.error(`Товар с id ${id} не найден.`);
			return null;
		}
	}

	//метод, генерирующий уведомление об изменении каталога
	protected _changed(): void {
		this.events.emit('catalog:changed', Array.from(this._items));
	}
}

//класс модели данных заказа
export class OrderModel extends EventEmitter implements IOrderModel {
	protected buyerData: TFormData;
	protected total: number;
	protected items: TProductId[];
	constructor(protected events: IEvents) {
		super();
		this.events = events;
	}

	//обновляет данные покупателя
	updateOrder(buyerData: Partial<TFormData>): void {
		this.buyerData = { ...this.buyerData, ...buyerData };
	}

	//метод получения данных выбранных товаров и общей суммы товаров из корзины
	setBasketData(basketData: { items: TProductId[]; totalPrice: number }): void {
		this.items = basketData.items;
		this.total = basketData.totalPrice;
	}

	//возвращает данные заказа
	getOrderData(): TFormData {
		const orderData = {
			...this.buyerData,
			total: this.total,
			items: this.items,
		};
		return orderData;
	}
}
