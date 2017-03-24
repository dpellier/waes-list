/**
 * Manage the $http authenticated requests
 */

class Api {
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    get(url) {
        return this.$http.get(Api.tokenize(url)).then((res) => {
            return res.data;
        });
    }

    post(url, data) {
        return this.$http.post(Api.tokenize(url), data).then((res) => {
            return res.data;
        });
    }

    put(url, data) {
        return this.$http.put(Api.tokenize(url), data).then((res) => {
            return res.data;
        });
    }

    delete(url) {
        return this.$http.delete(Api.tokenize(url)).then((res) => {
            return res.data;
        });
    }

    static tokenize(url) {
        const arg = url.indexOf('?') > -1 ? '&' : '?';
        return `${url}${arg}access_token=${Api.getToken()}`;
    }

    static getToken() {
        const token = JSON.parse(localStorage.getItem('oauth2-waes-list'));
        return token.access_token;
    }
}

export default Api;
