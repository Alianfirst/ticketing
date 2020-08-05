import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../natsWrapper';

it('returns an error if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId
		})
		.expect(404);
});

it('returns an error if the ticket is already exist', async () => {
	const ticket = Ticket.build({
		title: 'asdjfh',
		price: 20,
		id: mongoose.Types.ObjectId().toHexString()
	});
	await ticket.save();
	const order = Order.build({
		ticket,
		userId: 'sdjfhkdj',
		status: OrderStatus.Created,
		expiresAt: new Date()
	});
	await order.save();

	await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id }).expect(400);
});

it('reserves a ticket', async () => {
	const ticket = Ticket.build({
		title: 'asdjfh',
		price: 20,
		id: mongoose.Types.ObjectId().toHexString()
	});
	await ticket.save();

	await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id }).expect(201);
});

it('emits an order created event', async () => {
	const ticket = Ticket.build({
		title: 'asdjfh',
		price: 20,
		id: mongoose.Types.ObjectId().toHexString()
	});
	await ticket.save();

	await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id }).expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
