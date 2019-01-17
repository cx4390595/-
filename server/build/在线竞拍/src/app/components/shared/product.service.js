"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ProductService = /** @class */ (function () {
    /*1.定义Product数据*/
    // private products: Product[] = [
    //    new Product(1, "第一个商品", 1.99, 3.5, "这是第一个商品,是我test演示", ["电子产品", "硬件设备"]),
    //    new Product(2, "第二个商品", 2.99, 2.5, "这是第二个商品,是我test演示", ["图片"]),
    //    new Product(3, "第三个商品", 3.99, 4.5, "这是第三个商品,是我test演示", ["食品", "水果", "即食"]),
    //    new Product(4, "第四个商品", 4.99, 1.5, "这是第四个商品,是我test演示", ["衣服", "男装"]),
    //    new Product(5, "第五个商品", 5.99, 3.5, "这是第五个商品,是我test演示", ["电子产品", "手机产品"]),
    //    new Product(6, "第六个商品", 6.99, 0.5, "这是第六个商品,是我test演示", ["婴儿用品", "硬件设备"]),
    //  ];
    /*4定义Comment数据*/
    // private comments:Comment[] = [
    //   new Comment(1,1,"2017-02-02 22:22:22","张三",3,"东西不错"),
    //   new Comment(2,1,"2017-03-03 23:22:22","李四",3,"东西还不错"),
    //   new Comment(3,1,"2017-04-04 21:22:22","王五",3,"东西挺不错"),
    //   new Comment(4,2,"2017-05-05 20:22:22","赵六",3,"东西真不错"),
    // ];
    function ProductService(http) {
        this.http = http;
    }
    /*2. 获取所有的商品信息并返回*/
    ProductService.prototype.getProducts = function () {
        return this.http.get("/api/products");
    };
    /*3.根据商品Id找出这个商品并返回*/
    ProductService.prototype.getProduct = function (id) {
        return this.http.get("/api/product/" + id);
    };
    /*5.接受一个number类型商品id 返回一个Comments数组*/
    ProductService.prototype.getCommentsForProductId = function (id) {
        /*做一个过滤 声明一个函数 如果评论id和传递来的id相等 就把评论加进Comment[]中*/
        return this.comments.filter(function (comment) { return comment.productId == id; });
    };
    /*获取产品类别*/
    ProductService.prototype.getAllCategories = function () {
        return ["电子产品", "硬件设备", "图书"];
    };
    ProductService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
/*1.定义数据类型*/
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
