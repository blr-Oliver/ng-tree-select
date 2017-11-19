angular.module('testNgTreeSelect', ['ngTreeSelect']).controller('TestCtrl',
    ['$scope', '$http', function($scope, $http){
      $http({
        url: '/test/data.json',
        method: 'GET'
      }).then(function(response){
        $scope.data = response.data;
        $scope.selected = $scope.data[1].children[0].children[1].children[16] = $scope.data[1].children[0].children[0].children[17];
      });
    }])