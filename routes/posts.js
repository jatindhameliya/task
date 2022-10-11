var express = require('express');
var router = express.Router();
let postModel = require("../models/posts.model");
const ResponseManager = require('../utilities/response.manager');
var mongoose = require('mongoose');
function validateLatLng(lat, lng) {
	let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
	return pattern.test(lat) && pattern.test(lng);
}
router.post('/count', async (req, res) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		let activePosts = await postModel.countDocuments({ createdBy: mongoose.Types.ObjectId(req.session.admin_id), status: true});
		let inActivePosts = await postModel.countDocuments({ createdBy: mongoose.Types.ObjectId(req.session.admin_id), status: false });
		return ResponseManager.onSuccess('post count', { activepost: activePosts, inactivepost: inActivePosts}, res);
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/list', async (req, res) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { page, limit, search } = req.body;
		let regex = new RegExp(search, 'i');
		postModel.paginate({
			createdBy: mongoose.Types.ObjectId(req.session.admin_id),
			$or: [{ title: regex }, { body: regex }]
		}, {
			page,
			limit: parseInt(limit),
			sort: { updatedAt: -1 },
			lean: true
		}).then((posts) => {
			return ResponseManager.onSuccess('post list', posts, res);
		}).catch((error) => {
			return ResponseManager.onError(error, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('index', { title: 'home' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/delete', async (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { postId } = req.body;
		if (postId && postId != '' && mongoose.Types.ObjectId.isValid(postId)) {
			postModel.findByIdAndDelete(postId).then((response) => {
				return ResponseManager.onSuccess('post deleted', 1, res);
			}).catch((error) => {
				return ResponseManager.onError(error, res);
			});
		} else {
			return ResponseManager.onSuccess('Invalid post id to delete', 0, res);
		}
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/save', async (req, res) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { postId, title, body, status, latitude, longitude } = req.body;
		if (postId == 0){
			if (title && title.trim() != '' && body && body.trim() != '' && latitude && longitude) {
				if (validateLatLng(parseFloat(latitude), parseFloat(longitude))) {
					const newpost = new postModel({
						title: title,
						body: body,
						createdBy: mongoose.Types.ObjectId(req.session.admin_id),
						updatedBy: mongoose.Types.ObjectId(req.session.admin_id),
						status: (status == 'Active') ? true : false,
						location: {
							type: "Point",
							coordinates: [parseFloat(longitude), parseFloat(latitude)]
						},
					});
					await newpost.save(newpost);
					return ResponseManager.onSuccess('post saved', 1, res);
				} else {
					return ResponseManager.onSuccess('Invalid lat long data', 0, res);
				}
			} else {
				return ResponseManager.onSuccess('Invalid data to create post', 0, res);
			}
		}else{
			if (title && title.trim() != '' && body && body.trim() != '' && latitude && longitude) {
				if (validateLatLng(parseFloat(latitude), parseFloat(longitude))) {
					postModel.findByIdAndUpdate(postId, {
						title: title,
						body: body,
						createdBy: mongoose.Types.ObjectId(req.session.admin_id),
						updatedBy: mongoose.Types.ObjectId(req.session.admin_id),
						status: (status == 'Active') ? true : false,
						location: {
							type: "Point",
							coordinates: [parseFloat(longitude), parseFloat(latitude)]
						},
					}).then((response) => {
						return ResponseManager.onSuccess('post updated successfully', 1, res);
					}).catch((error) => {
						return ResponseManager.onError(error, res);
					});
				} else {
					return ResponseManager.onSuccess('Invalid lat long data to update the post', 0, res);
				}
			} else {
				return ResponseManager.onSuccess('Invalid data to update post', 0, res);
			}
		}
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
