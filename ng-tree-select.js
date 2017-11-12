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
      element.bind('click change input', function(){
        //TODO add direct DOM property check
        $scope.$apply(target + ' = true');
        //recompute selector each time because name attribute itself may change
        var selector = 'input[name="' + element.attr('name') + '"]';
        angular.element(filter.call($document[0].querySelectorAll(selector), function(e){
          return e !== element[0];
        })).triggerHandler('deselect');
      });
      element.bind('deselect', function(){
        $scope.$apply(target + ' = false');
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
  $templateCache.put('ng-tree-select.html', '<div class="tree-select"><ul ng-if="items.length == 1"><li><label ng-class="{active: items[0].active}"><input type="checkbox" name="level-{{depth}}" ng-model="items[0].active" ng-click="items.active = items[0].active ? items[0] : null" /><span ng-bind="items[0].name"></span></label><tree-select ng-if="items[0].active && items[0].children.length" items="items[0].children" depth="depth + 1"></tree-select></li></ul><ul ng-if="items.length > 1 && items.length < 10"><li ng-repeat="item in items"><label ng-class="{active: item.active, inactive : item.active === false}"><input type="radio" name="level-{{depth}}" boolean-radio="item.active" ng-value="item" ng-model="items.active" /><span ng-bind="item.name"></span></label><tree-select ng-if="item.active && item.children.length" items="item.children" depth="depth + 1"></tree-select></li></ul><ul ng-if="items.length >= 10"><li><select ng-model="items.active" boolean-select ng-class="{active: items.active, inactive : items.active === null}"><option ng-repeat="item in items" ng-value="item" boolean-select-option="item.active" ng-bind="item.name"></option></select><tree-select ng-if="items.active && items.active.children.length" items="items.active.children" depth="depth + 1"></tree-select></li></ul></div>');
  $templateCache.put('ng-tree-select.css', '.tree-select{padding-left:1em;overflow-y:hidden;transition-property:height;transition-duration:.2s;transition-timing-function:ease-in}.tree-select>ul{list-style-type:none;padding-left:0}.tree-select label,.tree-select select{height:1.5em;transform-origin:center left;transition-property:transform,opacity;transition-duration:.1s;transition-timing-function:linear}.tree-select label{display:inline-block;white-space:nowrap}.tree-select label>*{vertical-align:middle;white-space:nowrap}.tree-select label>input[type=checkbox],.tree-select label>input[type=radio]{margin:0;width:1em;height:1em}.tree-select label>span{padding-left:.3em}.tree-select select{padding-left:.8em;font-size:100%;font-family:inherit;-webkit-padding-after:.1em}.tree-select .inactive{transform:scale(.9);opacity:.8}');
}]);