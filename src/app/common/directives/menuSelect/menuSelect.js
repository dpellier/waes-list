/**
 * Generate a select box menu
 *
 * Attributes:
 *   - icon: the icon to display
 *   - items: the select list, each can have the following properties
 *     - title: the displayed item label
 *     - action: the action to call on item click
 *     - icon (optional): an icon on left of the label
 *
 * Example:
 * <menu-select icon="dots-three-vertical" items="controller.menuActions"></menu-select>
 */

class MenuSelectCtrl {
    constructor() {
        this._menuOpen = false;
    }

    closeMenu() {
        this._menuOpen = false;
    }

    clickAction(fn) {
        fn();
        this.closeMenu();
    }
}

// @ngInject
function menuSelect($document) {
    return {
        restrict: 'E',
        templateUrl: 'app/common/directives/menuSelect/menuSelect.html',
        scope: {
            icon: '@',
            items: '='
        },
        controller: 'menuSelectCtrl',
        controllerAs: 'controller',
        link: ($scope, element, attrs, controller) => {
            function closeMenu() {
                $scope.$apply(() => {
                    controller.closeMenu();
                });
            }

            element.on('click', (e) => {
                e.stopPropagation();
            });

            $scope.$on('$stateChangeSuccess', () => {
                controller.closeMenu();
            });

            $document.on('click', closeMenu);

            $scope.$on('$destroy', () => {
                $document.off('click', closeMenu);
            });
        }
    };
}

export default angular.module('waes-list-menuSelect', [
    'templates'
])
    .controller('menuSelectCtrl', MenuSelectCtrl)
    .directive('menuSelect', menuSelect);
