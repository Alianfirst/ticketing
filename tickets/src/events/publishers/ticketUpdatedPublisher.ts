import { Publisher, Subjects, TicketUpdatedEvent } from '@alianscervis/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
