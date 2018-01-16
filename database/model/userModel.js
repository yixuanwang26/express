
var db = require('../db').db;
var mongoose = require('../db').mongoose;
var userSchema = require('../schema/userSchema').userSchema;

var userModel = db.model('user', userSchema);

exports.saveData = function save(data, callback) {
    userModel.create(data, function (error, result) {
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    });
}

exports.queryData = function query(data, callback) {
    userModel.find(data, function (error, result) {
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    })
}

exports.updateData = function update(data, callback) {
    userModel.update(data.param, { ...data.new }, function (error, result){
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    });
}

exports.removeData = function remove(data, callback) {
    console.log(data);
    userModel.remove(data, function(error, result){
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    })
}



