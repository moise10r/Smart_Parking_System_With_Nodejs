const mongoose = require("mongoose");
const Joi = require("joi");
const adminSchema = new mongoose.Schema({
	name: {
		type: String,
		requred: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
	},
	isSuperAdmin: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: String,
	},
});

function validateAdmin(admin) {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().min(2).max(50).required(),
		email: Joi.string().min(2).max(50).required().email(),
		password: Joi.string().min(5).max(255).required(),
		phoneNumber: Joi.string().required(),
	});
	return schema.validate(admin);
}
const Admin = mongoose.model("admins", adminSchema);

exports.validateAdmin = validateAdmin;
exports.Admin = Admin;
