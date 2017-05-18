(function() {

    var app = angular.module("mrrrApp", ["ngRoute"]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/home.html"
            })
            .when("/archives", {
                controller: "ComicsController",
                templateUrl: "/archives.html"
            })
            .when("/comics/:comicID", {
                controller: "ComicsController",
                templateUrl: "/comic.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    }]);

    angular.module('mrrrApp')
        .controller('ComicsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        function createArchivesData(comics) {

            var archivesData = [];

            for (var i = 0, comicsLength = comics.length; i < comicsLength; i++) {
                
                var comic = comics[i];
                
                var monthNum = comic.image.substring(0, 2);
                var dayNum = comic.image.substring(2, 4);
                var yearNum = comic.image.substring(4, 8);
                var date = new Date(yearNum, monthNum - 1, dayNum);
                var monthName = date.toLocaleString("en-us", { month: "long" });
                var monthAndDay = parseInt(monthNum) + "/" + parseInt(dayNum);

                var year = archivesData[yearNum % 2002];
                if (!year) {
                    year = {
                        yearNum: yearNum,
                        months: []
                    };
                    archivesData[yearNum % 2002] = year;
                }
                
                var month = year.months[monthNum - 1];
                if (!month) {
                    month = {
                        monthName: monthName,
                        dates: []
                    };
                    year.months[monthNum - 1] = month;
                }

                month.dates.push({
                    id: comic.id,
                    date: monthAndDay,
                    title: comic.title 
                });
            }

            return archivesData;
        }

        function updateScope(data) {
            var comicID = $routeParams.comicID;
            $scope.comics = data;
            if (!!comicID) {
                $scope.comicID = parseInt(comicID);
                $scope.comic = data[$scope.comicID - 1];
            }
            $scope.archivesData = createArchivesData(data);
        }

        if (!$scope.comics) {
            $http.get("/json/comics.json").then(function(response) {
                updateScope(response.data);
            });
        } else {
            updateScope();
        }
    }]);
})();