const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const fs = require('fs');
const Product = require('../models/product.model');


// Dumps data directly into db.
router.post('/product', upload.single('productFile'), function (req, res) {
    let productList = {};
    let promiseArr = [];
    if (!req.file) res.status(400).json({Status: "error", message: "JSON file with product data is required."});
    if (req.file.mimetype !== 'application/json') res.status(400).json({
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
                    //updating global count;
                    Product.countTotalProducts().then(function (count) {
                        global.totalProducts = count;
                    });
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
    queryOptions.limit = parseInt(req.query.length);
    queryOptions.skip = parseInt(req.query.start);
    if (isNaN(queryOptions.limit) || isNaN(queryOptions.skip)) {
        return res.status(400).json({
            Status: "error",
            message: " 'start' & 'length' are required fields and they must be numeric."
        });
    }

    if (req.query.pid) findQuery.pid = req.query.pid;
    if (req.query.sort) {
        queryOptions.sort = req.query.sort;
    }
    console.log(`findQuery :-`);
    console.log(findQuery);
    console.log(`queryOptions :- `);
    console.log(queryOptions);
    let projection = {
        "_id": 0,
        "createdAt": 0,
        "updatedAt": 0,
        "__v": 0
    };
    return Product.find(findQuery, projection, queryOptions).exec().then(function (productList) {
        console.log(`Total records found:- ${productList.length}`);
        let response = {
            Status: 'success',
            data: productList
        };
        if (req.query.draw) {
            response.draw = req.query.draw;
            response.recordsTotal = global.totalProducts;
            response.recordsFiltered = global.totalProducts;
        }
        res.json(response);
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({Status: "error", message: "Some error occurred"});
    })
});

module.exports = router;
