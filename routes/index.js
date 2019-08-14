const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const fs = require('fs');
const Product = require('../models/product.model');
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

// Dumps data directly into db.
router.post('/product', upload.single('productFile'), function (req, res) {
    let productList = {};
    let promiseArr = [];
    if (!req.file) res.status(400).json({Status: "error", message: "JSON file with product data is required."});
    if (req.file.mimetype != 'application/json') res.status(400).json({
        status: "Error",
        message: "Only json files are allowed"
    });
    fs.readFile(`./uploads/${req.file.filename}`, 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(400).status({status: "Error", message: "Invalid json file"});
        } else {
            try {
                productList = JSON.parse(data);
                productList.products.forEach(productData => {
                    promiseArr.push(new Product(productData).save());
                });

                Promise.all(promiseArr).then(function (results) {
                    res.json({Status: "Success"});
                })
                    .catch(function (err) {
                        console.error(err);
                        res.status(500).json({
                            status: "Error",
                            message: "some error occurred while inserting data in db"
                        });
                    });
            } catch (jsonErr) {
                console.error(jsonErr);
                res.status(400).json({status: "Error", message: "Invalid json file"});
            }
        }
    });
});

router.get('/product', function (req, res) {
    let queryOptions = {
        sort: {}
    };
    let findQuery = {};

    queryOptions.limit = parseInt(req.query.limit);
    queryOptions.skip = parseInt(req.query.offset);
    if (isNaN(options.limit) || isNaN(options.skip)) {
        return res.status(400).json({
            Status: "error",
            message: " 'limit' & 'offset' are required fields and they must be numeric."
        });
    }

    if (req.query.pid) findQuery.pid = req.query.pid;
    if (req.query.retail_price) queryOptions.sort.retail_price = req.query.retail_price;
    if (req.query.discounted_price) queryOptions.query.discounted_price = req.query.discounted_price;
    console.log(`findQuery :- ${findQuery}`);
    console.log(`queryOptions :- ${queryOptions}`);
    return Product.find(findQuery, null, queryOptions).exec().then(function (productList) {
        console.log(`Total records found:- ${productList.length}`);
        res.json({Status: 'success', productList: productList});
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({Status: "error", message: "Some error occurred"});
    })
});

module.exports = router;
