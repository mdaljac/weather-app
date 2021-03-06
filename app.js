//APIKEY: 2b6f7645cb308393eb84ed6b1517b425

var weatherApp = angular.module("weatherApp", ['ngRoute', 'ngSanitize', 'ngResource', 'ngMessages', 'chart.js']);

//ROUTES

weatherApp.config(function($routeProvider, $sceDelegateProvider, ChartJsProvider){

	$routeProvider
	.when("/", {
		templateUrl: "search.html",
		controller: "mainController"
	})
	.when("/forecast", {
		templateUrl: "forecast.html",
		controller: "forecastController"
	});

	ChartJsProvider.setOptions({
		elements:{
			line:{
				fill: false,
				borderColor: "red"
			}
		},
		chartColors: ['rgb(255,0,0)', 'rgb(0,0,255)']
	});

	$sceDelegateProvider.resourceUrlWhitelist([

		'self',
		'https://api.openweathermap.org/data/2.5/forecast/daily'

	]);

});


//SERVICE

weatherApp.service("city", function(){

	this.name = "";

});


//CONTROLLERS

weatherApp.controller("mainController", ["$scope", "$location", "city", function($scope, $location, city){

	$scope.cityName = "";
	$scope.$watch("cityName", function(){
		city.name = $scope.cityName;
	});
	$scope.submit = function(){
		$location.path("/forecast");
	};

}]);


weatherApp.controller("forecastController", ["$scope", "$sce", "$filter", "city", "getWeather", function($scope, $sce, $filter, city, getWeather){

	$scope.isLoading = true;
	$scope.cityName = city.name;
	$scope.data = [[], []];
	$scope.labels = [];
	$scope.series = ['dnevna temperatura', 'večernja temperatura'];
	$scope.options = {
		title: {
			text: "Temperaturni graf",
			display: true
		},
		legend: {
			display: true
		}
	};

	$scope.futureDays = [
		{
			label: "prognoza za...",
			cnt: 2
		},
		{
			label: "3 dana",
			cnt: 3
		},
		{
			label: "5 dana",
			cnt: 5
		},
		{
			label: "7 dana",
			cnt: 7
		}
	];
	$scope.myDay = $scope.futureDays[0];


	$scope.convertToDate = dt => new Date(dt * 1000);

	$scope.getData = function(num, elem = 'undefined'){

		if (elem !== 'undefined'){
			if (angular.element(elem.$event.target).hasClass('active')) return false;
		}

		if (num) {
			$scope.labels = [];
			$scope.data = [[], []];
			$scope.isLoading = true;
		}

		$scope.cnt = num || 2;

		getWeather.weatherData($scope.cityName, $scope.cnt).then(function(result){
			$scope.isLoading = false;
			$scope.days = result;
			angular.forEach($scope.days, function(day){
				$scope.data[0].push(day.temp.day);
				$scope.data[1].push(day.temp.eve);
				$scope.labels.push($filter('date')($scope.convertToDate(day.dt), "dd.MM.yyyy"));
			});
		});
	};

}]);


//DIRECTIVE

weatherApp.directive("dayForecast", function(){

	return {

		templateUrl: "dayForecast.html",
		scope: {
			days: "=",
			convertToDate: "&"
		}

	};

});