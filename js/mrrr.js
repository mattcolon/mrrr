/*
 * Mrrr Web Comic Application
 * @author Matthew Colón
 */ 

(function() {

    // Creates the "mrrrApp" Angular module
    var app = angular.module("mrrrApp", ["ngRoute"]);

    // Routes to the appropriate pages based on the URL
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/home.html"
            })
            .when("/comics", {
                controller: "ComicsController",
                templateUrl: "/archives.html"
            })
            .when("/comics/:comicID", {
                controller: "ComicsController",
                templateUrl: "/comic.html"
            })
            .when("/fanart", {
                controller: "FanartController",
                templateUrl: "/fanart.html"
            })
            .when("/fanart/:fanartID", {
                controller: "FanartController",
                templateUrl: "/fanart.showcase.html"
            })
            .when("/about", {
                templateUrl: "/about.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    }]);

    (function() {

        var comicsData, // The data that contains all of the comics' information
            archivesData, // Contains the comics data structured for the archives page
            initialYearNum = 2002; // The first year of comic data

        // Creates the controller for interacting with the comics data
        app.controller('ComicsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

            // Organizes the comics data into a structure to be used on the archives page:
            // archivesData = [{
            //    yearNum: 2002,
            //    months: [{
            //        monthName: "January",
            //        dates: [{
            //            id: 1,
            //            date: "1/15",
            //            title: "Example Comic 1"
            //        }, {
            //            ...
            //        }]
            //    }, {
            //        ...
            //    }]
            //}, {
            //    ...
            //}];
            function createArchivesData(comics) {

                var archivesData = [];

                // Integrate each comic's data into the structure needed for the archives page
                for (var i = 0, comicsLength = comics.length; i < comicsLength; i++) {
                    
                    // Derive the date information from the comic image's file name
                    var comic = comics[i],
                        comicDateString = comic.image.split('.')[0], // The file name is YYYY-MM-DD.jpg
                        comicDate = new Date(comicDateString),
                        monthNum = comicDate.getMonth(),
                        monthName = comicDate.toLocaleString("en-us", { month: "long" }), // e.g. "January"
                        yearNum = comicDate.getFullYear(),
                        monthAndDay = (monthNum + 1) + "/" + comicDate.getDate(); // e.g. "4/10"

                    // Mod the year number by the initial year number to access the appropriate index
                    var year = archivesData[yearNum % initialYearNum];
                    if (!year) {
                        year = {
                            yearNum: yearNum,
                            months: []
                        };
                        archivesData[yearNum % initialYearNum] = year;
                    }
                    
                    var month = year.months[monthNum];
                    if (!month) {
                        month = {
                            monthName: monthName,
                            dates: []
                        };
                        year.months[monthNum] = month;
                    }

                    month.dates.push({
                        id: i + 1,
                        date: monthAndDay,
                        title: comic.title 
                    });
                }

                return archivesData;
            }

            // Updates the scope using the cached comics data and archives data
            function updateScope() {

                $scope.archivesData = archivesData;
                $scope.comics = comicsData;

                // Add specific comic data if the route parameters contain an ID
                var comicID = $routeParams.comicID;
                if (!!comicID) {
                    $scope.comicID = parseInt(comicID);
                    $scope.comic = comicsData[$scope.comicID - 1];
                }
            }

            if (!comicsData) {
                // Fetch the comics data from the json file, then cache it and the archives data derived from it
                $http.get("/json/comics.json").then(function(response) {
                    comicsData = response.data;
                    archivesData = createArchivesData(comicsData);
                    updateScope();
                });
            } else {
                updateScope();
            }
        }]);
    })();

    (function() {

        var fanartData;
        angular.module('mrrrApp')
            .controller('FanartController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

            function updateScope() {

                $scope.introduction = fanartData.introduction;
                $scope.fanartSubmissions = fanartData.fanartSubmissions;

                // Add specific fanart data if the route parameters contain an ID
                var fanartID = $routeParams.fanartID;
                if (!!fanartID) {
                    $scope.fanartID = parseInt(fanartID);
                    $scope.fanart = fanartData.fanartSubmissions[$scope.fanartID - 1];
                }
            }

            if (!fanartData) {
                $http.get("/json/fanart.json").then(function(response) {
                    fanartData = response.data;
                    updateScope();
                });
            } else {
                updateScope();
            }
        }]);
    })();
})();