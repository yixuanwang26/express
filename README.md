## npm scripts

### install:
```
$ npm install
```
### start:

```
$ DEBUG=myapp:* npm start
```


# node(express框架)+mongodb搭建后台基础项目
*基础环境*
* node
* npm
- - - -
## express框架

1. 简介
> express是一个基于node.js平台的极简的web应用开发框架，它提供一系列强大的特性，帮助你创建各种Web和移动设备应用。

2. 创建express项目
- express模块核心功能项目


创建myapp目录，并使用npm初始化:
```
$ mkdir myapp
$ cd myapp
$ npm init
```
安装express:
```
$ npm install express --save
```
创建app.js,复制如下代码：
```
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```
启动项目：
```
$ node app.js
```
访问http://localhost:3000，可见Hello World!字样。



- express应用生成器项目
> 使用express应用生成器可快速搭建一个node后台项目骨架。
安装：
```
$ npm install express-generator -g
```
搭建项目：
```
$ express myapp
```
进入目录，并安装相关模块
```
$ cd myapp
$ npm install
```
生成项目结构如下：
```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.jade
    ├── index.jade
    └── layout.jade
```
下面我们来根据结构，了解express项目各部分构成及功能。

3. 概念及构成
- 路由

   路由的结构如：
```
app.METHOD(path,callback,...);
```
app为express对象的一个实例。

METHOD为http的一种请求方式，包括post,get,put等等。

path为服务器上路径。

callback为当前路径上服务器会执行的函数。

一个基本路由如下所示：
```
var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});
```
其中，require('express')引入express模块，app创建一个express的实例，路径'/'表示对于所有的请求都会执行其后这个回调函数。

该回调函数中服务器返回了一个hello world的字符串。

> 路由是express中相对较为重要的概念，相当于java中的接口，由此可以直观看到请求的流入和响应的流出。

在我们创建的上面的项目中，路由统一放在routes文件夹下，其中每个文件内都使用了express.Router创建了可挂载的路由句柄，如下代码所示：
```
var express = require('express');
var router = express.Router();

// 定义网站主页的路由
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// 定义 about 页面的路由
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;
```
然后在核心app.js中挂载到对应的路径上去，如：
```
var users = require('./routes/users');
app.use('/users', users);
```

此时如果访问/users/about,则会进入定义about页面的路由。


- 中间件

中间件即为一个函数，通过该函数我们可以对流入的请求进行处理，期间包括数据查询和逻辑处理，之后再由中间件将处理后的数据交给下一个中间件。

可以将其看作对数据的过滤，加工操作。

一般的中间件是由app.use()构成，例如：
```
app.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
```

其中的回调函数会按顺序执行，next()表示将控制权交于下一个中间件。

> 路由其实也是一种中间件。

也可以使用第三方中间件，例如生成的项目中app.js中使用了[cookie-parser](https://www.npmjs.com/package/cookie-parser)和[body-parser](https://www.npmjs.com/package/body-parser)及[morgan](https://www.npmjs.com/package/morgan)中间件，都使用app.use()句式。

- 模板引擎

通过模板引擎可以结合响应的数据渲染出页面，这部分放在生成项目的views文件夹下。但因为模板引擎jade以及ejs我们不经常用到，所以在此略过这部分内容。

感兴趣的话可以去express官网查看相关文档：

http://www.expressjs.com.cn/guide/using-template-engines.html

- 静态资源

express项目静态资源统一托管于public文件夹下，只要在app.js文件中像以下这样设置express自带的static中间件
```
app.use(express.static(path.join(__dirname, 'public')));
```
可以增加一层虚拟路径
```
app.use('/www',express.static(path.join(__dirname, 'public')));
```
## mongodb数据库
1. 简介及安装
- 简介

> MongoDB是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，是类似json的bson格式，因此可以存储比较复杂的数据类型。

- 安装

下载官网安装包：
https://www.mongodb.com/download-center#community

安装之后要在mongodb安装目录下创建data文件夹（用于存放数据）和logs文件夹（用于存放日志），然后增加mongo.conf文件，加入以下配置：

```
dbpath=E:\Program Files\MongoDB\data #数据库路径  
logpath=E:\Program Files\MongoDB\logs\mongo.log #日志输出文件路径  
logappend=true #错误日志采用追加模式  
journal=true #启用日志文件，默认启用  
quiet=true #这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false  
port=27017 #端口号 默认为27017 
```

进入安装目录的bin目录，命令行执行
```
$ mongod --config "E:\Program Files\MongoDB\mongo.conf" 
```
执行成功后，浏览器输入http://127.0.0.1:27017/ 验证是否启动成功。

数据库连接可以使用客户端或者cmd命令行连接。

cmd连接时，进入安装目录的bin目录，执行以下命令连入数据库
```
$ mongo
```

客户端推荐使用robo 3T
https://robomongo.org/

2. 概念及常用语句
- 概念

SQL术语/概念 | MongoDB术语/概念 | 解释/说明
------------|-----------------|--------
database	  |   database      | 数据库
table	      |   collection	  |数据库表/集合
row	        |    document	    |数据记录行/文档
column	    |     field	      |数据字段/域
index	      |     index	      |索引
table       |   joins	 	      |表连接,MongoDB不支持
primary key	|  primary key	  |主键,MongoDB自动将_id字段设置为主键
		
- 常用命令
```
> show dbs  显示所有数据库
> use test  切换到test数据库/如果test数据库不存在，则新建，并切换
> db        查看当前所在数据库
> db.dropDatabase()  删除当前所在数据库
> show collections   查看当前数据库中所有集合
> db.col.drop()      删除当前数据库中col集合
> db.col.insert({"name":"nena","age":20})  在col集合中插入一条数据
> db.col.update({'name':'nena'},{$set:{'age':23}},{upsert:true,multi:true})       在col集合中更新name为nena的数据，更新多条，如果没有则插入
> db.col.deleteOne( { 'name': "nena" } ) 删除一条name为nena的数据
> db.col.deleteMany( { 'name': "nena" } ) 删除多条name为nena的数据
> db.col.find({'name':'nena'}, {name: 1}) 查询name为nena的数据，指定返回name属性，不返回age属性

```
## mongoose模块

mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具。

使用时需安装该模块
```
$ npm install mongoose --save
```

> mongoose中有几个比较重要的概念：Schema, Model, Entity;

Schema 相当于一个集合中数据的模型，不具有直接操作数据的能力。

Model 由Schema生成，可以通过其操作数据。

Entity 由Model创建的实体，对数据也有操作行为。

下面我们来看mongoose的使用：

- 数据库连接
```
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost:27017/test_dev');
```
创建连接，并导出db和Schema,其中test_dev为数据库名称。

- 创建Schema
```
var Schema = mongoose.Schema;
exports.allDataSchema = new Schema({
	  name: String,
    age: Number,
    list:[
        {
            itemId: Number,
            itemName: String,
        }
    ]
});

```
对Schema中每个属性的类型进行了定义。
- 创建Model
```
var allDataModel = db.model('items',allDataSchema);
```

- 以Model为基础创建查询方法
```
allDataModel.find(data,function(error,result){
        if(error) {
            console.log(error);
        } else {
            console.log(result);
        }
})
```
## express+mongoose项目整合，增删改查基础接口实现

1. 主要结构

项目主要是作为一个后台项目来提供接口，可以调用每个接口对mongodb中同一个集合进行增删改查数据的操作。
项目结构如下：
```
.
├── app.js
├── database
│   ├── model
│   │   └── userModel.js
│   ├── schema
│   │   └── userSchema.js
│   └── db.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.jade
    ├── index.jade
    └── layout.jade
```
主要是增加了database文件夹，用来创建数据库相关的model和schema及连接。

2. 增删改查方法封装

userModel.js 文件中封装对user集合的增删改查方法：
```
// 增
exports.saveData = function save(data, callback) {
    userModel.create(data, function (error, result) {
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    });
}

// 查
exports.queryData = function query(data, callback) {
    userModel.find(data, function (error, result) {
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    })
}

// 改
exports.updateData = function update(data, callback) {
    userModel.update(data.param, { ...data.new }, function (error, result){
        if (error) {
            callback(false, error);
        } else {
            callback(true, result);
        }
    });
}

// 删
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
```

3. 接口实现

user.js中调用model中方法，实现增删改查接口：
```
/* GET */
router.get('/query', function(req, res, next) {
  query({}, function (success, result) {
    res.send(formatData(success, result));
  });
});

/* POST */
router.post('/create',function(req,res,next){
  create(req.body, function(success, result){
    res.send(formatData(success, result));
  });
});

/* PUT */
router.put('/update', function(req, res, next) {
  update({ param: { userName: req.query.userName }, new: req.body}, function(success, result){
    res.send(formatData(success, result));
  });
});

/* DELETE */
router.delete('/delete', function(req, res, next) {
  remove({ ...req.body }, function(success, result){
    res.send(formatData(success, result));
  });
});
```

并在app.js 引入该router,设置前缀为api的url,都经过该路由。
```
var users = require('./routes/users');
app.use('/api', users);
```

4. postman测试
- 增
```
url: http://localhost:3000/api/create
POST
request header: Content-Type: application/json
request body: 
{   
    "userName":"nena wan",
    "age": 5,
    "sex":"女",
    "identityCardId":"24234538753534534"
}
```
- 删
```
url: http://localhost:3000/api/delete
DELETE
request header: Content-Type: application/json
request body: 
{
    "userName":"nena wan"
}
```
- 改
```
url: http://localhost:3000/api/update
UPDATE
request header: Content-Type: application/json
request params: { userName:'nena wan' }
request body: 
{
    "age": 5
}
```
- 查
```
url: http://localhost:3000/api/query
GET
```
