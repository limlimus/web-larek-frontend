import { CatalogView, ProductCard, BasketView, Modal, OrderForm, ContactsForm, SuccessView, BasketBattonView  } from '../../types/views';
import { IEvents } from "./events";
import { IProductItem} from '../../types';
import { BasketModel } from '../../types/models';
//===презентеры

//BasketButtonPresenter  создает кнопку, вешает слушатель на 'basket:open', реагирует на 'basket:changed',меняет индекс количества покупок
export class BasketButtonPresenter {
  protected basketViewInstance;
  constructor(protected events: IEvents){
    this.basketViewInstance = new BasketBattonView(this.onBasketClick)
  }

  onBasketClick(): void {
    this.events.emit('basket:open');
  }

  bindRender():void {
    this.events.on('basket:change', (message: {items:Array<Record<string,string>>, string: number})=> {
      this.basketViewInstance.render(message.items.length)});
    }
}

//catalogPresenter реагирует на событие'catalog:changed' и отрисовывает каталог
export class CatalogPresenter {
  protected catalogContainer: HTMLElement;
  constructor(protected events: IEvents, private catalogView: CatalogView){
  this.catalogContainer = document.querySelector('.catalog') as HTMLElement;
  this.bindEvent();
  }

  bindEvent(): void {
  this.events.on('catalog:changed', (products: IProductItem[])=> this.catalogView.renderCards(products, this.clickCatalogItem))
  }

  clickCatalogItem(product: IProductItem): void {
     this.events.emit('preview:open', product)
  }
}

//previewProductPresenter реагирует на событие preview:open и открывается модальное окно с превью картой товара
export class PreviewProductPresenter {
constructor(protected events: IEvents, private modal: Modal, private previewCard: ProductCard) {
  this.bindEvent();
}

bindEvent(): void {
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

//basketPresenter реагирует на событие basket:open и открывает модальное окно с корзиной товаров
export class BasketPresenter {
  constructor(protected events: IEvents, private modal:Modal, private basketCard: ProductCard, private basketModel:BasketModel, private basketView: BasketView){
    this.bindEvent();
  }

  bindEvent(): void {
    this.events.on('basket:open',()=>{
      const basketListHtml = this.basketModel.getBasketItems().map((item, index) =>
        this.basketCard.render({
          ...item, basketIndex:index
        },
         ()=>{
          this.events.emit('UI:basket-remove', item)
          }
    ))
    const basketViewHtml = this.basketView.render(this.basketModel.calcTotal(), basketListHtml,
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

//OrderPresenter реагирует на событие 'order:open' и показывает модальное окно с формой заказа
export class OrderFormPresenter {
  constructor(protected events: IEvents, private orderForm: OrderForm, private modal:Modal){
    this.bindEvent();
  }

  bindEvent(): void {
    this.events.on('order:open', ()=>{
      const orderFormHtml = this.orderForm.render(() => {
        this.events.emit('order:submit', () => this.orderForm.getFormValue())
        this.events.emit('contacts:open')
        }
      )
      this.modal.render(orderFormHtml);
    });
  }
}

//ContactsPresenter реагирует на событие 'contacts:open' и показывает модальное окно с формой контактов
export class ContactsFormPresenter {
  constructor(protected events: IEvents, private contactsForm: ContactsForm, private modal:Modal){
    this.bindEvent();
  }

  bindEvent(): void {
    this.events.on('contacts:open', ()=> {
      const contactsFormHtml = this.contactsForm.render(()=>{
        this.events.emit('contacts:submit', () => this.contactsForm.getFormValue())
      })
      this.modal.render(contactsFormHtml);
    });
  }
}

//SuccessPresenter реагирует на событие 'success:open' и показывает окно подтверждения оплаты
export class SuccessViewPresenter {
  constructor(protected events: IEvents, private successView: SuccessView, private modal:Modal, private basketModel:BasketModel){
    this.bindEvent();
  }
  bindEvent(): void {
    this.events.on('success:open',()=>{
      const successViewHtml = this.successView.render(this.basketModel.calcTotal(), () => {
        this.events.emit('order:close');
      })
      this.modal.render(successViewHtml);
    })
  }
}