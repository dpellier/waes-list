
class HomeCtrl {
    // @ngInject
    constructor($q, taskLists, taskListService) {
        this.$q = $q;
        this.taskLists = taskLists;
        this.taskListService = taskListService;
    }

    initNewList() {
        this.newList = {};
    }

    resetNewList() {
        this.newList = null;
    }

    saveNewList() {
        if (!this.newList.title) {
            return this.$q.when();
        }

        return this.taskListService.create(this.newList).then((created) => {
            this.taskLists.push(created);
            this.resetNewList();
        });
    }

    remove({taskListId, index}) {
        return this.taskListService.delete(taskListId).then(() => {
            this.taskLists.splice(index, 1);
        });
    }
}

export default angular.module('waes-list-home', [
    'waes-list-common'
])
    .controller('homeCtrl', HomeCtrl);
