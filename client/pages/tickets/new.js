import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
	const [ state, setState ] = useState({
		title: '',
		price: ''
	});

	const { doRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'post',
		body: {
			title: state.title,
			price: state.price
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
	const handleBlur = () => {
		const value = parseFloat(state.price);

		if (isNaN(value)) {
			return;
		}

		setState({
			...state,
			price: value.toFixed(2)
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		doRequest();
	};
	return (
		<div>
			<h1>Create a Ticket</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Title</label>
					<input name="title" value={state.title} onChange={handleChange} className="form-control" />
				</div>
				<div className="form-group">
					<label>Price</label>
					<input
						name="price"
						value={state.price}
						onBlur={handleBlur}
						onChange={handleChange}
						className="form-control"
					/>
				</div>
				{errors}
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default NewTicket;
