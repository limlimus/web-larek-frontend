import { IEvents } from "../components/base/events";

//Типы
export type TProductId = string;
export type TPayment = 'Онлайн' | 'При получении';
export type Category = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое';
export type TProductInBasketInfo = Pick<IProductItem, 'title' | 'id' | 'price'>;
export type TFormData = Pick<IOrderRequest, 'payment' | 'address' | 'phone' | 'email'>;

//интерфейс данных продукта
export interface IProductItem {
  id: TProductId;
  description: string;
  image: string;
  title: string;
  category: string;
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

export interface IOrderModel extends IEvents {
  updateOrder(oderData: TFormData): void;
}

export interface IOrderResponse {
  orderId: string;
  totalPrice: number;
}

export interface IRequestError {
  error: string;
}

//интерефейс каталога товаров
export interface ICatalogItems {
  setItems(items: IProductItem[]):void;
  getProduct(id: TProductId): TProductInBasketInfo | null;
}

//интерфейс модели корзины
export interface IBasketModel {
  add(item: IProductItem): void;
  remove(product: IProductItem): void;
}


type ViewChild = HTMLElement | HTMLElement[];
//проверка наличия дочернего элемента
function isChildElement(x: unknown): x is ViewChild {
    return x instanceof HTMLElement || Array.isArray(x);
}


export interface IView<T> {
  element: HTMLElement; //корневой элемент
  copy(): IView<T>; //копирующий конструктор
  render(data?: T): HTMLElement; //метод рендера
}

//интерфейс формы
export interface IForm{
  render(callback: ()=> void): HTMLFormElement;
  clearValue(): void;
  getFormValue(): Partial<TFormData>;
}

//интерфейс модального окна
export interface IModal{
  open(): void;
  close():void;
}