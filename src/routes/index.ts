import {Router} from 'express';
import {User} from "../model/User";
import * as bodyParser from 'body-parser';
import {UserController} from '../Controller/UserController';
import {SubscriptionController} from '../Controller/SubscriptionController';
import {Transaction} from "../model/Transaction";


const index = Router();
var userController = new UserController();
var subController = new SubscriptionController();
/* GET home page. */
index.get('/', function (req, res, next) {
    res.render('index', {title: 'Visual Studio Code!'});
});

/* GET Quick Start. */
index.get('/quickstart', function (req, res, next) {
    res.render('quickstart');
});

index.get('/user/register', function (req, res, next) {

    let user = new User("nguyentrung0904");
    console.log(user.username)
    let json = JSON.stringify(user);
    res.setHeader("content-type", "application/json");
    res.send(user);

});
index.post('/user/register', function (req, res, next) {
    let data = JSON.parse(JSON.stringify(req.body))

    let user = new User(data.username);
    user.password = data.password
    userController.registerUser(user, function (result) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
            'result': result
        }))
    });

});

index.post('/user/login', function (req, res, next) {
    let data = JSON.parse(JSON.stringify(req.body))
    let username = data.username;
    let password = data.password;
    userController.login(username, password, function (result) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
            'result': result
        }))
    });

});


index.get('/subscription/get', function (req, res, next) {
    // let data = JSON.parse(JSON.stringify(req.body))
    // let username = data.username;
    // let password = data.password;
    subController.getSubscriptionItemList(function (list) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
            'list': list
        }))
    })
});


index.post('/subscription/subscribe', function (req, res, next) {
    let data = JSON.parse(JSON.stringify(req.body))
    let transaction = new Transaction()
    transaction.user_id = parseInt(data.user_id);
    transaction.pricing_id = parseInt(data.pricing_id);
    transaction.subscription_id = parseInt(data.subscription_id);
    subController.subscribe(transaction, function (result, data) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result))
    })
});
index.get('/pricing', function (req, res, next) {
    let id = parseInt(req.query.id)
    let data = JSON.parse(JSON.stringify(req.body))

    subController.getPricingDetails(id, function (result) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result))
    })
});
export default index;
