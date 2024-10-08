import { IEvents } from '../components/base/events';

//Типы
export type TProductId = string;
export type TPayment = 'Онлайн' | 'При получении';
export type Category =
	| 'хард-скил'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое';
export type TProductInBasketInfo = Pick<IProductItem, 'title' | 'id' | 'price'>;
export type TFormData = Pick<
	IOrderRequest,
	'payment' | 'address' | 'phone' | 'email'
>;

//интерфейс данных продукта
export interface IProductItem {
	id: TProductId;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number | null;
	basketIndex?: number;
}

//интерфейс данных заказа
export interface IOrderRequest {
	payment: TPayment;
	address: string;
	phone: string;
	email: string;
	total: number;
	items: TProductId[];
}

//Интерфейс данных, получаемых при заказе
export interface IOrderResponse {
	orderId: string;
	totalPrice: number;
}

//Интерфейс ошибки запроса
export interface IRequestError {
	error: string;
}

//интерефейс каталога товаров
export interface ICatalogItems {
	setItems(items: IProductItem[]): void;
	getProduct(id: TProductId): TProductInBasketInfo | null;
}

//интерфейс модели корзины
export interface IBasketModel {
	add(item: IProductItem): void;
	remove(product: IProductItem): void;
}

//интерфейс модели заказа
export interface IOrderModel {
	updateOrder(buyerData: Partial<TFormData>): void;
	setBasketData(basketData: { items: TProductId[]; totalPrice: number }): void;
	getOrderData(): Partial<TFormData>;
}

//интерфейс класса представления
export interface IView<T> {
	element: HTMLElement; //корневой элемент
	copy(): IView<T>; //копирующий конструктор
	render(data?: T): HTMLElement; //метод рендера
}

//интерфейс формы
export interface IForm {
	render(callback: () => void): HTMLFormElement;
	clearValue(): void;
	getFormValue(): Partial<TFormData>;
}

//интерфейс модального окна
export interface IModal {
	open(): void;
	close(): void;
}

//интерфейс презентера
export interface IPresenter {
	bindEvent(): void;
}
