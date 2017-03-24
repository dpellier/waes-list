
class TaskCtrl {
    // @ngInject
    constructor($scope, taskService, TASK_STATUS) {
        this.$scope = $scope;
        this.taskService = taskService;
        this.status = TASK_STATUS;

        this._color = '#'+ Math.floor(Math.random() * 16777215).toString(16);      //inspired by https://www.paulirish.com/2009/random-hex-color-code-snippets/

        this.menuActions = [
            {title: 'Indent less', icon: 'indent-decrease', action: this.emitIndentLess.bind(this)},
            {title: 'Delete Task', icon: 'trash', action: this.emitRemove.bind(this)}
        ];

        // We remove those functionality while not available
        if (!this.model.parent) {
            this.menuActions.unshift(
                {title: 'Move up', icon: 'arrow-up', action: this.emitMoveUp.bind(this)},
                {title: 'Move down', icon: 'arrow-down', action: this.emitMoveDown.bind(this)},
                {title: 'Indent more', icon: 'indent-increase', action: this.emitIndentMore.bind(this)}
            );
        }

        this.$scope.$on('task:update:status', this.onUpdate.bind(this));
    }

    changeStatus() {
        this.update();

        // We broadcast the change so that all children will be updated too
        this.$scope.$broadcast('task:update:status', this.model);
    }

    editName() {
        return this.update().then(() => {
            this._edition = false;
        });
    }

    onUpdate(event, emitter) {
        // Broadcast trigger also the emitter, so we have to check to avoid infinite event loop
        if (emitter.id === this.model.id) {
            return;
        }

        this.model.status = emitter.status;
        this.update();
    }

    update() {
        return this.taskService.update(this.taskListId, this.model);
    }

    emitMoveUp() {
        this.$scope.$emit('task:move:up', {id: this.model.id, index: this.index});
    }

    emitMoveDown() {
        this.$scope.$emit('task:move:down', {id: this.model.id, index: this.index});
    }

    emitIndentMore() {
        this.$scope.$emit('task:indent:more', {task: this.model, index: this.index});
    }

    emitIndentLess() {
        this.$scope.$emit('task:indent:less', {task: this.model, index: this.index});
    }

    emitRemove() {
        this.$scope.$emit('task:remove', {id: this.model.id, index: this.index});
    }
}

function task() {
    return {
        restrict: 'E',
        templateUrl: 'app/task/task.html',
        controller: 'taskCtrl',
        controllerAs: 'controller',
        bindToController: true,
        scope: {
            model: '=',
            index: '=',
            taskListId: '@'
        }
    };
}

export default angular.module('waes-list-task', [
    'templates',
    'waes-list-common'
])
    .directive('task', task)
    .controller('taskCtrl', TaskCtrl);
