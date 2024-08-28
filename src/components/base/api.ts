import { IProductItem, TFormData, IOrderResponse } from '../../types';
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get(uri: string): Promise<object> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}

export class AppApi {
  private api: Api;
	constructor( baseUrl: string) {
		this.api = new Api(baseUrl);
	}
	getProduts(): Promise<ApiListResponse<IProductItem>> {
		return this.api.get('/product') as Promise<ApiListResponse<IProductItem>>;
	}
	createOrder(orderData: TFormData): Promise<IOrderResponse> {
		return this.api.post('/order', orderData) as Promise<IOrderResponse>;
	}
}
