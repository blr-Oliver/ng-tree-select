angular.module('ngTreeSelect', ['RecursionHelper', 'ngCssInjector', 'ngSlideAnimations']).directive('treeSelect',
    ['RecursionHelper', function(RecursionHelper){
      var DEFAULT_LAYOUT = 10;
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'ng-tree-select.html',
        cssUrl: 'ng-tree-select.css',
        scope: {
          items: '=',
          depth: '=?',
          layout: '@?'
        },
        compile: function(element){
          return RecursionHelper.compile(element, function($scope){
            $scope.depth = $scope.depth || 0;
            if(!isNaN(+$scope.layout))
              $scope.layout = +$scope.layout;
            if(typeof ($scope.layout) === 'string'){
              $scope.layout = $scope.layout.trim().toLowerCase();
              switch ($scope.layout) {
              case 'radio':
              case 'select':
                break;
              default:
                $scope.layout = DEFAULT_LAYOUT;
              }
            }else
              $scope.layout = $scope.layout > 0 ? $scope.layout : DEFAULT_LAYOUT;
            $scope.$treeSelectId = $scope.$id;
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
  $templateCache.put('ng-tree-select.html', '<div class="tree-select"><ul ng-if="items.length == 1"><li><label ng-class="{active: items[0].active}"><input type="checkbox" name="tree-{{$treeSelectId}}-level-{{depth}}" ng-model="items[0].active" ng-click="items.active = items[0].active ? items[0] : null" /><span ng-bind="items[0].name"></span></label><tree-select ng-if="items[0].active && items[0].children.length" items="items[0].children" depth="depth + 1" layout="{{items[0].layout || layout}}"></tree-select></li></ul><ul ng-if="items.length > 1 && (layout === \'radio\' || items.length <= layout)"><li ng-repeat="item in items"><label ng-class="{active: item.active, inactive : item.active === false}"><input type="{{item.active ? \'checkbox\' : \'radio\'}}" name="tree-{{$treeSelectId}}-level-{{depth}}" boolean-radio="item.active" /><span ng-bind="item.name"></span></label><tree-select ng-if="item.active && item.children.length" items="item.children" depth="depth + 1" layout="{{item.layout || layout}}"></tree-select></li></ul><ul ng-if="layout === \'select\' || items.length > layout"><li><select ng-model="items.active" boolean-select ng-class="{active: items.active, inactive : items.active === null}"><option ng-value="null">&mdash;</option><option ng-repeat="item in items" ng-value="item" boolean-select-option="item.active" ng-bind="item.name"></option></select><tree-select ng-if="items.active && items.active.children.length" items="items.active.children" depth="depth + 1" layout="{{items.active.layout || layout}}"></tree-select></li></ul></div>');
  $templateCache.put('ng-tree-select.css', '.tree-select{padding-left:1em;overflow-y:hidden;transition-property:height;transition-duration:.2s;transition-timing-function:ease-in}.tree-select>ul{list-style-type:none;padding-left:0}.tree-select label{display:inline-block;height:1.5em;margin-bottom:0;margin-top:0;white-space:nowrap}.tree-select label>*{vertical-align:middle;white-space:nowrap}.tree-select label>input[type=checkbox],.tree-select label>input[type=radio]{margin:0;width:1em;height:1em}.tree-select label>span{padding-left:.3em}.tree-select select{padding-left:1em;font-size:100%;font-family:inherit;height:1.3em;margin-bottom:.2em}');
}]);