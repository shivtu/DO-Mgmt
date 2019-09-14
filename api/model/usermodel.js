const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    group: Number,
    userId: Number,
    Gender: Boolean,
    Bio: JSON,
    createdBy: String,
    createdOn: Number,
    displayPicture: String
});

module.exports = mongoose.model('User', userSchema);