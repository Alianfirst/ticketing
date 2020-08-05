import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from '../expirationCompleteListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';
import { ExpirationCompleteEvent } from '@alianscervis/common';

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'sdjfhjkd',
		price: 20
	});
	await ticket.save();
	const order = Order.build({
		status: OrderStatus.Created,
		userId: 'sdfjkdsf',
		expiresAt: new Date(),
		ticket
	});
	await order.save();

	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
	const { listener, order, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
	const { listener, order, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
	expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
