import { IEventEmitter, IEvent } from "..\components\base\events.ts"
import { TProductId, IProductItem, IBasketModel } from ".";

//отображения

export interface IViewConstructor {
  new (container: HTMLElement, events?: IEventEmitter): IView; //на входе контейнер, в него будем выводить
}

export interface IView {
  render(data?: object): HTMLElement;
}

//интерфейс модального окна предпросмотра продукта
export interface IModal {
  modal: HTMLElement;
  events: IEvent;
  constructor(events: IEvent): void;
}

//абстрактный интерфейс модального окна
abstract class Modal implements IModal {

}
//интерфейс модального окна предпросмотра продукта
export interface IPreveiwModal {
  product: IProductItem;
  basket: IBasketModel;
  buyProduct(): void;
  close(): void;
}
//интерфейс модального окна корзины товаров
export interface BasketModal extends Modal {

}
//интерфейс модального окна формы оплаты
export interface PaymentFormModal extends Modal {

}
//интерфейс модального окна формы контактов покупателя
export interface ContactFormModal extends Modal {

}
//интерфейс модального окна сообщения об успешной оплате
export interface SuccessModal extends Modal {

}





export class BasketItemView implements IView {
  protected title: HTMLSpanElement;
  protected addButton: HTMLButtonElement;
  protected removeButton: HTMLButtonElement;

  protected id: TProductId | null = null;

  constructor( protected container: HTMLElement, protected events: IEventEmitter) {
    this.title = container.querySelector('.basket-item__title') as HTMLSpanElement;
    this. addButton = container.querySelector('.basket-item__add') as HTMLButtonElement;
    this.removeButton = container.querySelector('.basket-item__remove') as HTMLButtonElement;

    this.addButton.addEventListener('click', () => {
      this.events.emit('ui:basket-remove', { id: this.id });
    });
  }

  render(data: { id: TProductId, title: string }) {
    if (data) {
      this.id = data.id;
      this.title.textContent = data.title;
    }
    return this.container;
  }
}

export class BasketView implements IView {
  constructor(protected container: HTMLElement) {}
    render(data: { items: HTMLElement[] }) {
      if (data) {
        this.container.replaceChildren(...data.items);
      }
      return this.container;
    }
}
