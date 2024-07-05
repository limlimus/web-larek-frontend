import { EventEmitter } from "../components/base/events";
import { Catalog, BasketModel } from "./models";

//интерфейс данных продукта
export interface IProductItem {
  id: TProductId;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

//интерфейс данных заказа
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: TProductId[];
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
  totalProducts?: number;
  items: IProductItem[];
  setItems(items: IProductItem[]):void;
  getProduct(id: TProductId): IProductItem[];
  openProduct(id: TProductId): IProductItem;
}

//интерфейс модели корзины
export interface IBasketModel {
  items: Map<string, number> | null;
  totalPrice: number;
  add(id: TProductId): void;
  remove(id: TProductId): void;
}




export type TProductId = string;
export type TPayment = 'Онлайн' | 'При получении';
export type Category = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое';

export type TProductInBasketInfo = Pick<IProductItem, 'title' | 'id' | 'price'>;
export type TFormData = Pick<IOrderRequest, 'payment' | 'address' | 'phone' | 'email'>;



//инициализация
const api = newShopAPI();
const events = new EventEmitter();
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const catalogModel = new Catalog(events);

//можно собрать в функции или классы отдельные экраны с логикой их формирования
function renderBasket(items: string[]) {
  basketView.render(
    items.map(id => {
      const itemView = new BasketItemView(events);
      return itemView.render(catalogModel.getProduct(id));
    })
  );
}

//при изменении рендерим
events.on('basket:change', (event: { items: string[] }) => {
  renderBasket(event.items);
});

//при действиях изменяем модель, а после этого случится рендер
events.on('ui:basket-add', (event: { id: string }) => {
  basketModel.add(event.id);
});

events.on('ui:basket-remove', (event: { id: string}) => {
  basketModel.remove(event.id);
});

//
api.getCatalog()
  .then(catalogModel.setItems.bind(catalogModel))
  .catch(err => console.error(err));