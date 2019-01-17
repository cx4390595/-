"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var path = require("path");
var app = express();
app.use('/', express.static(path.join(__dirname, '..', 'client')));
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
    new Product(1, "第一个商品", 1.99, 3.5, "这是第一个商品,电子产品,硬件设备", ["电子产品", "硬件设备"]),
    new Product(2, "第二个商品", 2.99, 2.5, "这是第二个商品,图书", ["图书"]),
    new Product(3, "第三个商品", 3.99, 4.5, "这是第三个商品,电子产品, 水果, 图书", ["电子产品", "水果", "图书"]),
    new Product(4, "第四个商品", 4.99, 1.5, "这是第四个商品,硬件设备,男装,图书", ["硬件设备", "男装", "图书"]),
    new Product(5, "第五个商品", 5.99, 3.5, "这是第五个商品,电子产品,手机产品", ["电子产品", "手机产品"]),
    new Product(6, "第六个商品", 6.99, 0.5, "这是第六个商品,婴儿用品,硬件设备", ["婴儿用品", "硬件设备"]),
];
/*定义Comment数据*/
var comments = [
    new Comment(1, 1, "2017-02-02 22:22:22", "张三", 3, "东西不错"),
    new Comment(2, 1, "2017-03-03 23:22:22", "李四", 3, "东西还不错"),
    new Comment(3, 1, "2017-04-04 21:22:22", "王五", 3, "东西挺不错"),
    new Comment(4, 2, "2017-05-05 20:22:22", "赵六", 3, "东西真不错"),
];
app.get('/', function (req, res) {
    res.send("hello Express");
});
app.get("/api/products", function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get("/api/product/:id", function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get("/api/product/:id/comments", function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已启动,地址是：http://localhost:8000");
});
var subscription = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    // websocket.send("这个消息是服务器主动推送的")
    websocket.on("message", function (message) {
        var messageObj;
        if (typeof message === "string") {
            messageObj = JSON.parse(message);
        }
        var productIds = subscription.get(websocket) || [];
        subscription.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscription.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscription.delete(ws);
        }
    });
}, 2000);
