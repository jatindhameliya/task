var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('index', { title: 'home'});
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
module.exports = router;
