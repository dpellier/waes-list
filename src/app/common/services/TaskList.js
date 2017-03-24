
class TaskList {
    // @ngInject
    constructor(apiService) {
        this.apiService = apiService;
        this.apiUrl = 'https://www.googleapis.com/tasks/v1/users/@me/lists';
    }

    list() {
        return this.apiService.get(this.apiUrl).then((res) => {
            return res.items;
        });
    }

    create(taskList) {
        return this.apiService.post(this.apiUrl, taskList);
    }

    delete(taskListId) {
        return this.apiService.delete(`${this.apiUrl}/${taskListId}`);
    }
}

export default TaskList;
