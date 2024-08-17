import { CatalogView, ProductCard, BasketView, Modal, OrderForm, ContactsForm, SuccessView, BasketBattonView  } from '../../types/views';
import { EventEmitter, IEvents } from "./events";
import { BasketModel, CatalogModel, OrderModel } from '../../types/models'
//===презентер


export class basketButtonPresenter {
  protected basketViewInstance;
  eventEmiter: any;
  constructor(protected event: IEvents){

    const settings = {
    onBasketClick: () => this.onBasketClick();
    }
    this.basketViewInstance = new BasketView()
  }
  onBasketClick(){
    this.eventEmmiter.emit('basket:open')
  }
  bindRender (){
    this.eventEmmiter.on('basket:change', (message)=> {
      this.basketViewInstance.render(message.items.length)});
    }
}



export class  catalogPresenter {

  protected catalogContainer: HTMLElement;

constructor(eventEmitter, catalogView, catalogCard[]){
  this.catalogContainer = document.querySelector('.catalog');
  this.bindEvent();
}

init(){
// fetch catalog?
   this.eventEmmiter('catalog:fetch')....
}
bindEvent(){
this.eventEmmiter.on('catalog:update', (products)=> this.renderCards(products))
}

renderCards(products:IProductItem[]){
   this.catalogContainer.childer().remove();
  const cards = products.map(product => this.cardViewInstance.render(product, ()=> this.clickCatalogItem(product)))
  this.catalogContainer.append(cards);
}
clickCatalogItem(product){
   this.eventEmmiter('modal:open-catalog', product)
}
}


export class BasketPresenter {
 protected BasketModel;
 protected BacketView;
 protected ProductCard[];
}

