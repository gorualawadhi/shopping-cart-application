var config = require('../config');
var mongo = require('mongodb');
var mongoose   = require('mongoose');
var Q = require('q');
var bcrypt = require('bcryptjs');

var db = mongoose.connect(config.database); 


var productDetail = mongoose.Schema({titleName:String, brandName:String, productColor:String, image:String, productSize:String, mrp:String, discount:String, price:String});
var ProductDetail = mongoose.model('ProductDetail', productDetail);

var productService = {};
service.createProduct = createProduct;

module.exports = productService;
function createProduct(productParam){
    var sampleProduct = new ProductDetails();
    sampleProduct.titleName = productParam.titleName;
    sampleProduct.brandName = productParam.brandName;
    sampleProduct.productColor = productParam.productColor;
    sampleProduct.image = productParam.image;
    sampleProduct.productSize = productParam.productSize;
    sampleProduct.mrp = productParam.mrp;
    sampleProduct.discount = productParam.discount;
    sampleProduct.price = productParam.price;

    sampleProduct.save(function (err,data){
    	if(err){
    		console.log(err);
    	}else{
    		console.log('Saved : ', data );
    	}
    });
};
