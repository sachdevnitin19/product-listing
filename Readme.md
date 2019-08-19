# Flipkart Product Listing

Flipkart Product Listing displays products details scraped from flipkart in tabular format with pagination.
Flipkart's Dataset link :- https://www.kaggle.com/PromptCloudHQ/flipkart-products/version/1


## Tech Stack Used
Mlab's Mongo DAAS (Database As A Service) is used for Persistent Data Storage.
Express.JS Node Framework for REST based Webservice. 

## REST APIs
Following are the REST APIs:-

1) POST '/api/v1/product' to dump products data in DB.
2) GET '/api/v1/product' to get product data.

Postman Collection Link:- https://www.getpostman.com/collections/fa0243caa1c34aab1010

## Deployment Steps:-
Currently it is deployed on Heroku which is PAAS (Platform As A Service).
Follow steps mentioned in this link:- https://devcenter.heroku.com/articles/deploying-nodejs

## Steps to run locally
1. Clone this repository.
2. cd into repo directory.
3. run `npm install`. Make sure nodejs is installed on your machine
4. create `production.env` file in .env directory refer `default.env` in .env directory for format and environment variables needed to run app.
5. run `npm start`

