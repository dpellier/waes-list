
describe('Header', () => {
    beforeEach(angular.mock.module('waes-list-header'));

    let $scope;
    let $compile;
    let element;
    let controller;
    let authService;

    beforeEach(inject((_$rootScope_, _$compile_, _authService_) => {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        authService = _authService_;
        spyOn(authService, 'logout');

        generateElement();
    }));

    function generateElement() {
        element = angular.element('<header></header>');

        $compile(element)($scope);
        $scope.$digest();

        controller = element.controller('header');
    }

    describe('controller', () => {
        it('should correctly be initialized', () => {
            expect(controller.menuActions).toBeDefined();
            expect(controller.menuActions.length).toBeGreaterThan(0);
        });

        describe('logout', () => {
            it('should call the auth service', () => {
                controller.logout();

                expect(authService.logout).toHaveBeenCalled();
            });
        });
    });
});
