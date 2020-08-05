import { createHash, randomBytes } from 'crypto';
import { promisify } from 'util';

// const scryptAsync = promisify(scrypt);

export class Password {
	static toHash(password: string) {
		const hash = createHash('sha512').update(password).digest('hex');
		const salt = randomBytes(8).toString('hex');
		// const buf = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${hash}.${salt}`;
	}

	static compare(storedPassword: string, suppliedPassword: string) {
		const [ hashedPassword, salt ] = storedPassword.split('.');
		const hashedSuppliedPassword = createHash('sha512').update(suppliedPassword).digest('hex');
		return hashedPassword === hashedSuppliedPassword;

		// const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		// return buf.toString('hex') === hashedPassword;
	}
}
