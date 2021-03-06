const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	index: {
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
	state: {
		type: Boolean,
		default: false,
	}
});
function validateCustomer(customer) {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).max(50).required(),
		index: Joi.string(),
		cardId: Joi.string().required(),
		carMark: Joi.string().required(),
		plateNumber: Joi.string().required(),
		state: Joi.boolean(),
		phoneNumber: Joi.string().required(),
	});
	return schema.validate(customer);
}
const Customer = mongoose.model("customers", customerSchema);

exports.validateCustomer = validateCustomer;
exports.Customer = Customer;
