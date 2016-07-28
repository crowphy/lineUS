var mongoose = require('mongoose');

var chatRecordSchema = new mongoose.Schema({

});

var contactSchema = new mongoose.Schema({
    contactName: String,
    contactPhoneNum: String,
    isMatched: Boolean,
    chatRecord: [chatRecordSchema]
});

var tagSchema = new mongoose.Schema({
    yourself: [String],
    otherSide: [String]
});

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    userPhoneNum: {
        type: String,
        unique: true
    },
    genders: {
        type: String,
        enum: ['男', '女']
    },
    age: {
        type: Number,
        min: 0,
        max: 150
    },
    district: String,
    sign: String,
    avatarUri: String,
    tags: {
        yourself: [String],
        otherSide: [String]
    },
    contacts: [contactSchema],
    createTime: String
});

module.exports = UserSchema;