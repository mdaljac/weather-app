weatherApp.service("getWeather", ["$resource", function($resource){

	this.wResource = $resource("https://api.openweathermap.org/data/2.5/forecast/daily?units=metric&lang=hr",
								{}, { get : { method: "GET" } } );

	this.weatherData = (cityName, cnt) => {
		return this.wResource.get({ q : cityName, cnt : cnt, APPID : "2b6f7645cb308393eb84ed6b1517b425" })
					.$promise.then(function(result){
							return result.list;
						}, function(error, status){
							console.log(error.data.message);
						});;
	}
}]);