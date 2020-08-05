import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface Global {
			signin(id?: string): string[];
		}
	}
}

jest.mock('../natsWrapper');

process.env.STRIPE_KEY =
	'sk_test_51HC1nqGwHjgJswzJTHzdkQFhYp4LxQ7Px4c0HHIUavh7N0b4UJQ0gH1iDSAoSgllEWl5o1IcOQohtdaPd43eGZck007F0jc5x7';

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'asdkfjdslf';

	mongo = new MongoMemoryServer();
	const mongoURI = await mongo.getUri();

	await mongoose.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = (id?: string) => {
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	};

	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString('base64');

	return [ `express:sess=${base64}` ];
};
