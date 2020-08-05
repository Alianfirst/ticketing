import { Publisher, ExpirationCompleteEvent, Subjects } from '@alianscervis/common';

export class ExprirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
