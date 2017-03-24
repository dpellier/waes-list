
describe('Home Controller', () => {
    beforeEach(angular.mock.module('waes-list-home'));

    let $rootScope;
    let $q;
    let controller;
    let taskListService;
    let mockTaskLists;

    beforeEach(inject((_$rootScope_, _$q_, _$controller_) => {
        $rootScope = _$rootScope_;
        $q = _$q_;

        mockTaskLists = ['1', '2'];

        taskListService = jasmine.createSpyObj('taskListService', ['create', 'delete']);

        controller = _$controller_('homeCtrl', {
            taskLists: mockTaskLists,
            taskListService: taskListService
        });
    }));

    describe('initNewList', () => {
        it('should initialize new list', () => {
            expect(controller.newList).not.toBeDefined();

            controller.initNewList();

            expect(controller.newList).toEqual({});
        });
    });

    describe('resetNewList', () => {
        it('should reset new list', () => {
            controller.newList = {};

            controller.resetNewList();

            expect(controller.newList).toBe(null);
        });
    });

    describe('saveNewList', () => {
        it('should do nothing if new list has no title', (done) => {
            controller.newList = {};

            controller.saveNewList().then(() => {
                expect(taskListService.create).not.toHaveBeenCalled();
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should save the list and reset new list', (done) => {
            const mockList = {title: 'title'};
            controller.newList = mockList;

            taskListService.create.and.returnValue($q.resolve(mockList));

            controller.saveNewList().then(() => {
                expect(taskListService.create).toHaveBeenCalledWith(mockList);
                expect(controller.taskLists).toEqual(['1', '2', mockList]);
                expect(controller.newList).toBe(null);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('remove', () => {
        it('should delete the list', (done) => {
            const mockTaskListId = '42';

            taskListService.delete.and.returnValue($q.resolve());

            controller.remove({taskListId: mockTaskListId, index: 0}).then(() => {
                expect(taskListService.delete).toHaveBeenCalledWith(mockTaskListId);
                expect(controller.taskLists).toEqual(['2']);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });
});
