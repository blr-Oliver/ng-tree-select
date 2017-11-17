angular.module('ngTreeSelect', ['RecursionHelper', 'ngCssInjector', 'ngSlideAnimations']).directive('treeSelect',
    ['RecursionHelper', function(RecursionHelper){
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'ng-tree-select.html',
        cssUrl: 'ng-tree-select.css',
        scope: {
          items: '=',
          depth: '=?'
        },
        compile: function(element){
          return RecursionHelper.compile(element, function($scope){
            $scope.depth = $scope.depth || 0;
          });
        }
      }
    }]).directive('booleanRadio', ['$document', '$parse', function($document, $parse){
  var filter = Array.prototype.filter;
  return {
    restrict: 'A',
    link: function($scope, element, attrs){
      var target = attrs.booleanRadio;
      element.prop('checked', $parse(target)($scope));
      element.bind('click', function(){
        if(this.checked){
          $scope.$applyAsync(target + ' = true');
        //recompute selector each time because name attribute itself may change
        var selector = 'input[name="' + element.attr('name') + '"]';
        filter.call($document[0].querySelectorAll(selector), function(e){
          return e !== element[0];
        }).forEach(function(e){
          angular.element(e).triggerHandler('deselect');
        });
        }else
          $scope.$applyAsync(target + ' = false');
      });
      element.bind('deselect', function(){
        this.checked = false;
        $scope.$applyAsync(target + ' = false');
      })
    }
  }
}]).directive('booleanSelect', [function(){
  return {
    restrict: 'A',
    link: function($scope, element, attrs, controller){
      element.on('change input blur', function(){
        for (var i = this.options.length; i--;){
          var option = this.options[i];
          var optionController = angular.element(option).controller('booleanSelectOption');
          optionController && optionController.update(option.selected);
        }
      });
    }
  }
}]).directive('booleanSelectOption', [function(){
  return {
    restrict: 'A',
    require: 'booleanSelectOption',
    controller: ['$scope', function($scope){
      this.update = function(newValue){
        $scope.$applyAsync(this.targetProperty + ' = ' + !!newValue);
      }
    }],
    link: function($scope, element, attrs, controller){
      controller.targetProperty = attrs.booleanSelectOption;
    }
  }
}]).animation('.tree-select', ['slideAnimations', function(slideAnimations){
  return {
    enter: slideAnimations.down,
    leave: slideAnimations.up,
  }
}]).run(['$templateCache', function($templateCache){
  $templateCache.put('ng-tree-select.html', 'TEMPLATE');
  $templateCache.put('ng-tree-select.css', 'STYLE');
}]);