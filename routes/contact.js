const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route GET api/contact
// @desc Get all users contacts
// @access Private
router.get("/", auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(contacts);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
});

// @route POST api/contact
// @desc Create a new contact
// @access Private
router.post(
	"/",
	[auth, [check("name", "Name is required").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, phone, type } = req.body;

		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id,
			});

			const contact = await newContact.save();

			res.json(contact);
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: "Server Error" });
		}
	},
);

// @route PUT api/contact/:id
// @desc Edit a user
// @access Private
router.put("/:id", auth, async (req, res) => {
	const { name, email, phone, type } = req.body;

	//  Build a contact object
	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.name = name;

	try {
		let user = await User.findById(req.user.id);
		if (user.role === "admin") {
			let contact = await Contact.findById(req.params.id);
			// Make sure user owns contact
			if (!contact) return res.status(404).json({ msg: "Contact not found" });
			if (contact.user.toString() !== req.user.id) {
				return res.status(401).json({ msg: "Not authorized" });
			}

			contact = await Contact.findByIdAndUpdate(
				req.params.id,
				{
					$set: contactFields,
				},
				{ new: true },
			);

			res.json(contact);
		} else {
			res.send("You do not have admin privilege to edit");
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
});

// @route DELETE api/contact/:id
// @desc Delete a user
// @access Private
router.delete("/:id", auth, async (req, res) => {
	try {
		let contact = await Contact.findById(req.params.id);

		if (!contact) return res.status(404).json({ msg: "Contact not found" });

		// Make sure user owns contact
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		await Contact.findByIdAndRemove(req.params.id);
		res.json({ msg: "Contact removed" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
});

module.exports = router;
