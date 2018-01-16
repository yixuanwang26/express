var express = require('express');
var router = express.Router();

var query = require('../database/model/userModel').queryData;
var create = require('../database/model/userModel').saveData;
var update = require('../database/model/userModel').updateData;
var remove = require('../database/model/userModel').removeData;

function formatData(success, result){
  let responseData = {
    success: false,
    rows: [],
    massege: 'successful!'
  }
  if (success) {
    responseData.success = true;
    responseData.rows = result;
  } else {
    responseData.success = false;
    responseData.message = result;
  }
  const data = JSON.stringify(responseData);
  return data;
}

/* GET */
router.get('/query', function(req, res, next) {
  //调取model层查询方法
  query({}, function (success, result) {
    res.send(formatData(success, result));
  });

});

/* POST */
router.post('/create',function(req,res,next){

  create(req.body, function(success, result){
    res.send(formatData(success, result));
  });
  
})

/* PUT */
router.put('/update', function(req, res, next) {
  update({ param: { userName: req.query.userName }, new: req.body}, function(success, result){
    res.send(formatData(success, result));
  })
});

/* DELETE */
router.delete('/delete', function(req, res, next) {
  remove({ ...req.body }, function(success, result){
    res.send(formatData(success, result));
  })
});

module.exports = router;
