
import menuSelect from './directives/menuSelect/menuSelect.js';

import TASK_STATUS from './constants/TASK_STATUS.js';
import ApiService from './services/Api.js';
import AuthService from './services/Auth.js';
import TaskService from './services/Task.js';
import TaskListService from './services/TaskList.js';

export default angular.module('waes-list-common', [
    menuSelect.name
])
    .constant('TASK_STATUS', TASK_STATUS)
    .service('apiService', ApiService)
    .service('authService', AuthService)
    .service('taskService', TaskService)
    .service('taskListService', TaskListService);
