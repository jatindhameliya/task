let express = require("express");
let router = express.Router();
let userModel = require("../../models/users.model");
router.post('/', async (req, res) => {
	const { name, email, password } = req.body;
	let foundUser = await userModel.findOne({ email : email }).lean();
	if (foundUser != null){
		return res.status(403).json({ error: 'Email is already in use' });
	}else{
		const newUser = new userModel({ name, email, password });
		await newUser.save(newUser);
		return res.status(200).json({ message: 'User successfully registered, Please login to manage your posts...'});
	}
});
module.exports = router;
