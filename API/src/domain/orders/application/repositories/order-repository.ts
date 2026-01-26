import { OrderEntity } from "../../enterprise/order-entity";

export interface ListOrdersParams {
	userId: string;
	status?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
}

export interface ListOrdersResult {
	orders: OrderEntity[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ListAllOrdersParams {
	status?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
}

export interface ListAllOrdersResult {
	orders: OrderEntity[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export abstract class OrderRepository {
	abstract findById(id: string): Promise<OrderEntity | null>;
	abstract findByIdAndUserId(id: string, userId: string): Promise<OrderEntity | null>;
	abstract create(order: OrderEntity): Promise<void>;
	abstract update(order: OrderEntity): Promise<void>;
	abstract delete(id: string): Promise<void>;
	abstract listOrders(params: ListOrdersParams): Promise<ListOrdersResult>;
	abstract listAllOrders(params: ListAllOrdersParams): Promise<ListAllOrdersResult>;
}
