// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}

// список событий
export enum Events {
  PREVIEW_OPEN = 'preview:open', //открытие модального окна с полным описанием товара
  BASKET_OPEN = 'basket:open', //открытие модального окна с корзиной товаров
  ORDER_OPEN = 'order:open', // открытие модального окна с формой оформления заказа
  CONTACTS_OPEN = 'contacts:open', //открытие модального окна с формой контактов покупателя
  PAYMENT_SELECTED = 'payment: selected', //выбор способа оплаты -
  ORDER_SUBMIT = 'order:submit', //изменение данных в форме оформления заказа  +
  CONTACTS_SUBMIT = 'contacts:submit', //изменение данных в форме контактов покупателя  +
  ORDER_VALIDATION = 'order:validation', //событие, сообщающее о необходимости валидации формы оформления заказа  -
  CONTACTS_VALIDATION = 'contacts:validation', //событие, сообщающее о необходимости валидации формы контактов покупателя  -
  BASKET_REMOVE = 'UI:basket-remove', // удаление товара из корзины +
  BASKET_ADD = 'UI:basket-add' //добавление товара в корзину  +
}