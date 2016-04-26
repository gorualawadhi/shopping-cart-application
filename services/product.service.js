var config = require('../config');
var mongo = require('mongodb');
var mongoose   = require('mongoose');
var Q = require('q');

var productDetail = mongoose.Schema({titleName:String, brandName:String, productColor:String, image:String, productSize:String, mrp:String, discount:String, price:String});
var ProductDetail = mongoose.model('ProductDetail', productDetail);

var productService = {};
productService.createProduct = createProduct;
productService.getdata = getdata ;

module.exports = productService;

function getdata(){
    var deferred =  Q.defer();
    
    ProductDetail.find({}, function(err, data){
        if(err){
            console.log(err);
            deferred.reject(err);
        }else{
            console.log('product Saved : ', data );
            deferred.resolve(data);
        }
    });
    deferred.promise;
};

function createProduct(productParam){
    var deferred =  Q.defer();
    var sampleProduct = new ProductDetail();
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
            deferred.reject(err);
    	}else{
    		console.log('product Saved : ', data );
            deferred.resolve(data);
    	}
    });
    return deferred.promise;
};
