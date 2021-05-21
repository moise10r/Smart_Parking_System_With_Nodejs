const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
	const token = req.header("x-auth-token") || req.body.token || req.query.token;

	if (!token)
		return res.status(404).json({ success: false, message: "token incorrect" });
	jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
		if (err)
			return res.status(400).json({ success: false, message: "invalid token" });

		decoded = req.user;
		next();
	});
};
exports.isSuperAdmin = (req, res, next) => {
	if (req.user.isSuperAdmin == true) {
		next();
	}
	res.status(400).send("Your name permitted to do this action");
};

