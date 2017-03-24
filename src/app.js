
import commonModule from './app/common/common.js';
import headerModule from './app/header/header.js';
import homeModule from './app/home/home.js';
import taskListModule from './app/taskList/taskList.js';
import taskModule from './app/task/task.js';

export default angular.module('waes-list', [
    'templates',
    'environmentConfig',
    'ui.router',
    commonModule.name,
    headerModule.name,
    homeModule.name,
    taskListModule.name,
    taskModule.name
])

    .config(($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) => {
        $locationProvider.html5Mode(true);
        $urlMatcherFactoryProvider.strictMode(false);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'homeCtrl',
                controllerAs: 'controller',
                resolve: {
                    taskLists: (taskListService) => {
                        return taskListService.list();
                    }
                }
            });
    })

    .factory('$exceptionHandler', (authService) => {
        return (exception) => {
            // When Google auth expire
            if (exception.status === 401 && exception.data.error.message === 'Invalid Credentials') {
                authService.logout();
            }
        };
    })

    .run(($rootScope, $exceptionHandler) => {
        $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
            console.error(`Cannot transition from ${fromState.name} to ${toState.name}`);   // eslint-disable-line no-console
            console.error(error);                                                           // eslint-disable-line no-console
            $exceptionHandler(error);
        });
    });
