let express = require("express");
let router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
let postModel = require("../../models/posts.model");
let responseManager = require("../../utilities/response.manager");
function validateLatLng(lat, lng) {
	let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
	return pattern.test(lat) && pattern.test(lng);
}
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const { title, body, latitude, longitude } = req.body;
	if (title && title.trim() != '' && body && body.trim() != '' && latitude && longitude){
		if (validateLatLng(parseFloat(latitude), parseFloat(longitude))) {
			const newpost = new postModel({
				title: title,
				body: body,
				createdBy: req.user._id,
				updatedBy: req.user._id,
				status: true,
				location: {
					type: "Point",
					coordinates: [parseFloat(longitude), parseFloat(latitude)]
				},
			});
			await newpost.save(newpost);
			return res.status(200).json({ message: 'Post added successfully...' });
		}else{
			return res.status(403).json({ error: 'latitude,Longitude values are invalid, please try again' });
		}
	}else{
		return res.status(403).json({ error: 'Mandatory data is missing to create post, please try again'});
	}
});
router.post('/edit', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const { postId, title, body, status, latitude, longitude } = req.body;
	if (postId && postId != '' && mongoose.Types.ObjectId.isValid(postId)){
		if (validateLatLng(parseFloat(latitude), parseFloat(longitude))) {
			postModel.findByIdAndUpdate(postId, {
				title: title,
				body: body,
				createdBy: req.user._id,
				updatedBy: req.user._id,
				status: status,
				location: {
					type: "Point",
					coordinates: [parseFloat(longitude), parseFloat(latitude)]
				}
			}).then((response) => {
				return res.status(200).json({ message: 'Post updated successfully...' });
			}).catch((error) => {
				console.log('error', error);
				return res.status(500).json({ error: 'Something went wrong, Try agian' });
			});
		} else {
			return res.status(400).json({ error: 'latitude,Longitude values are invalid, please try again' });
		}
	} else {
		return res.status(400).json({ error: 'Invalid post Id, please try again' });
	}
});
router.post('/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const { postId } = req.body;
	if (postId && postId != '' && mongoose.Types.ObjectId.isValid(postId)) {
		postModel.findByIdAndDelete(postId).then((response) => {
			return res.status(200).json({ message: 'Post deleted successfully...' });
		}).catch((error) => {
			return res.status(500).json({ error: 'Something went wrong, Try agian' });
		});
	} else {
		return res.status(400).json({ error: 'Invalid post Id, please try again' });
	}
});
router.post('/filter', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const { skip, take, search, maxdistance, latitude, longitude } = req.body;
	if (!isNaN(skip) && !isNaN(take)) {
		const lskip = parseInt(skip);
		const ltake = parseInt(take);
		let regex = new RegExp(search, 'i');
		let query = {};
		if (maxdistance && !isNaN(maxdistance) && latitude && longitude) {
			if (validateLatLng(parseFloat(latitude), parseFloat(longitude))) {
				let maxd = parseInt(maxdistance);
				let latt = parseFloat(latitude);
				let longi = parseFloat(longitude);
				query = {
					location: {
						$near: {
							$maxDistance: maxd,
							$geometry: {
								type: "Point",
								coordinates: [longi, latt]
							}
						}
					}
				}
			}
		}
		postModel.find({
			createdBy: req.user._id,
			$or: [{ title: regex }, { body: regex }],
			...query
		}).skip(lskip).limit(ltake).lean().then((result) => {
			return responseManager.onSuccess("posts List", result, res);
		}).catch((error) => {
			return responseManager.onError(error, res);
		});
	} else {
		return response.onSuccess("Skip and take must be number!.", 0, res);
	}
});
module.exports = router;
