import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';

export default () => {
	const [ state, setState ] = useState({
		email: '',
		password: ''
	});

	const { doRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: {
			email: state.email,
			password: state.password
		},
		onSuccess: () => Router.push('/')
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setState({
			...state,
			[name]: value
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		await doRequest();
	};
	return (
		<form onSubmit={handleSubmit}>
			<h1>Sign In</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input value={state.email} name="email" onChange={handleChange} className="form-control" />
			</div>
			<div className="form-group">
				<label>Password</label>
				<input
					type="password"
					value={state.password}
					name="password"
					onChange={handleChange}
					className="form-control"
				/>
			</div>
			{errors}
			<button className="btn btn-primary">Sign In</button>
		</form>
	);
};
