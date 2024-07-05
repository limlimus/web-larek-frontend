//модели
import { ICatalogItems, IOrderRequest, IProductItem, IBasketModel, TProductInBasketInfo, TProductId, TFormData, TPayment } from ".";
import { IEvents } from "../components/base/events";

export class BasketModel implements IBasketModel {
  protected _items: TProductInBasketInfo[];
  constructor(protected events: IEvents) {}
  add(id: string): void {
    ////
    this._changed();
  }
  remove(id: string): void {
    //...
    this._changed();  }

  protected _changed() {
    //метод, генерирующий уведомление об изменении
    this.events.emit('basket:change', { items: Array.from(this._items.keys()) });
  }
}


export class Catalog implements ICatalogItems {
  protected items: IProductItem[];
  protected total: number;
  //коллекция продуктов
  setItems(items: IProductItem[]):void;
  //получение продукта
  getProduct(id: TProductId): IProductItem[];
  //раскрытие продукта
}

export class OrderData implements IOrderRequest {
  protected payment: TPayment;
  protected email: string;
  protected phone: string;
  protected address: string;
  protected total: number;
  protected items: TProductId[];
  constructor(protected events: IEvents) {}
  checkValidation(data: Record<keyof TFormData, string>): boolean;
}



