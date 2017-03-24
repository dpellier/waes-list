
describe('Auth Service', () => {
    beforeEach(angular.mock.module('waes-list-common'));

    let $window;
    let service;

    beforeEach(inject((_$window_, _authService_) => {
        $window = _$window_;
        service = _authService_;

        spyOn(localStorage, 'removeItem');
        spyOn($window.location, 'reload');
    }));

    describe('logout', () => {
        it('should clean local storage and reload the page', () => {
            service.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('oauth2-waes-list');
            expect($window.location.reload).toHaveBeenCalled();
        });
    });
});
