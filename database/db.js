var mongoose = require('mongoose');

exports.db = mongoose.connect('mongodb://localhost:27017/mon_dev');

/**
* 连接成功
*/
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to mongodb://localhost:27017/mon_dev');
});

/**
* 连接异常
*/
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
* 连接断开
*/
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

exports.mongoose;

exports.Schema = mongoose.Schema;

exports.ResultDataSchema = mongoose.Schema;