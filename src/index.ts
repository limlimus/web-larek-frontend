import 'src/scss/styles.scss';
import { EventEmitter, IEvents } from './components/base/events';
import { BasketModel, CatalogModel, OrderModel } from './types/models'
import { CatalogView, ProductCard, BasketView, Modal, OrderForm, ContactsForm, SuccessFrom, BasketBattonView } from './types/views'
import { IProductItem } from './types';
import { ApiListResponse} from './components/base/api';
import { TProductId, TFormData } from './types';
//инициализация


const api = new Api()
const events =new EventEmitter()
const modal=new Modal()
const catalogModel = new CatalogModel(events)
const basketModel = new BasketModel(events)
const orderModel= new OrderModel(events)
const catalogPresenter = new CatalogPresenter(eventEmitter, catalogView, catalogCard) //подписан на событие catalog:changed
const previewCard = new ProductCard('card-preview', callback)
const basketCard = new ProductCard('card-basket', callback)
const catalogCard = new ProductCard('card-catalog', callback)
const catalogView = new CatalogView(catalogCard)
const previewProductPresenter = new ModalPresenter(catalogModel, previewCard,modal,eventEmitter)


const basketView = new BasketView()
const orderForm= new OrderForm()
const contactsForm = new ContactForm()
const successView = new SuccessView()

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

function newShopAPI() {
  throw new Error('Function not implemented.');
}




function main() {
  //c помощью api делается запрос на сервер, который возвращает данные каталога продуктов, они попадают в КаталогМодель.
  //респонс => catalogModel.setItems(data)

  api.getProducts().then((response:ApiListResponse<IProductItem>) => catalogModel.setItems(response.items));

  events.on('preview:open')

  events.on('UI:basket-add', (product: IProductItem) => basketModel.add(product));

  events.on('UI:basket-remove', (product: IProductItem)=> basketModel.remove(product));
  //modal.render(basketViewHtml)}  ?????

  events.on('order:submit', (orderFormData: Partial<TFormData>) =>
  {orderModel.updateOrder(orderFormData);
  events.emit('contacts:open')});

  events.on('contacts:submit',(contactsFormData:Partial<TFormData>) =>
  {orderModel.updateOrder(contactsFormData);
  api.post('order', orderModel.getOrderData())
    .then((response: Response)=>{
      events.emit('success:open',{totalPrice: basketModel.calcTotal()})
    });
  });

  events.on('success:open',)

}
  catalogModel через EventEmitter сообщает событие catalog:changed