# ng-tree-select
Angular tree select component

# What is this?
This is angular.js widget to help user select single item from hierarchical structure using common controls: radio buttons, checkboxes and selects.

# What can this do?

### Already implemented
 - The widget generates repeated layout for each level of depth, easily customizable with CSS.
 - The widget can choose way how children are displayed on each level based on collection size.
 - Unselected branches are automatically hidden.
 - Shown/hidden sections are animated with slide down/up.
 - The widget will mark selected item on each level with `active` flag, as well as adding `active` property to collection of children.
 
### Planned
 - Make model properties customizable (currently hardcoded as `name`, `children` and `active`).
 - Make threshold to switch between radio/select configurable (currently hardcoded to `10`). Also add option to suppress checkboxes.
 - Support `ngModel` on the widget to automatically track the selection and external changes to model.
 
# What can NOT this do?
- Display custom structures for items.
- Lazily request data for populated children.
- Provide access to events on rendered items.

# Example

```javacript
//...
$scope.items = [
  { name: 'Option 1', children: [
    { name: 'Option 1.1', children: [
      { name: 'Option 1.1.1' }
    ]}, { name: 'Option 1.2' }
  ]}, { name: 'Option 2', children: [
    { name: 'Option 2.1' },
    { name: 'Option 2.2' },
    { name: 'Option 2.3' },
    { name: 'Option 2.4' },
    { name: 'Option 2.5' },
    { name: 'Option 2.6' },
    { name: 'Option 2.7' },
    { name: 'Option 2.8' },
    { name: 'Option 2.9' },
    { name: 'Option 2.10' }
  ]} 
];
//...
```

```HTML
<tree-select items="items"></tree-select>
```

# Notes and details
Make sure to include `ngAnimate` to your application to enable slide-down/up effect.