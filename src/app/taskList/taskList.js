
const MIN_ANIMATION_DELAY = 300;

class TaskListCtrl {
    // @ngInject
    constructor($scope, $q, $timeout, taskService) {
        this.$q = $q;
        this.$timeout = $timeout;
        this.taskService = taskService;

        this.tasks = null;
        this._loading = false;
        this._open = false;

        this.menuActions = [
            {title: 'Delete list', icon: 'trash', action: this.onRemove.bind(this)}
        ];

        $scope.$on('task:move:up', this.onMoveTaskUp.bind(this));
        $scope.$on('task:move:down', this.onMoveTaskDown.bind(this));
        $scope.$on('task:indent:more', this.onIndentTaskMore.bind(this));
        $scope.$on('task:indent:less', this.onIndentTaskLess.bind(this));
        $scope.$on('task:remove', this.onRemoveTask.bind(this));
    }

    toggle() {
        if (this._open) {
            this._open = false;
            return this.$q.when();
        }

        let promise = angular.noop;
        this._loading = true;

        // If it's the first time we open the list, we need to fetch the data
        if (!this.tasks) {
            promise = this.loadTasks();
        }

        return this.$q.when(promise).then(() => {
            // Add a little delay to prevent flickering
            this.$timeout(() => {
                this._open = true;
                this._loading = false;
            }, MIN_ANIMATION_DELAY);
        });
    }

    /**
     *
     * New task methods
     *
     */

    initNewTask() {
        this.newTask = {};
    }

    resetNewTask() {
        this.newTask = null;
    }

    saveNewTask() {
        if (!this.newTask.title) {
            return this.$q.when();
        }

        return this.taskService.create(this.model.id, this.newTask).then((created) => {
            this.tasks.push(created);
            this.resetNewTask();
        });
    }

    /**
     *
     * Event handlers
     *
     */

    onRemoveTask(event, {id, index}) {
        event.stopPropagation();

        return this.taskService.delete(this.model.id, id).then(() => {
            this.tasks.splice(index, 1);
        });
    }

    onMoveTaskUp(event, {id, index}) {
        event.stopPropagation();

        if (index === 0) {
            return this.$q.when();
        }

        let previous = null;

        if (index > 1) {
            // Minus 2 cause we look for the new previous after moving one index up
            previous = this.tasks[index - 2].id;
        }

        return this.moveTask(id, previous).then(() => {
            const buff = this.tasks[index - 1];
            this.tasks[index - 1] = this.tasks[index];
            this.tasks[index] = buff;
        });
    }

    onMoveTaskDown(event, {id, index}) {
        event.stopPropagation();

        if (index === this.tasks.length - 1) {
            return this.$q.when();
        }

        const previous = this.tasks[index + 1].id;

        return this.moveTask(id, previous).then(() => {
            const buff = this.tasks[index + 1];
            this.tasks[index + 1] = this.tasks[index];
            this.tasks[index] = buff;
        });
    }

    onIndentTaskMore(event, {task, index}) {
        event.stopPropagation();

        if (index === 0) {
            return this.$q.when();
        }

        const parent = this.tasks[index - 1];

        return this.indentTask(task.id, parent.id).then(() => {
            if (parent.children) {
                parent.children.push(task);
            } else {
                parent.children = [task];
            }

            this.tasks.splice(index, 1);
        });
    }

    onIndentTaskLess(event, {task, index}) {
        event.stopPropagation();

        if (!task.parent) {
            return this.$q.when();
        }

        let parent;
        let parentIdx;

        for (let i = 0; i < this.tasks.length; i++) {
            if (task.parent === this.tasks[i].id) {
                parent = this.tasks[i];
                parentIdx = i;
                break;
            }
        }

        return this.indentTask(task.id).then(() => {
            // The task is on root so no parent
            delete task.parent;

            // Update the list
            this.tasks.splice(parentIdx + 1, 0, task);

            // Update the parent child list
            parent.children.splice(index, 1);
        });
    }

    /**
     *
     * API communication
     *
     */

    loadTasks() {
        return this.taskService.list(this.model.id).then((tasks) => {
            this.tasks = tasks;
        });
    }

    moveTask(taskId, previous) {
        return this.taskService.move(this.model.id, taskId, previous);
    }

    indentTask(taskId, parent) {
        return this.taskService.indent(this.model.id, taskId, parent);
    }
}

function taskList() {
    return {
        restrict: 'E',
        templateUrl: 'app/taskList/taskList.html',
        controller: 'taskListCtrl',
        controllerAs: 'controller',
        bindToController: true,
        scope: {
            model: '=',
            onRemove: '&'   // we could also use event instead
        }
    };
}

export default angular.module('waes-list-taskList', [
    'templates',
    'waes-list-common'
])
    .directive('taskList', taskList)
    .controller('taskListCtrl', TaskListCtrl);
