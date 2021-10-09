const express = require('express');
const router = express.Router();
const { Admin } = require('../models/admins');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/api/login', (req, res) => {
	const { email, password } = req.body;
	const schema = Joi.object().keys({
		email: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
	});
	const validation = schema.validate(req.body);
	if (validation.error) {
		res
			.header('x-auth-token')
			.status(400)
			.send(validation.error.details[0].message);
		return;
	}
	Admin.findOne({ email })
		.then((admin) => {
			if (!admin)
				return res
					.status(400)
					.send('The admin with this credential does not exist');
			bcrypt.compare(password, admin.password, (err, isMatch) => {
				if (err)
					return res.header('x-auth-token').send('password is incorrect');
				if (isMatch) {
          const payload = {
            _id: admin._id,
            name: admin.name,
            lastName: admin.lastName,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            isSuperAdmin: admin.isSuperAdmin,
          };
					const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
					return res
						.header('x-auth-token', token)
						.status(200)
						.send(
							_.pick(payload, [
								'_id',
								'name',
								'email',
								'lastName',
								'phoneNumber'
							])
						);
				} else {
					return res
						.header('x-auth-token')
						.status(401)
						.send('email or password is incorrect ');
				}
			});
		})
		.catch((err) =>
			res.header('x-auth-token').send('something went wrong').status(404)
		);
});

module.exports = router;
