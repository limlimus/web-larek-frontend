import { Component } from '../base/component';
import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';

//класс отображения модального окна
export class Modal extends Component implements IModal {
	protected closeButton: HTMLButtonElement;
	protected container: HTMLElement;
	protected content: HTMLElement;
	protected wrapeContent: HTMLElement;
	constructor() {
		super();
		this.container = ensureElement<HTMLElement>('#modal-container', document);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this.wrapeContent = ensureElement<HTMLElement>(
			'.modal__container',
			this.container
		);
		this.content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		this.closeButton.addEventListener('click', (event) =>
			this.handleCloseWithButton(event)
		);
	}

	//метод открытия модального окна
	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		document.addEventListener('keydown', this.handleClosePopupOnEsc);
		this.container.addEventListener('click', this.handleCloseOnOverlay);
	}

	// метод рендера модального окна
	render(value: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.replaceChildren(value);
	}

	//метод закрытия модального окна
	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content.innerHTML = '';
		document.removeEventListener('keydown', this.handleClosePopupOnEsc);
		this.container.removeEventListener('click', this.handleCloseOnOverlay);
	}

	//метод, закрывающий попап по кнопке закрытия
	handleCloseWithButton(event: MouseEvent): void {
		this.close();
		event.stopPropagation();
	}

	//метод, закрывающий попап кликом по оверлею
	handleCloseOnOverlay = (event: MouseEvent): void => {
		if (event.target == this.container) {
			this.close();
		}
	};

	//метод, закрывающий попап клавишей Esc
	handleClosePopupOnEsc = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this.close();
		}
	};
}
