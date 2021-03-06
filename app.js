const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const admin = require("./routers/admin");
const customer = require("./routers/customer");
const auth = require("./controllers/auth");
const { required } = require("joi");

dotenv.config({ path: "./config/config.env" });
connectDB();
//middlewares
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", admin);
app.use("/", customer);
app.use("/", auth);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
	console.log(`The server is running on port ${chalk.greenBright(PORT)}`);
});
