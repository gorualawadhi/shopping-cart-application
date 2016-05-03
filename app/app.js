(function () {
    'use strict';

    angular.module('app',['ui.router','ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url:'/home',
            templateUrl: 'home.html',
            controller: 'homeController'
        })
        .state('adminPanel', {
          url:'/admin',
          templateUrl: 'adminPanel.html',
          controller: 'adminController'  
        });
    })
    .controller('adminController', function($scope, productService){
        $scope.product={};
        $scope.Details="";
        $scope.update=function(product){
            $scope.Details = angular.copy(product);

            productService.createProduct(product)
            .then(function(response){
                alert("successfully added");
                $scope.product={};
            }, function(err){
                alert("problem while saving the data");
            });
        }
    })
    .controller('mainController', function($scope,$state, $location){
        $scope.loginUserMain = true;
        $scope.registerUserMain = false;
        if($location.$$path==='/home'){
            $scope.loginUserMain = false;
            $scope.registerUserMain = false;
        }
        $scope.$on('gotoHome', function(){
            $scope.loginUserMain = false;
            $scope.registerUserMain = false;
            $state.go("home");                        
        });
        $scope.$on('gotoRegistrationPage', function(){
            $scope.loginUserMain = false;
            $scope.registerUserMain = true;
        });
    })
    .controller('homeController', function($scope, productService){
                  
        function init(){
            $scope.toggle = true;
            productService.getProducts({})
            .then(function(response){
               $scope.homeData = response;
            });
        }
        init();

        $scope.showVegs = function(paramObj){
            productService.getProducts(paramObj)
            .then(function(response){
               $scope.homeData = response;
            });
        }
        $scope.toggleMenu = function(){
            $scope.arrow = !$scope.arrow;
            $scope.toggle = !$scope.toggle;
        };
        $scope.filterArr=[];
       $scope.method1 = function(var1){
            var index = $scope.filterArr.indexOf(var1);
            if(index<0){
                $scope.filterArr.push(var1);    
            }
            else{
                $scope.filterArr.splice(index, 1);
            }            
        };        
        $scope.showproducts = function(x){            
            if($scope.filterArr.length==0){
                return true;
            }
            else{
                for(var i = 0;i<$scope.filterArr.length;i++){
                    if(x.brandName==$scope.filterArr[i]){                    
                        return true;
                    }                                
                }
                return false;   
            }                      
        }
    })
    .directive('clickAnywhereOnDoc', function( $document){
        return{
            restrict: 'A',
            link: function(object, element, attr){
                element.on('click', function(e){
                    if (object.toggle == false ) object.toggle=true;
                    if (object.arrow == true ) object.arrow=false;
                    e.stopPropagation();
                });
                $document.on('click', function(){
                    object.$apply(attr.clickAnywhereOnDoc);
                });
            }
        };
    })
    .directive('brandDirective', function(){
        return{
            restrict:'E',
            templateUrl:'brand.html'
        }
    })
    .directive('homeDirective', function(){
        return {
            restrict: 'E',
            templateUrl: 'item.html'            
        };
    })
    .directive('headerDirective', function(){
        return{
            restrict: 'E',
            templateUrl: 'header.html'
        };
    })
    .directive('footerDirective', function(){
        return{
            restrict: 'E',
            templateUrl: 'footer.html'
        };
    })
    .service('productService', function($http){
        var self = this;
        self.getProducts =  function(paramObj){
            return $http.post('/api/product/getdata', paramObj).then(handleSuccess, handleError);
        };
        self.createProduct = function(product){
            return $http.post('/api/product', product).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            console.log("I am back at client side");
            return res.data;
        }
        function handleError(err) {
            console.log("i m in client with error");
            return err;
        }
    })
    .controller('registerController',function($scope, userService,$state) {    
        function universalLogin(){
            $scope.loginUserMain = true;
            $scope.registerUserMain = false;            
        };
        universalLogin();        
        $scope.helloWorld = userService.helloWorld();
        //var testCtrl1ViewModel = $scope.$new();
        //$controller('homeController',{$scope : testCtrl1ViewModel });
        //testCtrl1ViewModel.myMethod();    
        
        $scope.showRegisterUser = function(){
            $scope.$emit("gotoRegistrationPage");
        }; 

        $scope.showLoginUser = function(){
            universalLogin();
        };
      
        $scope.saveUser = function() {
        userService.Update($scope.user)
            .then(function () {
                console.log('User updated');
            })
        };
        $scope.loginMethod = function(){
            console.log("loginMethod is calling..");
            userService.login({username:$scope.username, password:$scope.password})
            .then(function(res){
                if(res){
                    console.log("data is carried." + res); 
                    $scope.$emit("gotoHome");
                }else{
                    $scope.$emit("gotoRegistrationPage");
                }                
            }, function(err){
                console.log("error" + err);
                alert('there is some error in login');

            });
        };
        function initController() {
            // get current user
            console.log('init controller');            
            $scope.user = {};
            $scope.username = "";
            $scope.password = "";
        }
        initController();
    })
    .factory('userService', function($http, $q) {
        var service = {};
        service.helloWorld = function () {
            return 'Hello World!';
        };
        service.Update = Create;
        service.login = loginFunctionality;
        return service;

        function loginFunctionality(userLogin){
            return $http.post('/api/users/login', userLogin)
            .then(function(res){
                console.log("i am at login client");
                if((res!==undefined || res !== null || res!== '') && (userLogin.username==res.data.username)){
                    return res.data;
                }else{
                    alert('you are not signed up with us. please register with us');
                    return undefined;
                }
            }, function(err){
                if(err.status==401){
                    alert('you are not signed up with us. please register with us');
                    return undefined;
                }
                else{
                    console.log("i m in client with error");
                    return err;
                }
            });
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            console.log("I am back at client side");
            return res.data;
        }
        function handleError(err) {
            console.log("i m in client with error");
            return err;
        }
    });

    //angular.bootstrap(document, ['app']);    
})();
