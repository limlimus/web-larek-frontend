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
 - get(uri: string): Promise<object> - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
 - post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
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
 - setItems(items: IProductItem[]): void - сохраняет список продуктов в каталог
 - getProduct(id: TProductId): IProductItem | null - ищет по id и возвращает данные товара
 - protected _changed(): void - генерирует уведомление об изменении каталога


#### Класс BasketModel
Класс отвечает за хранение и логику работы с данными корзины товаров.\
Конструктор класса принимает инстант брокера событий:\
`constructor(protected events: IEvents)`

Поля:
 - _items: TProductInBasketInfo[] - массив данных продуктов, находящихся в корзине
 - total: number | null - общая стоимость товаров в корзине

Остновные методы, реализуемые классом описаны интерфейсом `IBasketModel`:
 - findItem(item: IProductItem): boolean - ищет товар в корзине
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
 - updateOrder(buyerData: Partial<TFormData>) - обновляет данные покупателя на основе переданных данных
 - setBasketData(basketData: {items: TProductId[], totalPrice: number}) - устанавливает данные о товарах и общей сумме
 - getOrderData(): TFormData - возвращает данные заказа



### Классы представления
Все классы представления отвечают за отображения внутри контейнера (DOM-элемент) передаваемых в них данных.\

#### Класс View
Класс представляет собой абстрактный класс, который служит основой для других классов.

Методы:
- render(data: unknown): HTMLElement | void - рендер на основе входящих данных
- checkValidation?(condition: boolean): void - проверяет условие `condition` и добавляет или удаляет класс `disabled` из элемента `submitButton`
- ensureElement - функция проверяет есть ли элемент


#### Класс ProductCard
Класс ProductCard расширяет класс View. Реализует отображение карточки товара в разных частях сайта, в каталоге товаров, в модальном окне предпросмотра и в корзине. Экземпляр класса ProductCard будет использоваться для отображения информации о товаре, такой как название, цена, изображение, категория и описание.

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
 - render(data: { product: IProductItem; callback: Function }): HTMLElement -  метод возвращает полностью заполненную карточку товара с установленным слушателем события. принимает объекст с двумя параметрами: `product` - объект данных товара,  `callback` - функция, которая будет вызываться при нажатии на кнопку карты.
 - clean(): void - метод очистки темплейта карточки после клонирования


#### Класс CatalogView
Данный класс CatalogView расширяет класс View, который является базовым для всех представлений.
Экземпляр класса CatalogView будет использоваться для отображения галереи карточек товаров (ProductCard).
Конструктор класса принимает один параметр — catalogCard, который представляет собой экземпляр класса ProductCard:\
`constructor(private catalogCard: ProductCard)`

Поля:
- render(data: { products: IProductItem[];	callback: (product: IProductItem) => void;
	}): HTMLElement - рендер каталога товаров. принимает объекст с двумя параметрами: `products` — массив продуктов, `callback` — функция, которая будет вызываться при выборе товара.


#### Класс BasketView
Класс расширяет класс View, реализует визуализацию корзины и управление её содержимым.
Конструктор класса не принимает параметры.

 Поля:
 - items: ProductCard[] - данные продуктов в корзине
 - template: HTMLElement - темплейт-элемент корзины
 - basketList: HTMLElement - список товаров в корзине
 - basketButton: HTMLButtonElement - кнопка `Оплатить` в корзине
 - basketTotalPrice: HTMLElement - элемент разметки с ощей стоимостью товаров в корзине

 Методы:
 - render(data: {totalPrice: number; itemList?: HTMLElement[]; callback?: () => void;}): HTMLElement - отображает содержимое корзины на основе переданных данных. принимает объекст с тремя параметрами: `totalPrice` - общая сумма заказа, `itemList` - список товаров, `callback` - функция, которая будет вызываться при нажатии кнопки корзины
 - clean(): void - очищает темплейт и снимает слушатель


#### Класс Modal
Класс Modal расширяет класс View, представляет собой компонент для отображения модального окна с содержимым.
Экземпляр класса Modal будет использоваться для создания всплывающих окон с различными сообщениями или формами.
Конструктор класса не принимает параметры.

 Поля:
 - closeButton: HTMLButtonElement - кнопка закрытия модального окна
 - container:HTMLElement - элемент разметки, который будет содержать в себе шаблоны для модального окна.
 - content: HTMLElement - элемент разметки, содержащий контент модального окна

 Методы:
 - open: void - открывает модальное окно, добавляя класс modal_active к контейнеру
 - close: void - метод закрытия модального окна, убирает класс modal_active
 - render(value: HTMLElement): void - отображает содержимое модального окна на основе переданного элемента value
 - handleCloseWithButton(event: MouseEvent): void - метод, закрывающий попап по кнопке закрытия
 - handleCloseOnOverlay(event: MouseEvent): void - метод, закрывающий попап кликом по оверлею
 - handleClosePopupOnEsc(event: KeyboardEvent): void - метод, закрывающий попап клавишей Esc


#### Класс OrderForm
Класс расширяет класс View, предназначен для реализации отображения формы оформления заказа.
Конструктор класса принимает id темплейт-элемента:\
`constructor(templateId: string)`

Поля класса:
- submitButton: HtmlButtonElement - кнопка `Далее`
- formElement: HTMLFormElement - элемент формы
- cardButton:HTMLButtonElement - кнопка `Онлайн`
- cashButton: HTMLButtonElement - кнопка `При получении`
- inputField: HTMLInputElement - поле ввода адреса получателя
- formTemplate: HTMLTemplateElement - темплейт формы

Методы класса:
- render(callback: ()=> void): HTMLFormElement - метод рендера формы
- handlePaymentClick(event: MouseEvent): string - метод получения выбранного способа оплаты
- getFormValue(): Partial<TFormData> - возвращает данные формы
- setInputValue(data: string): void - сохраняет данные инпута в модель
- clearValue(): void - метод, очищающий поля формы


#### Класс ContactsForm
Класс расширяет класс View, предназначен для реализации отображения  на сайте, где пользователь может выбрать способ оплаты и ввести адрес доставки.
Конструктор класса принимает id темплейт-элемента:\
`constructor(templateId: string)`

Поля класса:
- submitButton: HtmlButtonElement - кнопка `Оплатить`
- formElement: HTMLFormElement - элемент формы
- inputEmail: HTMLInputElement - поле ввода для электронной почты покупателя
- inputPhone: HTMLInputElement - поле ввода для телефона получателя
- formTemplate: HTMLETemplatelement - темплейт формы

Методы:
- render(): HTMLFormElement - рендер формы
- getFormValue(): Partial<TFormData> - сохраняет данные полей ввода формы
- clearValue(): void - метод, очищающий поля формы


#### Класс SuccessView
Класс расширяет класс View, представляет собой компонент для отображения успешного завершения операции.
Конструктор класса принимает id темплейт-элемента:\
`constructor(templateId: string)`

Поля:
 - successButton: HTMLButtonElement;
 - successText: HTMLElement - спан-элемент с размером произведенной оплаты
 - formTemplate: HTMLTemplateElement - темплейт-элемент
 - container: HTMLElement - элемент-контейнер

Методы:
- set totalPrice: number - сеттер для получения конечной суммы оплаченного заказа
- render(): HTMLElement - метод рендера элемента
- clean(): void - метод очищает текст сообщения и снимает слушатель



### Слой коммуникации
Классы, отвечающие за коммуникацию приложения с какими-либо внешними устройствами или приложениями, например, с сервером, где размещен бэкенд сайта.

#### Класс AppApi
Класс AppApi представляет собой интерфейс взаимодействия с API, который предоставляет методы для получения списка продуктов и создания заказа.
Экземпляр класса AppApi будет использоваться для взаимодействия с сервером.

Конструктор класса AppApi принимает экзепляр класса Api и параметр baseUrl, который представляет собой базовый URL_AP:
`constructor(private api: Api, baseUrl: string)`

Методы:
- getProduts(): Promise<ApiListResponse<IProductItem>> - Отправляет GET-запрос на указанный URL /product, Возвращает данные о продуктах как промис
- createOrder(orderData: TFormData): Promise<IOrderResponse> - отправляет запрос на создание заказа. Создаёт промис с результатом выполнения POST-запроса на указанный URL/order

## Взаимодействие компонентов
Код, описывающий взаимодествие представления и данных между собой находится в файле `presenters.ts`, в котором находятся презентеры и `index.ts`, в котором настраивается часть событий.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `events.ts`.\
В `index.ts` сначала создаюся экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:changed` - измение данных корзины товаров
- `catalog:changed` - изменение данных каталога

*События, возникающие при взаимодецствии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `basket:changed` - изменение корзины
- `catalog:changed` - изменение каталога
- `preview:open` - открытие модального окна с полным описанием товара
- `basket:open` - открытие модального окна с корзиной товаров
- `order:open` - открытие модального окна с формой оформления заказа
- `contacts:open` - открытие модального окна с формой контактов покупателя
- `order:submit` - изменение данных в форме оформления заказа
- `contacts:submit` - изменение данных в форме контактов покупателя
- `order: close` - закрытие модального окна
- `ui:basket-remove` - удаление товара из корзины
- `ui:basket-add` - добавление товара в корзину


#### Класс Presenter
Класс реализует функционал презентатора. Экземпляры класса будут использоваться для привязки события к коллбэку.

Конструктор класса принимает инстант брокера событий и  settings — объект, который содержит название события и колбэк-функцию. :\
`constructor(protected events: IEvents, settings: {eventName: string; callback: (data?: unknown) => void})`

Методы:
- bindEvent(eventName: string, callback: (data?: unknown) => void): void - принимает два аргумента: `eventName` — название события. `callback` — функция, которая будет вызываться при наступлении события. Метод bindEvent связывает событие и коллбэк при помощи метода on объекта events.



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
Интерфейс модели заказа
```
export interface IOrderModel {
	updateOrder(buyerData: Partial<TFormData>): void;
	setBasketData(basketData: { items: TProductId[]; totalPrice: number }): void;
	getOrderData(): Partial<TFormData>;
}
```
Интерфейс отображения
```
export interface IView<T> {
	element: HTMLElement; //корневой элемент
	copy(): IView<T>; //копирующий конструктор
	render(data?: T): HTMLElement; //метод рендера
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
Интерфейс презентера
```
export interface IPresenter {
	bindEvent(): void;
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

