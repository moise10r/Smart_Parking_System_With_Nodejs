const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	cardId: {
		type: String,
		required: true,
	},
	carMark: {
		type: String,
		required: true,
	},
	plateNumber: {
		type: String,
		require: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
});
function validateCustomer(customer) {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).max(50).required(),
		cardId: Joi.string().required(),
		carMark: Joi.string().required(),
		plateNumber: Joi.string().required(),
		phoneNumber: Joi.string().required(),
	});
	return schema.validate(customer);
}
const Customer = mongoose.model("customers", customerSchema);

exports.validateCustomer = validateCustomer;
exports.Customer = Customer;
