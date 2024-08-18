import { CatalogView, ProductCard, BasketView, Modal, OrderForm, ContactsForm, SuccessView, BasketBattonView  } from '../../types/views';
import { EventEmitter, IEvents } from "./events";
import { IProductItem} from '../../types';
import { BasketModel } from '../../types/models';
//===презентер


export class BasketButtonPresenter {
  protected basketViewInstance;
  constructor(protected events: IEvents){
    this.basketViewInstance = new BasketBattonView(this.onBasketClick)
  }
  onBasketClick() {
    this.events.emit('basket:open');
  }
  bindRender() {
    this.events.on('basket:change', (message: {items:Array<Record<string,string>>, string: number})=> {
      this.basketViewInstance.render(message.items.length)});
    }
}

export class CatalogPresenter {

  protected catalogContainer: HTMLElement;

  constructor(protected events: IEvents, private catalogView: CatalogView){
  this.catalogContainer = document.querySelector('.catalog') as HTMLElement;
  this.bindEvent();
  }

  bindEvent(){
  this.events.on('catalog:changed', (products: IProductItem[])=> this.catalogView.renderCards(products, this.clickCatalogItem))
  }

  clickCatalogItem(product){
     this.events.emit('preview:open', product)
  }
}

export class PreviewProductPresenter {
constructor(protected events: IEvents, private modal: Modal, private previewCard: ProductCard ){
  this.bindEvent();
}

bindEvent(){
  this.events.on('preview:open', (product: IProductItem) => {
  const previewCardHtml = this.previewCard.render(product, (item: IProductItem) => {
    this.events.emit('UI:basket-add', item);
    this.modal.close();
  })
  this.modal.render(previewCardHtml);
  this.modal.open();
  })
  }
}

export class BasketPresenter {
  constructor(protected events: IEvents, private modal:Modal, private basketCard: ProductCard, private basketModel:BasketModel, private basketView: BasketView){
    this.bindEvent();
  }

  bindEvent() {
    this.events.on('basket:open',()=>{
      const basketListHTML = this.basketModel.getBasketItems().map((item, index) =>
        this.basketCard.render({
          ...item, basketIndex:index
        },
         ()=>{
          this.events.emit('UI:basket-remove', item)
          }
    ))

    const basketViewHtml = this.basketView.render(this.basketModel.calcTotal(), basketListHTML,
    ()=>{
      this.events.emit('order:open')
    }
    );
    this.modal.render(basketViewHtml);
    this.modal.open();
    }
    )
  }
}


//OrderPresenter реагирует на событие 'order:open'
//показывает модальное окно с формой заказа.

//const orderFormHtml = orderForm.render(callback(вызывает событие 'order:submit'(orderForm.getFormValue)
//коллбек события order:submit добавляет данные из формы в orderModel,
//и вызывает событие 'contacts:open'
//modal.render(orderFormHtml)

//ContactsPresenter реагирует на событие 'contacts:open'
//показывает модальное окно с формой контактов

//const contactsFormHtml = contactsForm.render(callback(вызывает событие 'contacts:submit'(contactsForm.getFormValue)
//коллбек события contacts:submit добавляет данные из формы в contactsModel,
//вызывает метод orderModel.setBasketData(basketModel.getBasketItemsId, bascetModel.totalPrice),
//делает POST запрос на сервер с данными покупателя,
//после получения кода 200 вызывает событие 'success:open'
//modal.render(contactsFormHtml)

//SuccessPresenter реагирует на событие 'success:open'
//показывает окно подтверждения оплаты

//const successViewHtml = successView.render(basketModel.total.Price,callback)
//коллбек вызывает событие 'order:close', которое закроет модальное окно и очистит данные в basketModel
//modal.render(successViewHtml)

//BasketButtonPresenter  создает кнопку, вешает слушатель на 'basket:open', реагирует на 'basket:changed',меняет индекс количества покупок


export class OrderPresenter {
  constructor(protected events: IEvents,){
    this.bindEvent();
  }

  bindEvent(){
this.events.on('order:open', ()=>{

  
});



  }
}