
describe('Menu Select', () => {
    beforeEach(angular.mock.module('waes-list-common'));

    let $scope;
    let $compile;
    let element;
    let controller;

    beforeEach(inject((_$rootScope_, _$compile_) => {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        $scope.items = ['item1', 'item2'];
        generateElement();
    }));

    function generateElement() {
        element = angular.element('<menu-select items="items"></menu-select>');

        $compile(element)($scope);
        $scope.$digest();

        controller = element.controller('menuSelect');
    }

    describe('controller', () => {
        it('should correctly be initialized', () => {
            expect(controller._menuOpen).toBe(false);
        });

        describe('closeMenu', () => {
            it('should set menu to close', () => {
                controller._menuOpen = true;

                controller.closeMenu();

                expect(controller._menuOpen).toBe(false);
            });
        });

        describe('clickAction', () => {
            it('should call the function and close the menu', () => {
                controller._menuOpen = true;
                const action = jasmine.createSpy('action');

                controller.clickAction(action);

                expect(controller._menuOpen).toBe(false);
                expect(action).toHaveBeenCalled();
            });
        });
    });
});
