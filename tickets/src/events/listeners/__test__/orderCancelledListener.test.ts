import mongoose, { mongo } from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@alianscervis/common';
import { OrderCancelledListener } from '../orderCancelledListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	//Create an instance of the listener
	const listener = new OrderCancelledListener(natsWrapper.client);

	//Create and save a ticket
	const orderId = mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: 'concert',
		price: 99,
		userId: mongoose.Types.ObjectId().toHexString()
	});
	ticket.set({ orderId });
	await ticket.save();

	//Create a fake data event
	const data: OrderCancelledEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		ticket: {
			id: ticket.id
		}
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { msg, data, ticket, orderId, listener };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
	const { msg, data, ticket, orderId, listener } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
