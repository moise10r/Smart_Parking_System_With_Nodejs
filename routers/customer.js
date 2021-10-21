const express = require("express");
const { Customer, validateCustomer } = require("../models/customer");
const router = express.Router();
const moment = require("moment");
const { verifyToken, isAdmin} = require("../middlewares/auth");
// [verifyToken],
router.post("/api/customer", async (req, res) => {
	const { name, cardId, carMark, plateNumber, phoneNumber } = req.body;
	const { error } = validateCustomer(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	let customers = await Customer.find();
	let customer = await Customer.findOne({ $or: [{ plateNumber }, { cardId }] });
	if (customer) {
		return res
			.status(400)
			.send("The customer with these credentials exists already");
	}
	customer = new Customer({
		name,
		cardId,
		index: customers.length + 1,
		carMark,
		plateNumber,
		phoneNumber,
		createdAt: moment(Date.now()).format("LL"),
	});
	try {
		customer.save();
		res.send(customer).status(200);
	} catch (error) {
		res.status(404).send("something went wrong");
	}
});

router.delete("/api/customer/:id", async (req, res) => {
	const customer = await Customer.findOneAndDelete({ _id: req.params.id });
	if (!customer)
		return res.status(400).send("There is no a customer with that ID");
	res.status(200).send(customer);
});

router.get("/api/customer/", async (req, res) => {
	const customer = await Customer.findOne({ plateNumber: req.query.plateNumber });
	if (!customer)
		return res.status(400).send("There is no a customer with that ID");
	res.status(200).send(customer);
});

router.put("/api/customer/:id", async (req, res) => {
	const { name, cardId, carMark, plateNumber, phoneNumber } = req.body;
	const { error } = validateCustomer(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	let customer = await Customer.findById({ _id: req.params.id });
	if(!customer) return res.status(400).send('The customer with this ID not found')

	customer = await Customer.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				name,
				cardId,
				carMark,
				plateNumber,
				phoneNumber,
			}
		},
		{ new: true });
		if(!customer) return res.status(404).send("something went wrong");
		customer.save();
		return res.send(customer).status(200);

});
// ,[verifyToken]
router.get("/api/customers", async (req, res) => {
	const customers = await Customer.find();
	if (!customers) return res.send(404).send("there is no customer");
	res.send(customers).status(200);
});
module.exports = router;
