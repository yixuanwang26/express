
var Schema = require('../db').Schema;

exports.userSchema = new Schema({
    userName: String,
    age: Number,
    sex: String,
    identityCardId: String,
}); 