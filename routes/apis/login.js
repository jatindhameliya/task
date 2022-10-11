let express = require("express");
let router = express.Router();
let userModel = require("../../models/users.model");
const jwt = require('jsonwebtoken');
require('../../utilities/passport');
genToken = user => {
	return jwt.sign({
		iss: 'doc11zaApp',
		sub: user.id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 1)
	}, 'doc11zaAppsecret');
}
router.post('/', async (req, res) => {
	const { email, password } = req.body;
	let userData = userModel.findOne({ email: email, password: password, status: true }).lean();
	if(userData != null){
		let name = userData.name;
		let email = userData.email;
		let password = userData.password;
		const newUser = new userModel({ name, email, password });
		const token = genToken(newUser)
		res.status(200).json({ token })
	}else{
		return res.status(403).json({ error: 'Invalid Email or Password, Please try again' });
	}
});
module.exports = router;
