# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```



## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на страницеб
- слой данных, отвечает за хранение и изменение данныхб
- презентер, отвечает за связь представления и данныхю


### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опцирнальный объект с заголовками запросов.\
Конструктор принимает такие аргументы:
 - baseUrl: string - адрес сервера API запроса
 - options: RequestInit - хедеры, одинаковые для всех запросов

Методы:
 - ge(uri: string) - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
 - post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
 - handleResponse(response: Response): Promise<object> - отвечает за обработку ответа от сервера после отправки запроса.


#### Класс EventEmmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
 - on<T>(eventName: string, callback: (event: T) => void) - подписка на событие
 - off(eventName: string, callback: Subscriber) - снимает обработчик события
 - emit<T>(eventName: string, data?: T) - инициализация события
 - onAll(callback: (event: EmitterEvent) => void) - подписка на все события
 - offAll - сбросить все обработчики событий
 - trigger<T>(eventName: string, context?: Partial<T>) - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие



### Классы моделей
Классы моделей используются для хранения и обработки данных, они определяют структуру данных и методы для работы с ними

#### Класс CatalogModel
Класс отвечает за хранение и логику работы с данными каталогом продуктов.\
Конструктор класса принимает инстант брокера событий:\
`constructor(protected events: IEvents)`

В полях класса хранятся следующие данные:
 -  items: IProductItem[] - массив объектов с данными товаров,

Методы:
 - setItems(items: IProductItem[]):void - сохраняет список продуктов в каталог
 - getProduct(id: TProduct) - ищет по id и возвращает данные товара
 - protected _changed() - генерирует уведомление об изменении каталога


#### Класс BasketModel
Класс отвечает за хранение и логику работы с данными корзины товаров.\
Конструктор класса принимает инстант брокера событий:\
`constructor(protected events: IEvents)`

Поля:
 - _items: TProductInBasketInfo[] - массив данных продуктов, находящихся в корзине
 - total: number | null - общая стоимость товаров в корзине

Остновные методы, реализуемые классом описаны интерфейсом `IBasketModel`:
 - findItem(id: TProductId, items: IProductItem[]) - ищет товар по id в списке товаров
 - add(item: IProductItem): void - добавляет товар в корзину
 - remove(product: IProductItem): void - удаляет товар из корзины
 - getBasketItems() - выдает список товаров в корзине
 - getBasketItemsId() - возвращает idтоваров в корзине
 - calcTotal(): number - суммирует итоговую сумму заказа
 - _changed() - генерирует уведомление об изменении
 - clearBasket()  - очищает корзину


#### Класс OrderData
Класс отвечает за хранение и логику работы с данными покупателя.\
Конструктор класса принимает инстант брокера событийдля инициации событий при изменении данных:\
`constructor(protected events: IEvents)`

В полях класса хранятся следующие данные:
 - buyerData: TFormData - данные покупателя
 - items: TProductId[] - список покупаемых товаров
 - total: number - общая сумма счета

 Методы:
 - updateOrder(buyerData: Partial<TFormData>) - сохраняет данные покупателя
 - setBasketData(basketData: {items: TProductId[], totalPrice: number}) - принимает данные заказа и общей суммы из модели корзины
 - getOrderData() - возвращает данные заказа



 ### Классы представления
 Все классы представления отвечают за отображения внутри контейнера (DOM-элемент) передаваемых в них данных.\

#### Класс ProductCard
Реализует отображение карточки товара в разных частях сайта, в каталоге товаров, в модальном окне предпросмотра и в корзине.

Конструктор класса принимает id темплейт-элемента карты:
`constructor(templateId: string)`

 Поля:
 - productTemeplate: HTMLTemplateElement - темплейт-элемент карточки товара
 - product: IProductItem - объект с данными товара
 - titleProduct: HTMLElement - заголовок с названием товара
 - priceElement: HTMLSpanElement - элемент разметки с ценой товара
 - button: HTMLButtonElement - кнопка карты товара
 - imageElement?: HTMLImageElement - изображение продукта
 - categoryElement?: HTMLSpanElement - спан-элемент, содержащий информацию о категории продукта
 - descriptionProduct?: HTMLElement - текст описания товара
 - basketItemIndex?: HTMLElement - индекс товара в корзине

 Методы:
 - render(product: IProductItem, callback: Function): HTMLElement -  метод возвращает полностью заполненную карточку товара с установленным слушателем события
 - clean(): void - метод очистки темплейта карточки после клонирования


#### Класс BasketView
Класс реализует отображение корзины товаров.
Конструктор класса не принимает параметры.

 Поля:
 - items: ProductCard[] - данные продуктов в корзине
 - template: HTMLElement - темплейт-элемент корзины
 - basketList: HTMLElement - список товаров в корзине
 - basketButton: HTMLButtonElement - кнопка `Оплатить` в корзине
 - basketTotalPrice: HTMLElement - элемент разметки с ощей стоимостью товаров в корзине

 Методы:
 - render(totalPrice: number, itemList?: HTMLElement[], callback?: ()=>void): HTMLElement - возвращает элемент корзины со списком карточек выбранных товаров
 - clean() - очищает темплейт и снимает слушатель
 - setValidBasket(totalPrice: number) - метод валидации корзины


#### Класс Modal
Реализует модальное окно. Предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по  Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.\
Конструктор класса не принимает параметры.

 Поля:
 - closeButton: HTMLButtonElement - кнопка закрытия модального окна
 - container:HTMLElement - элемент разметки, который будет содержать в себе шаблоны для модального окна.
 - content: HTMLElement - элемент разметки, содержащий контент модального окна

 Методы:
 - open: void - метод открытия модального окна
 - close: void - метод закрытия модального окна
 - render: HTMLElement - метод рендера модального окна
 - handleCloseWithButton(event: MouseEvent) - метод, закрывающий попап по кнопке закрытия
 - handleCloseOnOverlay(event: MouseEvent) - метод, закрывающий попап кликом по оверлею
 - handleClosePopupOnEsc(event: KeyboardEvent) - метод, закрывающий попап клавишей Esc


#### Класс OrderForm
Предназначен для реализации отображения формы оформления заказа.
Конструктор класса принимает id темплейт-элемента:\
`constructor(templateId: string)`

Поля класса:
- submitButton: HtmlButtonElement - кнопка `Далее`
- formElement: HTMLFormElement - элемент формы
- cardButton:HTMLButtonElement - кнопка `Онлайн`
- cashButton: HTMLButtonElement - кнопка `При получении`
- inputField: HTMLInputElement - поле ввода адреса получателя
- formTemplate: HTMLElement - темплейт формы

Методы класса:
- render(callback: ()=> void): HTMLFormElement - метод рендера формы
- handlePaymentClick(event: MouseEvent): string - метод получения выбранного способа оплаты
- getFormValue(): Partial<TFormData> - возвращает данные формы
- checkValidation(): void - проверяет валидность формы и изменяет активность кнопки подтверждения
- setInputValue(data: string): void - сохраняет данные инпута в модель
- clearValue(): void - метод, очищающий поля формы


#### Класс ContactsForm
Предназначен для реализации отображения формы контактов покупателя.
Конструктор класса принимает id темплейт-элемента:\
`constructor(templateId: string)`

Поля класса:
- submitButton: HtmlButtonElement - кнопка `Оплатить`
- formElement: HTMLFormElement - элемент формы
- inputEmail: HTMLInputElement - поле ввода для электронной почты покупателя
- inputPhone: HTMLInputElement - поле ввода для телефона получателя
- formTemplate: HTMLElement - темплейт формы

Методы:
- render(): HTMLFormElement - рендер формы
- getFormValue(): Partial<TFormData> - сохраняет данные полей ввода формы
- checkValidation(): void - проверяет валидность формы и изменяет активность кнопки подтверждения
- clearValue(): void - метод, очищающий поля формы


#### Класс SuccessView
Предназначен для реализации окна с подтвердением оплаты заказа.
Конструктор класса принимает id темплейт-элемента:\
`constructor(templateId: string)`

Поля:
 - successButton: HTMLButtonElement;
 - successText: HTMLElement - спан-элемент с размером произведенной оплаты
 - formTemplate: HTMLElement - темплейт-элемент
 - container: HTMLElement - элемент-контейнер

Методы:
- set totalPrice: number - сеттер для получения конечной суммы оплаченного заказа,
- render(): HTMLElement - метод рендера элемента
- clean(): void - метод очищает текст сообщения и снимает слушатель


#### Класс CatalogView
Отвечает за отображение коллекции товаров на главной странице.
В конструктор принимает карточки товаров:\
`constructor(private catalogCard: ProductCard)`

Поля:
- render(products:IProductItem[], callback: (product: IProductItem)=>void): HTMLElement - рендер каталога товаров



### Слой коммуникации
Классы, отвечающие за коммуникацию приложения с какими-либо внешними устройствами или приложениями, например, с сервером, где размещен бэкенд сайта.

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом магазина.

## Взаимодействие компонентов
Код, описывающий взаимодествие представления и данных между собой находится в файле `presenters.ts`, в котором находятся презентеры и `index.ts`, в котором настраивается часть событий.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `events.ts`.\
В `index.ts` сначала создаюся экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:changed` - измение данных корзины товаров
- `catalog:changed` - изменение данных каталога

*События, возникающие при взаимодецствии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `preview:open` - открытие модального окна с полным описанием товара
- `basket:open` - открытие модального окна с корзиной товаров
- `order:open` - открытие модального окна с формой оформления заказа
- `contacts:open` - открытие модального окна с формой контактов покупателя
- `order:submit` - изменение данных в форме оформления заказа
- `contacts:submit` - изменение данных в форме контактов покупателя
- `order: close` - закрытие модального окна
- `ui:basket-remove` - удаление товара из корзины
- `ui:basket-add` - добавление товара в корзину


#### Класс BasketButtonPresenter
Класс создает кнопку, вешает слушатель на `basket:open`, реагирует на `basket:changed`, меняет индекс количества покупок./
Конструктор класса принимает инстант брокера событий:\
`constructor(protected events: IEvents)`

Методы:
- onBasketClick(): void - вызывает событие `basket:open`
- bindRender():void - реагирует на 'basket:changed',меняет индекс количества покупок, рендерит кнопку


#### Класс CatalogPresenter
Класс реагирует на событие `catalog:changed` и отрисовывает каталог
Конструктор класса принимает инстант брокера событий и экземпляр класса CatalogViewЖ
`constructor(protected events: IEvents, private catalogView: CatalogView)`

Поля:
- catalogContainer: HTMLElement - контейнер каталога товаров

Метооды:
- bindEvent(): void - реагирует на событие `catalog:changed` и отрисовывает каталог
- clickCatalogItem(product: IProductItem): void - коллбек для карточки товара в каталоге, реагирующий на событие `preview:open`


#### Класс PreviewProductPresenter
Класс реагирует на событие `preview:open` и открывает модальное окно с превью картой товара
Конструктор класса принимает инстант брокера событий и экземпляр класса отображения модального окна и previewCard:
`constructor(protected events: IEvents, private modal: Modal, private previewCard: ProductCard)`

Метод:
- bindEvent(): void - реагирует на событие `preview:open` и открывает модальное окно с превью картой товара


#### Класс BasketPresenter
Класс реагирует на событие `basket:open` и открывает модальное окно с корзиной товаров
Конструктор класса принимает инстант брокера событий и экземпляр класса отображения модального окна, basketCard, экземпляр класса модели корзины и экземпляр класса отображения корзины:
`constructor(protected events: IEvents, private modal:Modal, private basketCard: ProductCard, private basketModel:BasketModel, private basketView: BasketView)`

Метод:
- bindEvent(): void - реагирует на событие `basket:open`, рендерит карты товаров в корзине, вешая на кнопки удаления товара слушатели события `UI:basket-remove`, вешает на кнопку 'Оформить' слушатель события `order:open` и открывает модальное окно с корзиной товаров


#### Класс OrderFormPresenter
Класс реагирует на событие `order:open` и показывает модальное окно с формой заказа
Конструктор класса принимает инстант брокера событий и экземпляр класса отображения модального окна и экземпляр класса формы заказа:\
`constructor(protected events: IEvents, private orderForm: OrderForm, private modal:Modal)`

Метод:
- bindEvent(): void - реагирует на событие `order:open`, вешает слушатель на события `order:submit` отправки формы и `contacts:open` открытия окна формы контактов и рендерит модальное окно с формой заказа


#### Класс ContactsPresenter
Класс реагирует на событие `contacts:open` и показывает модальное окно с формой контактов
Конструктор класса принимает инстант брокера событий и экземпляр класса отображения модального окна и экземпляр класса формы контактов:\
`constructor(protected events: IEvents, private contactsForm: ContactsForm, private modal:Modal)`

Метод:
- bindEvent(): void - реагирует на событие `contacts:open`, вешает слушатель на событие `contacts:submit` отправки формы и рендерит модальное окно с формой заказа


#### Класс SuccessPresenter
Класс реагирует на событие `success:open` и показывает окно подтверждения оплаты
Конструктор класса принимает инстант брокера событий, экземпляр класса отображения модального окна, экземпляр класса SuccessView и экземпляр модели корзины:\
`constructor(protected events: IEvents, private successView: SuccessView, private modal:Modal, private basketModel:BasketModel)`


Метод:
- bindEvent(): void - реагирует на событие `success:open`, вешает слушатель события `order:close` закрытия заказа и рендерит модальное окно с подтверждением оплаты


## Данные и типы данных, используемые в приложении

Интерфейс продукта
```
export interface IProductItem {
  id: TProductId;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: number | null;
  basketIndex?: number;
}
```
Интерфейс данных, отправляемых при заказе

```
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: TProductId[];
}
```

Интерфейс данных, получаемых при заказе
```
export interface IOrderResponse {
  orderId: string;
  total: number;
}
```
Интерфейс ошибки запроса
```
export interface IRequestError {
  error: string;
}
```
Интерфейс каталога продуктов
```
export interface ICatalogItems {
  setItems(items: IProductItem[]):void;
  getProduct(id: TProductId): TProductInBasketInfo | null;
}
```
Интерфейс модели корзины
```
export interface IBasketModel {
  add(item: IProductItem): void;
  remove(product: IProductItem): void;
}
```
Интерфейс формы
```
export interface IForm{
  render(callback: ()=> void): HTMLFormElement;
  clearValue(): void;
  getFormValue(): Partial<TFormData>;
}
```
Интерфейс модального окна
```
export interface IModal{
  open(): void;
  close():void;
}
```
Тип идентификатора продукта
```
export type TProductId = string;
```
Данные продукта, отображаемые в корзине
```
export type TProductBaseInfo = Pick<IProductItem, 'title' | 'id'>;
```
Данные продукта, отображаемые в каталоге
```
export type TProductPublicInfo = Pick<IProductItem, 'title' | 'image' | 'price' | 'category'>;
```
Тип оплаты
```
export type TPayment = "online" | "cash";
```
Данные покупателя
```
export type TFormData = Pick<IOrderRequest, 'payment' | 'address' | 'phone' | 'email'>;
```

