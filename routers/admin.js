const express = require("express");
const { Admin, validateAdmin } = require("../models/admins");
const router = express.Router();
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { verifyToken, isSuperAdmin } = require("../middlewares/auth");

router.post("/api/admin", async (req, res) => {
	const { name, lastName, email, password, phoneNumber } = req.body;
	const { error } = validateAdmin(req.body);
	console.log(req.user);

	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	let admin = await Admin.findOne({ email });
	if (admin) {
		return res
			.status(404)
			.send("The amdin with these credentials exists already");
	}
	admin = new Admin({
		name,
		lastName,
		email,
		password,
		phoneNumber,
		isSuperAdmin: true,
		createdAt: moment(Date.now()).format("LL"),
	});

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(admin.password, salt, (err, hash) => {
			if (err) throw err;
			admin.password = hash;
			try {
				admin.save();
				const payload = {
					_id: admin._id,
					name: admin.name,
					lastName: admin.lastName,
					email: admin.email,
					phoneNumber: admin.phoneNumber,
					isSuperAdmin: admin.isSuperAdmin,
				};
				const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY);
				console.log(token);
				return res
					.status(200)
					.header("x-auth-token", token)
					.send(_.pick(payload, ["_id", "name", "email", "phoneNumber"]));
			} catch (error) {
				return res.status(404).send("something went wrong");
			}
		});
	});
});

router.put("/api/admin/:id", async (req, res) => {
	const { name, lastName, email, password, phoneNumber } = req.body;

	const { error } = validateCustomer(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	const admin = Admin.findById({ _id: req.params.id });

	Admin.findByIdAndUpdate(
		admin._id,
		{ name, lastName, email, password, phoneNumber },
		{ new: true },
		(err, admin) => {
			if (err) {
				res.status(404).send("something went wrong");
			}
			admin.save();
			res.send(admin).status(200);
		}
	);
});

router.delete("/api/admin/:id", [isSuperAdmin], async (req, res) => {
	await Admin.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json("The admin has been deleted successfully");
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
});

router.get("/api/customer", [isSuperAdmin], async (req, res) => {
	const customers = await Customer.find();
	if (!customers) return res.send(404).send("there is no customer");
	res.send(customers).status(200);
});
module.exports = router;
