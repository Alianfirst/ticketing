import { Publisher, PaymentCreatedEvent, Subjects } from '@alianscervis/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
