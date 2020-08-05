import { Publisher, OrderCancelledEvent, Subjects } from '@alianscervis/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
