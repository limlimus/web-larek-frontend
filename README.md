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
 - openProduct(id: TProductId): IProductItem - открывает полную информацию о товаре в превью


#### Класс BasketModel
Класс отвечает за хранение и логику работы с данными корзины товаров.\
Конструктор класса принимает инстант брокера событий:\
`constructor(protected events: IEvents)`

Поля:
 - _items: TProductInBasketInfo[] - массив данных продуктов, находящихся в корзине
 - total: number | null - общая стоимость товаров в корзине

Остновные методы, реализуемые классом описаны интерфейсом `IBasketModel`:
 - findItem(id: TProductId) - ищет товар по id в корзине
 - add(id: string): void - добавляет товар в корзину
 - remove(id: string): void - удаляет товар из корзины
 - calcTotal(): number - суммирует итоговую сумму заказа
 - _changed() - генерирует уведомление об изменении


#### Класс OrderData
Класс отвечает за хранение и логику работы с данными покупателя.\
Конструктор класса принимает инстант брокера событийдля инициации событий при изменении данных:\
`constructor(protected events: IEvents)`

В полях класса хранятся следующие данные:
 - orderData: TFormData - данные покупателя
 - items: TProductId[] - список покупаемых товаров
 - total: number - общая сумма счета

 Методы:
 - updateOrder(orderData: TFormData) - сохраняет данные покупателя
 - setBasketData(basketData: {items: TProductId[], totalPrice: number}) - принимает данные заказа из модели корзины



 ### Классы представления
 Все классы представления отвечают за отображения внутри контейнера (DOM-элемент) передаваемых в них данных.\

#### Класс ProductCard
Реализует отображение карточки товара в разных частях сайта, в каталоге товаров, в модальном окне предпросмотра и в корзине.

Конструктор класса принимает экземпляр класса `EventEmitter` для инициации событий и ID темплейта карточки:
 `constructor(templateId: string, protected events: IEvents)`

 Поля:
 - productTemeplate: HTMLTemplateElement - темплейт-элемент карточки товара
 - product: IProductItem - объект с данными товара
 - titleProduct: HTMLElement - заголовок с названием товара
 - priceElement: HTMLSpanElement - элемент разметки с ценой товара
 - button: HTMLButtonElement - кнопка карты товара
 - imageElement?: HTMLImageElement - изображение продукта
 - categoryElement?: HTMLSpanElement - спан-элемент, содержащий информацию о категории продукта
 - descriptionProduct?: HTMLElement - текст описания товара

 Методы:
 - render(product: IProductItem, callback: Function): HTMLElement -  метод возвращает полностью заполненную карточку товара с установленным слушателем события
 - clean(): void - метод очистки темплейта карточки после клонирования


#### Класс BasketView
Класс реализует отображение корзины товаров.
Конструктор класса принимает экземпляр класса `EventEmitter` для инициации событий.:\
 `constructor(protected events: IEvents)`

 Поля:
 - items: ProductCard[] - данные продуктов в корзине
 - template: HTMLElement - темплейт-элемент корзины
 - container: HTMLElement - элемент разметки, который служит контейнером для элементов корзины
 - basketButton: HTMLButtonElement - кнопка `Оплатить` в корзине
 - basketTotalPrice: HTMLElement - элемент разметки с ощей стоимостью товаров в корзине
 - basketItemIndex: HTMLElement - индекс товара в корзине

 Методы:
 - render(data: { items: ProductCard[] }): HTMLElement - возвращает элемент корзины со списком карточек выбранных товаров
 - clearBasket() - очищает корзину
 - set basketTotal(totalPrice: number) - сеттер общего счера заказа из модели корзины
 - setValidBasket(totalPrice: number) - метод валидации корзины


#### Класс Modal
Реализует модальное окно. Предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по  Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
Конструктор класса принимает экземпляр класса `EventEmitter` для инициации событий.:\
 `constructor(protected events: IEvents)`

 Поля:
 - closeButton: HTMLButtonElement - кнопка закрытия модального окна
 - container:HTMLElement - элемент разметки, который будет содержать в себе шаблоны для модального окна.

 Методы:
 - set content(value: HTMLElement) - метод-сеттер для получения контента модального окна
 - open: void - метод открытия модального окна
 - close: void - метод закрытия модального окна
 - render: HTMLElement - метод рендера модального окна


#### Класс OrderForm
Предназначен для реализации отображения формы оформления заказа.
Конструктор класса принимает экземпляр класса `EventEmitter` для инициации событий и ID темплейта карточки:
 `constructor(templateId: string, protected events: IEvents)`

Поля класса:
- submitButton: HtmlButtonElement - кнопка `Далее`
- formElement: HTMLFormElement - элемент формы
- cardButton:HTMLButtonElement - кнопка `Онлайн`
- cashButton: HTMLButtonElement - кнопка `При получении`
- inputField: HTMLInputElement - поле ввода адреса получателя
- formTemplate: HTMLElement - темплейт формы

Методы класса:
- render(): HTMLFormElement - метод рендера формы
- handlePaymentClick(event: MouseEvent): string - метод получения выбранного способа оплаты
- getFormValue(): Record<string, string> - возвращает данные формы
- checkValidation(): void - проверяет валидность формы и изменяет активность кнопки подтверждения
- setInputValue(data: string): void - сохраняет данные инпута в модель
- clearValue(): void - метод, очищающий поля формы


#### Класс ContactsForm
Предназначен для реализации отображения формы контактов покупателя.
Конструктор класса принимает экземпляр класса `EventEmitter` для инициации событий и ID темплейта карточки:
 `constructor(templateId: string, protected events: IEvents)`

Поля класса:
- submitButton: HtmlButtonElement - кнопка `Оплатить`
- formElement: HTMLFormElement - элемент формы
- inputEmail: HTMLInputElement - поле ввода для электронной почты покупателя
- inputPhone: HTMLInputElement - поле ввода для телефона получателя
- formTemplate: HTMLElement - темплейт формы

Методы:
- render(): HTMLFormElement - рендер формы
- getFormValue(): Record<string, string> - сохраняет данные полей ввода формы
- checkValidation(): void - проверяет валидность формы и изменяет активность кнопки подтверждения
- clearValue(): void - метод, очищающий поля формы


#### Класс SuccessView
Предназначен для реализации окна с подтвердением оплаты заказа.
Конструктор класса принимает экземпляр класса `EventEmitter` для инициации событий и ID темплейта карточки:
 `constructor(templateId: string, protected events: IEvents)`

Поля:
 - successButton: HTMLButtonElement;
 - successText: HTMLElement - спан-элемент с размером произведенной оплаты
 - formTemplate: HTMLElement - темплейт-элемент
 - container: HTMLElement - элемент-контейнер

Методы:
- set totalPrice: number - сеттер для получения конечной суммы оплаченного заказа,
- render(): HTMLElement - метод рендера элемента





#### Класс CatalogView
Отвечает за отображение коллекции товаров на главной странице.
В конструктор принимает контейнер, в котором размещаются карточки:\
`constructor(container: HTMLElement, events?: EventEmitter)`

Поля:
- set(ProductsData: IProductItem[]): void - сохраняет данные в модель
- get(): HTMLElement - обновляет отображение карточек в каталоге



### Слой коммуникации
Классы, отвечающие за коммуникацию приложения с какими-либо внешними устройствами или приложениями, например, с сервером, где размещен бэкенд сайта.

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом магазина.

## Взаимодействие компонентов
Код, описывающий взаимодествие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `events.ts`.\
В `index.ts` сначала создаюся экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:changed` - измение данных корзины товаров
- ``

*События, возникающие при взаимодецствии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `preview:open` - открытие модального окна с полным описанием товара
- `basket:open` - открытие модального окна с корзиной товаров
- `order:open` - открытие модального окна с формой оформления заказа
- `contacts:open` - открытие модального окна с формой контактов покупателя
- `payment: selected` - выбор способа оплаты
- `order:submit` - изменение данных в форме оформления заказа
- `contacts:submit` - изменение данных в форме контактов покупателя
- `order:validation` - событие, сообщающее о необходимости валидации формы оформления заказа
- `contacts:validation` - событие, сообщающее о необходимости валидации формы контактов покупателя
- `order: close` - закрытие модального окна
- `catalog:changed`
- `basket:changed`
- `ui:basket-remove` - удаление товара из корзины
- `ui:basket-add` - добавление товара в корзину

## Данные и типы данных, используемые в приложении

Интерфейс продукта
```
export interface IProductItem {
  id: TProductId;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
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
Модель каталога продуктов
```
export interface ICatalogItems {
  total: number;
  items: IProductItem[];
  setItems(items: IProductItem[]):void;
  getProduct(id:string): IProductItem[];
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
Данные, используемые в форме выбора оплаты и адреса
```
export type TAddressForm = Pick<IOrderRequest, 'payment' | 'address'>;
```
Данные, используемые в форме ввода электронной почти и телефона
```
export type TEmailPhoneForm = Pick<IOrderRequest, 'phone' | 'email'>;
```
