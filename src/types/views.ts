import { IProductItem, IModal, IForm, TFormData } from ".";

//===отображения

//класс отображения каталога
export class CatalogView {
  protected container: HTMLElement;
  protected cards: ProductCard[];
  constructor(private catalogCard: ProductCard) {
    this.container = document.querySelector('.gallery') as HTMLElement;
  };

  renderCards(products:IProductItem[], callback: (product: IProductItem)=>void): HTMLElement {
    this.container.innerHTML = '';
    const cards = products.map(product => this.catalogCard.render(product, callback));

      cards.forEach((card) => {this.container.append(card)});

    return this.container
  }
}
//const cards = itemList.map( catalogCard.render(product, callback(колбек должен вызвать событие preview:open(productID)) ()=> this.clickCatalogItem(product)

// класс отображения карточки товара
export class ProductCard{
  protected productTemeplate: HTMLElement;
  protected product: IProductItem;
  protected titleProduct: HTMLElement;
  protected priceElement: HTMLSpanElement;
  protected button: HTMLButtonElement;
  protected imageElement?: HTMLImageElement;
  protected categoryElement?: HTMLElement;
  protected descriptionProduct?: HTMLElement;
  protected basketItemIndex?: HTMLElement;

  constructor(templateId: string) {
    this.productTemeplate = document.getElementById(templateId);
    this.titleProduct = this.productTemeplate.querySelector('.card__title');
    this.priceElement = this.productTemeplate.querySelector('.card__price');
    this.button = this.productTemeplate.querySelector('.card__button');
    this.imageElement = this.productTemeplate.querySelector('.card__image');
    this.categoryElement = this.productTemeplate.querySelector('.card__category');
    this.descriptionProduct = this.productTemeplate.querySelector('.card__text');
    this.basketItemIndex = this.productTemeplate.querySelector('.basket__item-index');
  }
  //метод рендера карточки
  render(product: IProductItem, callback: Function): HTMLElement {
    this.titleProduct.textContent= product.title;
    this.priceElement.textContent = `${product.price}`;
    this.button.addEventListener('click', () => callback(product));
    if (this.basketItemIndex) {
      this.basketItemIndex.textContent = `${product.basketIndex+1}`
    }
    if (this.imageElement) {
      this.imageElement.src = product.image;
    }
    if (this.descriptionProduct) {
      this.descriptionProduct.textContent = product.description;
    }
    if (this.categoryElement) {
      this.categoryElement.textContent = product.category;
    }
    const cloned = this.productTemeplate.cloneNode(true) as HTMLElement;
    this.clean();
    return cloned;
  }
  //метод очистки темплейта
  clean(): void {
    this.titleProduct.textContent = '';
    this.priceElement.textContent = '';
    if (this.imageElement) {
      this.imageElement.src = '';
    }
    if (this.descriptionProduct) {
      this.descriptionProduct.textContent = '';
    }
    if (this.categoryElement) {
      this.categoryElement.textContent = '';
    }
    this.button.removeEventListener<'click'>
  }
}


//класс отображения корзины
export class BasketView  {
  protected items: ProductCard[];
  protected template: HTMLTemplateElement;
  protected basketList: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketTotalPrice: HTMLElement;

  constructor() {
    this.template = document.getElementById('basket') as HTMLTemplateElement;
    this.basketList = this.template.querySelector('.basket__list');
    this.basketButton = this.template.querySelector('.basket__button');
    this.basketTotalPrice = this.template.querySelector('.basket__price');
  }

  //рендер корзины
  render(totalPrice: number, itemList?: HTMLElement[], callback?: ()=>void) : HTMLElement {
    if (itemList) {
      itemList.map((item) => {
        this.basketList.appendChild(item);
      });
      return this.basketList;
    }
    this.basketButton.addEventListener('click', () => callback());
    this.basketTotalPrice.textContent = `${totalPrice}`;
    const container = this.template.cloneNode(true) as HTMLElement;
    this.clean();
    return container;
  }

  //clearBasket() {
    //this.render(0);
  //}

  clean(): void {
    this.basketTotalPrice.textContent = ``;
    this.basketButton.removeEventListener<'click'>;
  }

  setValidBasket(totalPrice: number): void {
    if(!totalPrice) {
      this.basketButton.classList.add('disabled');
    } else {
      this.basketButton.classList.remove('disabled');
    }
  }
}


//класс отображения модального окна
export class Modal implements IModal {
  protected closeButton: HTMLButtonElement;
  protected container:HTMLElement;
  protected content: HTMLElement;
  constructor() {
    this.container = document.getElementById('modal-container');
    this.closeButton = this.container.querySelector('.modal__close');
    this.content = this.container.querySelector('.modal__content');
    document.addEventListener('click', (event) => this.handleCloseOnOverlay(event));
    this.container.addEventListener('keydown', (event) => this.handleClosePopupOnEsc(event));
    this.closeButton.addEventListener('click', (event) => this.handleCloseWithButton(event))
  }

  //метод открытия модального окна
  open(): void {
    this.container.classList.add('.modal_active');
  }

  // метод рендера модального окна
  render(value: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.replaceChildren(value)
  }

  //метод закрытия модального окна
  close(): void {
    this.container.classList.remove('.modal_active');
    this.content.innerHTML = '';
  }

  //метод, закрывающий попап по кнопке закрытия
  handleCloseWithButton(event: MouseEvent):void {
    this.close();
      event.stopPropagation();
     }

  //метод, закрывающий попап кликом по оверлею
  handleCloseOnOverlay(event: MouseEvent): void {
  if (event.target !== this.container) {
    this.close();
    document.removeEventListener<'click'>
  }}

  //метод, закрывающий попап клавишей Esc
  handleClosePopupOnEsc(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}


//класс отображения формы заказа
export class OrderForm implements IForm {
  protected formElement: HTMLFormElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected inputField: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected formTemplate: HTMLElement;

  constructor(templateId: string){
    this.formTemplate = document.getElementById(templateId);
    this.formElement = this.formTemplate.querySelector('.form');
    this.inputField = this.formElement.querySelector('.form__input');
    this.cardButton = this.formElement.querySelector('[name="card"]');
    this.cashButton = this.formElement.querySelector('[name="cash"]');
    this.submitButton = this.formElement.querySelector('.button');

  }

  //метод рендера элемента
  render(callback: ()=> void): HTMLFormElement {
    this.cardButton.addEventListener('click', (event) => this.handlePaymentClick(event));
    this.cashButton.addEventListener('click', (event) => this.handlePaymentClick(event));
    this.submitButton.addEventListener('click', callback)
    const container =  this.formTemplate.cloneNode(true) as HTMLFormElement;
    return container;
  }

  //метод получения выбранного способа оплаты
  handlePaymentClick(event: MouseEvent): void {
    const button = event.target;
    if (button===this.cardButton) {
      this.cardButton.classList.add('.button_alt-active');
      this.cashButton.classList.remove('.button_alt-active');
    }
    if (button === this.cashButton) {
      this.cashButton.classList.add('.button_alt-active');
      this.cardButton.classList.remove('.button_alt-active');
    }
  }

  //возвращает данные формы
  getFormValue(): Partial<TFormData> {
    const orderFormData:Partial<TFormData> = {};
    if (this.cardButton.classList.contains('button_alt-active')) {
      orderFormData.payment = 'Онлайн';
    }
    if (this.cashButton.classList.contains('button_alt-active')) {
      orderFormData.payment = 'При получении';
      }
    orderFormData.address = this.inputField.value;
		return orderFormData;
	}

  //проверяет валидность формы и изменяет активность кнопки подтверждения
  checkValidation(): void {
      if(!(this.cardButton.classList.contains('.button_alt-active') || this.cardButton.classList.contains('.button_alt-active'))) {
        this.submitButton.classList.add('disabled');
      }
      if(!this.inputField.validity.valid) {
        this.submitButton.classList.add('disabled');
      } else {
        this.submitButton.classList.remove('disabred');
      }
  };

  //метод, очищающий поля формы
  clearValue(): void {
		this.formElement.reset();
	}
}


//класс отображения формы контактов
export class ContactsForm implements IForm {
  protected formElement: HTMLFormElement;
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected formTemplate: HTMLElement;

  constructor(templateId: string){
    this.formTemplate = document.getElementById(templateId);
    this.formElement = this.formTemplate.querySelector('.form');
    this.inputEmail = this.formElement.querySelector('[name="email"]');
    this.inputPhone = this.formElement.querySelector('[name="phone"]');
    this.submitButton = this.formElement.querySelector('.button');
  }

  //метод рендера элемента
  render(callback: ()=> void): HTMLFormElement {
    this.inputEmail.addEventListener('keydown',(evt:KeyboardEvent)=>{
      this.checkValidation();
    });
    this.inputPhone.addEventListener('keydown',(evt:KeyboardEvent)=>{
      this.checkValidation();
    });
    this.submitButton.addEventListener('click', callback)
    const container = this.formTemplate.cloneNode(true) as HTMLFormElement;
    return container;
  }

  //сохраняет данные полей ввода формы
  getFormValue(): Partial<TFormData> {
    const contactsFormData:Partial<TFormData> = {};
    contactsFormData.email = this.inputEmail.value;
    contactsFormData.phone = this.inputPhone.value;
		return contactsFormData;
	}

  //проверяет валидность формы и изменяет активность кнопки подтверждения
  checkValidation(): void {
    if(!this.inputPhone.validity.valid || !this.inputEmail.validity.valid) {
      this.submitButton.classList.add('disabled');
    } else {
      this.submitButton.classList.remove('disabred');
    }
  }

  //метод, очищающий поля формы
  clearValue(): void {
		this.formElement.reset();
	}
}


//класс отображения сообщения об успешной оплате
export class SuccessView {
  protected successButton: HTMLButtonElement;
  protected successText: HTMLElement;
  protected template: HTMLTemplateElement;
  protected container: HTMLElement;

  constructor(templateId: string) {
    this.template = document.getElementById(templateId) as HTMLTemplateElement;
    this.successText = this.template.querySelector('.film__description');
    this.successButton = this.template.querySelector('.order-success__close');
  }

  // метод рендера элемента
  render(totalPrice:number, callback: ()=>void): HTMLElement {
    this.successText.textContent = `Списано ${totalPrice} синапсов`;
    this.successButton.addEventListener('order: close', () => callback);
    const container = this.template.cloneNode(true) as HTMLElement;
    this.clean();
    return container;
  }

  // метод очищает текст сообщения и снимает слушатель
  clean(): void {
    this.successText.textContent = `Списано 0 синапсов`;
    this.successButton.removeEventListener<'click'>;
  }
}


// класс отображения кнопки корзины
export class BasketBattonView {
  protected basketCounter:HTMLElement;
  protected basketOpenButton:HTMLElement;
  constructor(callback: () => void){
    this.basketOpenButton = document.querySelector('.header__basket');
    this.basketCounter = document.querySelector('.header__basket-counter');
    this.basketCounter.textContent = '0';
    this.basketOpenButton.addEventListener('click', callback);
  }

  render(count: number){
    this.basketCounter.textContent = `${count}`;
  }
}