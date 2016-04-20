var app = angular.module("CXD", ['ui.router', 'ngprogressBar', 'ngTable']);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $urlRouterProvider
                .otherwise('/index/');
            $stateProvider
                .state('index', {
                    url: '/index/:url',
                    templateUrl: 'assets/tpl/search.html',
                    controller: 'AppCtrl'
                })
                .state('doc', {
                    url: '/doc',
                    templateUrl: 'assets/tpl/doc.html'
                })
        }]
);
app.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.urls = {};
    $rootScope.tableParams = {};
    $rootScope.url="";
    $rootScope.socket = io.connect("http://wx.xss.pw");
    $rootScope.WW = document.documentElement.clientWidth;
    $rootScope.HH = document.documentElement.clientHeight;
    $rootScope.activeindex=$location.$$path.indexOf("/index")==0?0:1;
}]);
app.controller("AppCtrl", ["$scope", "$location", "$stateParams", "$rootScope", "$state", "NgTableParams", function ($scope, $location, $stateParams, $rootScope, $state, NgTableParams) {
    $scope.sliceUrl = function (url) {
        return parseURL(url).join(",")
    };
    $rootScope.url = $scope.sliceUrl($stateParams.url);
    $rootScope.url.split(",").forEach(function (url) {
        if (url && !$rootScope.urls[url]) {
            $rootScope.urls[url] = {
                progress: 0,
                subdomain: [],
                count: 0
            };
            if (!$rootScope.tableParams[url])
                $rootScope.tableParams[url] = {
                    data: []
                };

            $rootScope.socket.emit('DOMAIN', {url: url});
        }
    });
    $scope.aliginleft = function () {
        return !!Object.keys($rootScope.urls).length;
    };

    $scope.open = function ($event) {
        if ($event.keyCode == 13) {
            $state.go("index", {url: $scope.sliceUrl($scope.url)})
        }
    };
    $scope.activeUrlTabIndex = 0;
    $scope.activeUrlTab = function ($index) {
        $scope.activeUrlTabIndex = $index;
    };

    $rootScope.socket.removeAllListeners("DOMAIN_DATA");
    $rootScope.socket.removeAllListeners("DOMAIN_PROGRESS");

    $rootScope.socket.on('DOMAIN_DATA', function (item) {
        item.forEach(function(data){
            $rootScope.urls[data.domain].subdomain.push({
                url: data.url,
                ip: data.ip
            });
            $rootScope.urls[data.domain].count = $rootScope.urls[data.domain].count + 1;
            $rootScope.tableParams[data.domain].data.push({
                url: data.url,
                ip: data.ip
            });

            $rootScope.tableParams[data.domain].table = new NgTableParams({count: 20}, {
                counts: [20, 50], dataset: $rootScope.tableParams[data.domain].data
            });
        });
    });

    $rootScope.socket.on('DOMAIN_PROGRESS', function (data) {
        $scope.$apply(function () {
            $rootScope.urls[data.domain].progress = (data.pos * 100).toFixed(2);
        })
    });
}]);
