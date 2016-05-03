var config     = require('../../config');
var express = require('express');
var router = express.Router();
var productService = require('../../services/product.service');

// routes
router.post('/', createProduct);
router.post('/getdata', getdata);
module.exports = router;



function createProduct(req, res){
	productService.createProduct(req.body).then(function(response){
		res.send(response);
	}, function(err){
		res.sendStatus(500);
	});
};

function getdata(req, res){
	productService.getdata(req.body).then(function(response){ 
		res.send(response);
	}, function(err){
		res.sendStatus(500);
	});
};