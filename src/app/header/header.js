
class HeaderCtrl {
    // @ngInject
    constructor(authService) {
        this.authService = authService;

        this.menuActions = [
            {title: 'Logout', action: this.logout.bind(this)}
        ];
    }

    logout() {
        this.authService.logout();
    }
}

function header() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/header/header.html',
        controller: 'headerCtrl',
        controllerAs: 'controller'
    };
}

export default angular.module('waes-list-header', [
    'templates',
    'waes-list-common'
])
    .directive('header', header)
    .controller('headerCtrl', HeaderCtrl);
