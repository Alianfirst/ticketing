import { Publisher, OrderCreatedEvent, Subjects } from '@alianscervis/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
