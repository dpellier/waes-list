
class AuthService {
    // @ngInject
    constructor($window) {
        this.$window = $window;
    }

    logout() {
        localStorage.removeItem('oauth2-waes-list');
        this.$window.location.reload();
    }
}

export default AuthService;
