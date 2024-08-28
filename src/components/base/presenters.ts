import { IEvents } from './events';
//===презентеры

export class Presenter {
	constructor(
		protected events: IEvents,
		settings: { eventName: string; callback: (data?: unknown) => void }
	) {
		this.bindEvent(settings.eventName, settings.callback);
	}

	bindEvent(eventName: string, callback: (data?: unknown) => void): void {
    console.log('presenter', eventName)
		this.events.on(eventName, callback);
	}
}
