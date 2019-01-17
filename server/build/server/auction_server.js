"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var product_service_1 = require("../\u5728\u7EBF\u7ADE\u62CD/src/app/components/shared/product.service");
exports.Comment = product_service_1.Comment;
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, /*商品名*/ price, /*价格*/ rating, /*评分*/ desc, /*描述*/ categories /*种类*/) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
/*4.声明一个Comment类 评论*/
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
/*定义Product数据*/
var products = [
    new Product(1, "第一个商品", 1.99, 3.5, "这是第一个商品,是我test演示", ["电子产品", "硬件设备"]),
    new Product(2, "第二个商品", 2.99, 2.5, "这是第二个商品,是我test演示", ["图片"]),
    new Product(3, "第三个商品", 3.99, 4.5, "这是第三个商品,是我test演示", ["食品", "水果", "即食"]),
    new Product(4, "第四个商品", 4.99, 1.5, "这是第四个商品,是我test演示", ["衣服", "男装"]),
    new Product(5, "第五个商品", 5.99, 3.5, "这是第五个商品,是我test演示", ["电子产品", "手机产品"]),
    new Product(6, "第六个商品", 6.99, 0.5, "这是第六个商品,是我test演示", ["婴儿用品", "硬件设备"]),
];
/*定义Comment数据*/
var comments = [
    new product_service_1.Comment(1, 1, "2017-02-02 22:22:22", "张三", 3, "东西不错"),
    new product_service_1.Comment(2, 1, "2017-03-03 23:22:22", "李四", 3, "东西还不错"),
    new product_service_1.Comment(3, 1, "2017-04-04 21:22:22", "王五", 3, "东西挺不错"),
    new product_service_1.Comment(4, 2, "2017-05-05 20:22:22", "赵六", 3, "东西真不错"),
];
app.get('/', function (req, res) {
    res.send("hello Express");
});
app.get("/api/products", function (req, res) {
    res.json(products);
});
app.get("/api/product/:id", function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已启动,地址是：http://localhost:8000");
});
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (webscoket) {
    webscoket.send("这个消息是服务器主动推送的");
    webscoket.on("message", function (message) {
        console.log('接收消息' + message);
    });
});
setInterval(function () {
    if (wsServer.clients) {
        wsServer.clients.forEach(function (client) {
            client.send("这是定时推送");
        });
    }
}, 2000);
