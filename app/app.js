(function () {
    'use strict';

    angular.module('app',['ui.router','ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url:'/home',
            templateUrl: 'home.html',
            controller: 'homeController'
        });
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
    .controller('homeController', function($scope, userService){
                  
        console.log( userService.helloWorld());
        $scope.toggle = true;
        $scope.toggleMenu = function(){
            $scope.arrow = !$scope.arrow;
            $scope.toggle = !$scope.toggle;
        };        
        $scope.Details="";
        $scope.update=function(product){
            $scope.Details = angular.copy(product);
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
