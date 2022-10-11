var express = require('express');
var router = express.Router();
let userModel = require("../models/users.model");
var qs = require('qs');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var goto = process.env.DOMAIN_NAME + '/home';
		res.redirect(goto);
		res.end();
	} else {
		res.render('login', { layout: false, title: 'login' });
	}
});
router.post('/', async (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var goto = process.env.DOMAIN_NAME + '/home';
		res.redirect(goto);
		res.end();
	} else {
		var body = qs.parse(req.body);
		if (body.username != '' && body.username != undefined && body.password != '' && body.password != undefined) {
			let userData = await userModel.findOne({ email: body.username, password: body.password, status: true }).lean();
			console.log('userData', userData);
			if (userData != null){
				req.session.admin_id = userData._id.toString();
				req.session.name = userData.name;
				var goto = process.env.DOMAIN_NAME + '/home';
				res.redirect(goto);
				res.end();
			}else{
				var goto = process.env.DOMAIN_NAME + '/';
				res.redirect(goto);
				res.end();
			}
		} else {
			var goto = process.env.DOMAIN_NAME;
			res.redirect(goto);
			res.end();
		}
	}
});
module.exports = router;
