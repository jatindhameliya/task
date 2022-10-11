let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({}, { timestamps: true, strict: false });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('documents', schema);
