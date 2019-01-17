import * as express from 'express'
import {Server} from "ws"
import * as path from 'path'


const app = express();
app.use('/',express.static(path.join(__dirname,'..','client')));

export class Product {
    constructor(
        public id: number,
        public title: string, /*商品名*/
        public price: number, /*价格*/
        public rating: number, /*评分*/
        public desc: string, /*描述*/
        public categories: Array<string>/*种类*/
    ) {
    }
}

/*4.声明一个Comment类 评论*/
export class Comment {
    constructor(public id: number,
                public productId: number,
                public timestamp: string,
                public user: string,
                public  rating: number,
                public content: string
    ) {

    }
}

/*定义Product数据*/
const products: Product[] = [
    new Product(1, "第一个商品", 1.99, 3.5, "这是第一个商品,电子产品,硬件设备", ["电子产品", "硬件设备"]),
    new Product(2, "第二个商品", 2.99, 2.5, "这是第二个商品,图书", ["图书"]),
    new Product(3, "第三个商品", 3.99, 4.5, "这是第三个商品,电子产品, 水果, 图书", ["电子产品", "水果", "图书"]),
    new Product(4, "第四个商品", 4.99, 1.5, "这是第四个商品,硬件设备,男装,图书", ["硬件设备", "男装", "图书"]),
    new Product(5, "第五个商品", 5.99, 3.5, "这是第五个商品,电子产品,手机产品", ["电子产品", "手机产品"]),
    new Product(6, "第六个商品", 6.99, 0.5, "这是第六个商品,婴儿用品,硬件设备", ["婴儿用品", "硬件设备"]),
];
/*定义Comment数据*/
const comments: Comment[] = [
    new Comment(1, 1, "2017-02-02 22:22:22", "张三", 3, "东西不错"),
    new Comment(2, 1, "2017-03-03 23:22:22", "李四", 3, "东西还不错"),
    new Comment(3, 1, "2017-04-04 21:22:22", "王五", 3, "东西挺不错"),
    new Comment(4, 2, "2017-05-05 20:22:22", "赵六", 3, "东西真不错"),
];
app.get('/', (req, res) => {
    res.send("hello Express")
});
app.get("/api/products", (req, res) => {
    let result = products;
    let params = req.query;

    if (params.title) {
        result = result.filter((p) => p.title.indexOf(params.title) !== -1)
    }
    if (params.price && result.length > 0) {
        result = result.filter((p) => p.price <= parseInt(params.price))
    }
    if (params.category !== "-1" && result.length > 0) {
        result = result.filter((p) => p.categories.indexOf(params.category) !== -1)
    }
    res.json(result);
});
app.get("/api/product/:id", (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});
app.get("/api/product/:id/comments", (req, res) => {
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id))
});

const server = app.listen(8000, "localhost", () => {
    console.log("服务器已启动,地址是：http://localhost:8000");
});

const subscription = new Map<any, number[]>();

const wsServer = new Server({port: 8085});
wsServer.on("connection", websocket => {
    // websocket.send("这个消息是服务器主动推送的")
    websocket.on("message", message => {
        let messageObj
        if (typeof message === "string") {
            messageObj = JSON.parse(message)
        }
        let productIds = subscription.get(websocket) || [];
        subscription.set(websocket, [...productIds, messageObj.productId])
    })
});
const currentBids = new Map<number, number>();

setInterval(() => {
    products.forEach(p => {
        let currentBid = currentBids.get(p.id) || p.price
        let newBid = currentBid + Math.random()*5;
        currentBids.set(p.id ,newBid)
    });
    subscription.forEach((productIds:number[],ws)=>{
        if(ws.readyState === 1){
            let newBids = productIds.map(pid=>({
                productId:pid,
                bid:currentBids.get(pid)
            }))
            ws.send(JSON.stringify(newBids))
        }else{
            subscription.delete(ws)
        }

    });
}, 2000);