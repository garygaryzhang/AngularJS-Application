var app = angular.module('myapp', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
	.when('/login',{
		templateUrl:'login.html',
		controller:'loginCtrl'
	})
	.when('/register',{
		templateUrl:'register.html',
		controller:'registerCtrl'
	})
	.when('/home',{
		templateUrl:'home.html',
		controller:'homeCtrl'
	})
	.when('/profile',{
		templateUrl:'profile.html',
		controller:'profileCtrl'
	})
	.when('/message',{
		templateUrl:'message.html',
		controller:'messageCtrl'
	})
	.when('/detail',{
		templateUrl:'detail.html',
		controller:'detailCtrl'
	})
	.otherwise({
		redirectTo: '/login'
	});
});

function user(_username, _password, _firstname, _lastname, _email, _phone, _loc) {
	this.username = _username;
	this.password = _password;
	this.firstname = _firstname;
	this.lastname = _lastname;
	this.email = _email;
	this.loc = _loc;
	this.phone = _phone;
}

app.run(function($window, $http) {
  var myData;
	if (localStorage.getItem("temp") === null){
		$http({
			'method':'GET',
			'url':'mess.json'
		})
		.then(function(success_reponse){
			myData = success_reponse.data;
			if(typeof(Storage)!== "undefined") localStorage.setItem("temp", JSON.stringify(myData));
		},
		function(err_response){
			console.log(err_response);
		});
	}
});

app.controller("registerCtrl", function($scope, $location){
  
  var sign = localStorage.getItem("SS")?JSON.parse(localStorage.getItem("SS")):[];
  var currentuser = localStorage.getItem("CU")?JSON.parse(localStorage.getItem("CU")):[];
  var users = localStorage.getItem("Users")?JSON.parse(localStorage.getItem("Users")):[];
  
  $scope.cancel = function(){
   sign = false;
   localStorage.setItem("SS", JSON.stringify(sign));
  };
  
  $scope.tryRegister = function(){
    
    var check = true;
    $scope.alert = "";
    if($scope.uname && $scope.pword && $scope.fname && $scope.lname && $scope.email && $scope.location && $scope.phone){
      users.forEach(function(user){
        if(user.username == $scope.uname){
          check = false;
          $scope.alert = "Username is already taken";
        }
      });
      if (check === true) {
        var newuser = new user($scope.uname, $scope.pword, $scope.fname, $scope.lname, $scope.email, $scope.location, $scope.phone);
        currentuser = newuser;
        localStorage.setItem("CU", JSON.stringify(currentuser));
        users.push(newuser);
        sign = true;
        localStorage.setItem("SS", JSON.stringify(sign));
        if (typeof(Storage) !== "undefined") localStorage.setItem("Users", JSON.stringify(users));
				$location.path('/login');
      }
    }
  };
});

app.controller("loginCtrl", function($scope, $location, $http){
  
  var sign = localStorage.getItem("SS")?JSON.parse(localStorage.getItem("SS")):[];
  var currentuser = localStorage.getItem("CU")?JSON.parse(localStorage.getItem("CU")):[];
  var users = localStorage.getItem("Users")?JSON.parse(localStorage.getItem("Users")):[];
  $scope.registeralert = "";
  if(sign === true){
    $scope.registeralert = "Registration successful";
  }
  else{
    $scope.registeralert = "";
  }
  
  $scope.trylogin = function(){
  
    $scope.registeralert = "";
    var validation = false;
		$scope.alert = "";
		if ($scope.uname && $scope.ppassword){
			  users.forEach(function(user){
				if (user.username === $scope.uname && user.password === $scope.ppassword){
					validation = true;
					currentuser = user;
					localStorage.setItem("CU", JSON.stringify(currentuser));
				  $location.path('/home');
				}
			});
			if (validation === false) {
			  $scope.alert = "Invalid Username or Password";
			}
    }
  };
});

app.controller("homeCtrl", function($scope,  $location){
  
  var currentuser = localStorage.getItem("CU")?JSON.parse(localStorage.getItem("CU")):[];
  $scope.currentuser = currentuser;
  $scope.logout = function(){
   sign = false;
   localStorage.setItem("SS", JSON.stringify(sign));
   $location.path('/login');
  };
});


app.controller("profileCtrl", function($scope, $location){
  
  var users = localStorage.getItem("Users")?JSON.parse(localStorage.getItem("Users")):[];
  var currentuser = localStorage.getItem("CU")?JSON.parse(localStorage.getItem("CU")):[];
  $scope.currentuser = currentuser;
  $scope.readOnly = true;
  $scope.edit = function(){
    
    $scope.readOnly = false;
  };
  
  $scope.update = function(){
    
    var check = true;
    $scope.alert1 = "";
    $scope.alert2 = "";
    
    if($scope.uname == currentuser.username && $scope.pword == currentuser.password && $scope.fname == currentuser.firstname && $scope.lname == currentuser.lastname && $scope.email == currentuser.email && $scope.location == currentuser.loc && $scope.phone == currentuser.phone){ 
          
          check = false;

          $scope.alert1 = "Please make some changes before updating";
          
        }
        else{
          
          for(var i=0; i<users.length; i++){  
            console.log(currentuser.username);
            console.log(users[i].username);
				    if (currentuser.username === users[i].username){
				      
				      users[i].username = $scope.uname;
				      users[i].password = $scope.pword;
				      users[i].firstname = $scope.fname;
				      users[i].lastname = $scope.lname;
				      users[i].email = $scope.email;
				      users[i].loc = $scope.location;
				      users[i].phone = $scope.phone;
				      
				    }
          }
          
          currentuser.username = $scope.uname;
          currentuser.password = $scope.pword;
          currentuser.firstname = $scope.fname;
          currentuser.lastname = $scope.lname;
          currentuser.email = $scope.email;
          currentuser.loc = $scope.location;
          currentuser.phone = $scope.phone;
          localStorage.setItem("CU", JSON.stringify(currentuser));
          
          if (typeof(Storage) !== "undefined") localStorage.setItem("Users", JSON.stringify(users));
          $scope.alert2 = "User Updated!";
        }
      };
      
  $scope.reset = function(){
      $scope.uname = currentuser.username;
      $scope.pword = currentuser.password;
      $scope.fname = currentuser.firstname;
      $scope.lname = currentuser.lastname;
      $scope.email = currentuser.email;
      $scope.location = currentuser.loc;
      $scope.phone = currentuser.phone;
  };
});

app.controller("messageCtrl", function($scope, $http, $location){
  
  var currentmesser = localStorage.getItem("CM")?JSON.parse(localStorage.getItem("CM")):[];
  var messlocal = localStorage.getItem("temp")?JSON.parse(localStorage.getItem("temp")):[];
  var showreplymess = localStorage.getItem("messtemp")?JSON.parse(localStorage.getItem("messtemp")):[];
  var indx_obj;
  $scope.currentmesser = currentmesser;
  
  $scope.messlocal = messlocal;
  
  for(var i=0; i<messlocal.length; i++){
    
    messlocal[i].important = parseInt(messlocal[i].important);

  }
  
  $scope.catch = function(x){
    
    indx_obj = x;
    
    currentmesser = indx_obj;
    localStorage.setItem("CM", JSON.stringify(currentmesser));
    
    $location.path('/detail');
    
  };
});

app.controller("detailCtrl", function($scope, $http, $location){
  
  var currentmesser = localStorage.getItem("CM")?JSON.parse(localStorage.getItem("CM")):[];
  var messlocal = localStorage.getItem("temp")?JSON.parse(localStorage.getItem("temp")):[];
  var showreplymess = localStorage.getItem("messtemp")?JSON.parse(localStorage.getItem("messtemp")):[];
  
  $scope.showreplymess = showreplymess;
  
  $scope.currentmesser = currentmesser;
  
  $scope.messlocal = messlocal;
  
  for(var i=0; i<messlocal.length;){
    
    if(currentmesser.created_at == messlocal[i].created_at){
       break;
    }
    else{
       i++;
    }
  }
  
  if(messlocal[i].important === "1"){
     $scope.flag = true;
  }
  else{
     $scope.flag = false;
  }
  
  $scope.delete = function(){

    messlocal.splice(i, 1);
    localStorage.setItem("temp", JSON.stringify(messlocal));
    $location.path('/message');
    
  };
  
  $scope.important = function(){
    
  if(messlocal[i].important === "0" || typeof(messlocal[i].important) === "undefined"){
    
    $scope.flag = true;
    messlocal[i].important = "1";
    localStorage.setItem("temp", JSON.stringify(messlocal));
  }
  else{
    
    $scope.flag = false;
    messlocal[i].important = "0";
    localStorage.setItem("temp", JSON.stringify(messlocal));
    }
  };
  
  if(showreplymess === null){
      messlocal[i].reply = [];
  } else {
       messlocal[i].reply = showreplymess;
  }

  console.log(messlocal[i].reply);
  
  $scope.reply = function(){

    messlocal[i].reply.push($scope.replymess);
    showreplymess =  messlocal[i].reply;
    console.log(showreplymess);
    $scope.showreplymess = showreplymess;
    localStorage.setItem("messtemp", JSON.stringify(showreplymess));
    $scope.replymess = "";
  };
  
});
