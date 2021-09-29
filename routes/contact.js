const express = require("express");
const router = express.Router();

// @route GET api/contact
// @desc Get all users contacts
// @access Private
router.get("/", (req, res) => {
	res.send("Get all contacts");
});

// @route POST api/contact
// @desc Create a new contact
// @access Private
router.post("/", (req, res) => {
	res.send("Create new contact");
});

// @route PUT api/contact/:id
// @desc Edit a user
// @access Private
router.put("/:id", (req, res) => {
	res.send("Edit a user");
});

// @route DELETE api/contact/:id
// @desc Delete a user
// @access Private
router.delete("/:id", (req, res) => {
	res.send("Delete a user");
});

module.exports = router;
