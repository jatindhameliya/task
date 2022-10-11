let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	title: {
		type: String,
		default: "",
	},
	body: {
		type: String,
		default: ""
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	status: {
		type: Boolean,
		default: true,
	},
	location: {
		type: { type: String },
		coordinates: []
	}
}, {
	timestamps: true,
	strict: false
});
schema.index({ location: "2dsphere" });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('posts', schema);
