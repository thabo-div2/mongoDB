const express = require("express");
const connectDB = require("./config/db");
const app = express();

// Connecting Database
connectDB();

//  Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) =>
	res.json({ msg: "Welcome to the Contact Keeper API" }),
);

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contact", require("./routes/contact"));

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
