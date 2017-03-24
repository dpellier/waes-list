
class Task {
    // @ngInject
    constructor(apiService, TASK_STATUS) {
        this.apiService = apiService;
        this.status = TASK_STATUS;
    }

    list(taskListId) {
        return this.apiService.get(apiUrl(taskListId)).then((res) => {
            if (!res.items) {
                return [];
            }

            // The API return a flat list
            // We will move all task that have a parent directly in the parent task as a children property
            const allTasks = [].concat(res.items);

            res.items.forEach((item) => {
                if (item.parent) {
                    const parent = allTasks.find((task) => {
                        return task.id === item.parent;
                    });

                    if (parent.children) {
                        parent.children.push(item);
                    } else {
                        parent.children = [item];
                    }
                }
            });

            return allTasks.filter((task) => {
                return !task.parent;
            });
        });
    }

    create(taskListId, task) {
        return this.apiService.post(apiUrl(taskListId), task);
    }

    update(taskListId, task) {
        if (task.status === this.status.todo) {
            // Google API will throw an error if we send a completed date on an uncompleted task
            delete task.completed;
        }

        return this.apiService.put(`${apiUrl(taskListId)}/${task.id}`, task);
    }

    delete(taskListId, taskId) {
        return this.apiService.delete(`${apiUrl(taskListId)}/${taskId}`);
    }

    move(taskListId, taskId, previous) {
        const arg = previous ? `?previous=${previous}` : '';
        return this.apiService.post(`${apiUrl(taskListId)}/${taskId}/move${arg}`);
    }

    indent(taskListId, taskId, parent) {
        const arg = parent ? `?parent=${parent}` : '';
        return this.apiService.post(`${apiUrl(taskListId)}/${taskId}/move${arg}`);
    }
}

function apiUrl(taskListId) {
    return `https://www.googleapis.com/tasks/v1/lists/${taskListId}/tasks`;
}

export default Task;
