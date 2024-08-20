import 'src/scss/styles.scss';
import { EventEmitter } from './components/base/events';
import {
  BasketModel,
  CatalogModel,
  OrderModel
} from './types/models'
import {
  CatalogView,
  ProductCard,
  BasketView,
  Modal,
  OrderForm,
  ContactsForm,
  SuccessView
} from './types/views'
import { IProductItem } from './types';
import { ApiListResponse, Api} from './components/base/api';
import { TFormData } from './types';
import { API_URL } from './utils/constants';
import {
  BasketButtonPresenter,
  CatalogPresenter,
  PreviewProductPresenter,
  BasketPresenter,
  OrderFormPresenter,
  ContactsFormPresenter,
  SuccessViewPresenter
} from './components/base/presenters'

//===инициализация

const api = new Api(API_URL)
const events =new EventEmitter()
const modal=new Modal()
const catalogModel = new CatalogModel(events)
const basketModel = new BasketModel(events)
const orderModel= new OrderModel(events)

const previewCard = new ProductCard('card-preview')
const basketCard = new ProductCard('card-basket')
const catalogCard = new ProductCard('card-catalog')
const catalogView = new CatalogView(catalogCard)

const basketView = new BasketView()
const orderForm= new OrderForm('order')
const contactsForm = new ContactsForm('contacts')
const successView = new SuccessView('success')

const basketButtonPresenter = new BasketButtonPresenter(events)
const catalogPresenter = new CatalogPresenter(events, catalogView)
const previewProductPresenter = new PreviewProductPresenter(events, modal, previewCard)
const basketPresenter = new BasketPresenter(events, modal, basketCard, basketModel, basketView)
const orderFormPresenter = new OrderFormPresenter(events, orderForm, modal)
const contactsFormPresenter = new ContactsFormPresenter(events, contactsForm, modal)
const successViewPresenter = new SuccessViewPresenter(events, successView, modal, basketModel)





function main() {
  //c помощью api делается запрос на сервер, который возвращает данные каталога продуктов, они попадают в КаталогМодель.
  //респонс => catalogModel.setItems(data)

  api.get('product').then((response:ApiListResponse<IProductItem>) => catalogModel.setItems(response.items));

  events.on('UI:basket-add', (product: IProductItem) => basketModel.add(product));

  events.on('UI:basket-remove', (product: IProductItem)=> basketModel.remove(product));

  events.on('order:submit', (orderFormData: Partial<TFormData>) => {
    orderModel.updateOrder(orderFormData);
    events.emit('contacts:open')
    }
  );

  events.on('contacts:submit',(contactsFormData:Partial<TFormData>) => {
    orderModel.updateOrder(contactsFormData);
    api.post('order', orderModel.getOrderData())
      .then((response: Response)=>{
        events.emit('success:open',{totalPrice: basketModel.calcTotal()})
      }
    );
  });

  events.on('order:close', ()=>{
    modal.close();
    basketModel.clearBasket();
  });
}

main();