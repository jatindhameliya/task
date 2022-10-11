let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	name: {
		type: String,
		default: "",
	},
	email: {
		type: String,
		default: ""
	},
	password: {
		type: String,
		default: ""
	},
	status: {
		type: Boolean,
		default: true,
	}
}, {
	timestamps: true,
	strict: false
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('users', schema);
