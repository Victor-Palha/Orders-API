import {
	type ListOrdersParams,
	type ListOrdersResult,
	OrderRepository,
} from "@/domain/orders/application/repositories/order-repository";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { InMemoryOrderItemRepository } from "./in-memory-order-item-repository";

export class InMemoryOrderRepository implements OrderRepository {
	public orders: OrderEntity[] = [];
	private orderItemRepository: InMemoryOrderItemRepository;

	constructor(orderItemRepository: InMemoryOrderItemRepository) {
		this.orderItemRepository = orderItemRepository;
	}

	async findById(id: string): Promise<OrderEntity | null> {
		const order = this.orders.find(order => order.id.toValue() === id);
		if (order) {
			const items = await this.orderItemRepository.findByOrderId(id);
			order.items = items;
		}
		return order ?? null;
	}

	async findByIdAndUserId(id: string, userId: string): Promise<OrderEntity | null> {
		const order = this.orders.find(
			order => order.id.toValue() === id && order.props.userId.toValue() === userId
		);
		if (order) {
			const items = await this.orderItemRepository.findByOrderId(id);
			order.items = items;
		}
		return order ?? null;
	}

	async create(order: OrderEntity): Promise<void> {
		this.orders.push(order);
	}

	async update(order: OrderEntity): Promise<void> {
		const index = this.orders.findIndex(o => o.id.toValue() === order.id.toValue());
		if (index !== -1) {
			this.orders[index] = order;
		}
	}

	async delete(id: string): Promise<void> {
		const index = this.orders.findIndex(order => order.id.toValue() === id);
		if (index !== -1) {
			this.orders.splice(index, 1);
		}
	}

	async listOrders(params: ListOrdersParams): Promise<ListOrdersResult> {
		let filteredOrders = this.orders.filter(
			order => order.props.userId.toValue() === params.userId
		);

		for (const order of filteredOrders) {
			const items = await this.orderItemRepository.findByOrderId(order.id.toValue());
			order.items = items;
		}

		// Filter by status if provided
		if (params.status) {
			filteredOrders = filteredOrders.filter(order => order.props.status.value === params.status);
		}

		const total = filteredOrders.length;
		const page = params.page ?? 1;
		const limit = params.limit ?? 10;
		const totalPages = Math.ceil(total / limit);

		// Sort
		const sortBy = params.sortBy ?? "createdAt";
		const sortOrder = params.sortOrder ?? "DESC";

		filteredOrders.sort((a, b) => {
			let aValue: any;
			let bValue: any;

			if (sortBy === "createdAt") {
				aValue = a.props.createdAt.getTime();
				bValue = b.props.createdAt.getTime();
			} else if (sortBy === "updatedAt") {
				aValue = a.props.updatedAt.getTime();
				bValue = b.props.updatedAt.getTime();
			} else if (sortBy === "totalAmount") {
				aValue = a.props.totalAmount;
				bValue = b.props.totalAmount;
			} else {
				aValue = a.props.createdAt.getTime();
				bValue = b.props.createdAt.getTime();
			}

			if (sortOrder === "ASC") {
				return aValue - bValue;
			}
			return bValue - aValue;
		});

		// Paginate
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

		return {
			orders: paginatedOrders,
			total,
			page,
			limit,
			totalPages,
		};
	}
}
