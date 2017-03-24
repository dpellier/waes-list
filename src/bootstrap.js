/**
 * Google OAuth2 login
 * inspired by https://developers.google.com/identity/protocols/OAuth2UserAgent#example
 */

import app from './app.js';

const YOUR_CLIENT_ID = '608120061318-d7onh74m7766iv0khgj8mak0qhs2gtgd.apps.googleusercontent.com';
const YOUR_REDIRECT_URI = 'http://localhost:8080';

// Create form to request access token from Google's OAuth 2.0 server.
function oauth2SignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {
        client_id: YOUR_CLIENT_ID,
        redirect_uri: YOUR_REDIRECT_URI,
        scope: 'https://www.googleapis.com/auth/tasks',
        state: 'start_app',
        include_granted_scopes: 'true',
        response_type: 'token'
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

// Verify the access token received on the query string.
function exchangeOAuth2Token(params) {
    const oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

    if (params['access_token']) {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', oauth2Endpoint + '?access_token=' + params['access_token']);
        xhr.onreadystatechange = function() {
            const response = xhr.response ? JSON.parse(xhr.response) : {};

            // When request is finished, verify that the 'aud' property in the
            // response matches YOUR_CLIENT_ID.
            if (xhr.readyState == 4 && xhr.status == 200 &&
                response['aud'] && response['aud'] == YOUR_CLIENT_ID) {

                // Store granted scopes in local storage to facilitate
                // incremental authorization.
                params['scope'] = response['scope'];

                localStorage.setItem('oauth2-waes-list', JSON.stringify(params));

                if (params['state'] == 'start_app') {
                    console.log('token ready');
                    startApp();
                }
            } else if (xhr.readyState == 4) {
                console.log('There was an error processing the token, another response was returned, or the token was invalid.')
            }
        };
        xhr.send(null);
    }
}

function startApp() {
    const params = JSON.parse(localStorage.getItem('oauth2-waes-list'));

    if (params && params['access_token']) {
        const element = angular.element(document);

        // Ensure that the app has not yet be bootstrapped
        if (!element.injector()) {
            angular.bootstrap(document, [app.name]);
        }
    } else {
        oauth2SignIn();
    }
}

angular.element(document).ready(() => {
    startApp();

    const queryString = location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    const params = {};
    const regex = /([^&=]+)=([^&]*)/g;
    let m;

    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        // Try to exchange the param values for an access token.
        exchangeOAuth2Token(params);
    }
});
