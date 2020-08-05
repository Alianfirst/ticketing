import Queue from 'bull';
import { ExprirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface Payload {
	orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
	redis: {
		host: process.env.REDIS_HOST
	}
});

expirationQueue.process(async (job) => {
	new ExprirationCompletePublisher(natsWrapper.client).publish({
		orderId: job.data.orderId
	});
});

export { expirationQueue };
