import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

//класс отображения сообщения об успешной оплате
export class SuccessView extends Component {
	protected successButton: HTMLButtonElement;
	protected successText: HTMLElement;
	protected template: HTMLTemplateElement;
	protected container: HTMLElement;

	constructor(templateId: string) {
		super();
		this.template = ensureElement<HTMLTemplateElement>(
			`#${templateId}`,
			document
		);
	}

	// метод рендера элемента
	render(data: { totalPrice: number; callback: () => void }): HTMLElement {
		const container = this.template.content.cloneNode(true) as HTMLElement;
		this.successText = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.setText(this.successText, `Списано ${data.totalPrice} синапсов`);
		this.successButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this.successButton.addEventListener('click', () => data.callback());
		return container;
	}

	// метод очищает текст сообщения и снимает слушатель
	clean(): void {
		this.setText(this.successText, `Списано 0 синапсов`);
		this.successButton.removeEventListener<'click'>;
	}
}
