
describe('Task List', () => {
    beforeEach(angular.mock.module('waes-list-taskList'));

    let $q;
    let $scope;
    let $compile;
    let element;
    let controller;
    let taskService;
    let eventSpy;
    let mockTaskList;
    let mockTasks;

    beforeEach(angular.mock.module(($provide) => {
        $provide.decorator('$timeout', () => {
            return jasmine.createSpy('$timeout').and.callFake((cb) => {
                cb();
            });
        });
    }));

    beforeEach(inject((_$rootScope_, _$q_, _$compile_, _taskService_) => {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        mockTasks = ['1', '2'];
        mockTaskList = {id: 'id'};

        eventSpy = jasmine.createSpyObj('event', ['stopPropagation']);

        taskService = _taskService_;
        spyOn(taskService, 'list').and.returnValue($q.resolve(mockTasks));
        spyOn(taskService, 'create').and.returnValue($q.resolve());
        spyOn(taskService, 'delete').and.returnValue($q.resolve());
        spyOn(taskService, 'move').and.returnValue($q.resolve());
        spyOn(taskService, 'indent').and.returnValue($q.resolve());

        $scope.model = mockTaskList;

        generateElement();
    }));

    function generateElement() {
        element = angular.element('<task-list model="model"></task-list>');

        $compile(element)($scope);
        $scope.$digest();

        controller = element.controller('taskList');
    }

    describe('controller', () => {
        it('should correctly be initialized', () => {
            expect(controller.tasks).toBe(null);
            expect(controller._loading).toBe(false);
            expect(controller._open).toBe(false);
            expect(controller.menuActions).toBeDefined();
            expect(controller.menuActions.length).toBeGreaterThan(0);
        });

        describe('toggle', () => {
            it('should set open to false', (done) => {
                controller._open = true;

                controller.toggle().then(() => {
                    expect(controller._open).toBe(false);
                }).then(done, done.fail);

                $scope.$digest();
            });

            it('should set loading and open without fetching data', (done) => {
                controller._open = false;
                controller.tasks = [];

                controller.toggle().then(() => {
                    expect(controller._open).toBe(true);
                    expect(controller._loading).toBe(false);
                }).then(done, done.fail);

                $scope.$digest();
            });

            it('should toggle after loading data', (done) => {
                controller._open = false;

                controller.toggle().then(() => {
                    expect(taskService.list).toHaveBeenCalled();
                    expect(controller._open).toBe(true);
                    expect(controller._loading).toBe(false);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('loadTasks', () => {
            it('should fetch tasks', (done) => {
                controller.loadTasks().then(() => {
                    expect(controller.tasks).toEqual(mockTasks);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('initNewTask', () => {
            it('should initialize new task', () => {
                expect(controller.newTask).not.toBeDefined();

                controller.initNewTask();

                expect(controller.newTask).toEqual({});
            });
        });

        describe('resetNewTask', () => {
            it('should reset new task', () => {
                controller.newTask = {};

                controller.resetNewTask();

                expect(controller.newTask).toBe(null);
            });
        });

        describe('saveNewTask', () => {
            it('should do nothing if new task has no title', (done) => {
                controller.newTask = {};

                controller.saveNewTask().then(() => {
                    expect(taskService.create).not.toHaveBeenCalled();
                }).then(done, done.fail);

                $scope.$digest();
            });

            it('should save the task and reset new task', (done) => {
                const mockTask = {title: 'title'};
                controller.newTask = mockTask;
                controller.tasks = mockTasks;

                taskService.create.and.returnValue($q.resolve(mockTask));

                controller.saveNewTask().then(() => {
                    expect(taskService.create).toHaveBeenCalledWith(mockTaskList.id, mockTask);
                    expect(controller.tasks).toEqual(['1', '2', mockTask]);
                    expect(controller.newTask).toBe(null);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('onRemoveTask', () => {
            it('should delete task from the list', (done) => {
                const mockTaskId = '33';
                controller.tasks = mockTasks;

                controller.onRemoveTask(eventSpy, {id: mockTaskId, index: 0}).then(() => {
                    expect(eventSpy.stopPropagation).toHaveBeenCalled();
                    expect(taskService.delete).toHaveBeenCalledWith(mockTaskList.id, mockTaskId);
                    expect(controller.tasks).toEqual(['2']);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('onMoveTaskUp', () => {
            it('should do nothing if it is the top task', (done) => {
                const mockTaskId = '33';
                controller.tasks = [
                    {id: '1'}, {id: '2'}, {id: '3'}
                ];

                controller.onMoveTaskUp(eventSpy, {id: mockTaskId, index: 0}).then(() => {
                    expect(eventSpy.stopPropagation).toHaveBeenCalled();
                    expect(taskService.move).not.toHaveBeenCalled();
                    expect(controller.tasks).toEqual([
                        {id: '1'}, {id: '2'}, {id: '3'}
                    ]);
                }).then(done, done.fail);

                $scope.$digest();
            });

            it('should move second task on top of the list', (done) => {
                const mockTaskId = '33';
                controller.tasks = [
                    {id: '1'}, {id: '2'}, {id: '3'}
                ];

                controller.onMoveTaskUp(eventSpy, {id: mockTaskId, index: 1}).then(() => {
                    expect(eventSpy.stopPropagation).toHaveBeenCalled();
                    expect(taskService.move).toHaveBeenCalledWith(mockTaskList.id, mockTaskId, null);
                    expect(controller.tasks).toEqual([
                        {id: '2'}, {id: '1'}, {id: '3'}
                    ]);
                }).then(done, done.fail);

                $scope.$digest();
            });

            it('should move one task up on the list', (done) => {
                const mockTaskId = '33';
                controller.tasks = [
                    {id: '1'}, {id: '2'}, {id: '3'}
                ];

                controller.onMoveTaskUp(eventSpy, {id: mockTaskId, index: 2}).then(() => {
                    expect(eventSpy.stopPropagation).toHaveBeenCalled();
                    expect(taskService.move).toHaveBeenCalledWith(mockTaskList.id, mockTaskId, '1');
                    expect(controller.tasks).toEqual([
                        {id: '1'}, {id: '3'}, {id: '2'}
                    ]);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('onMoveTaskDown', () => {
            it('should do nothing if it is the last task', (done) => {
                const mockTaskId = '33';
                controller.tasks = [
                    {id: '1'}, {id: '2'}, {id: '3'}
                ];

                controller.onMoveTaskDown(eventSpy, {id: mockTaskId, index: 2}).then(() => {
                    expect(eventSpy.stopPropagation).toHaveBeenCalled();
                    expect(taskService.move).not.toHaveBeenCalled();
                    expect(controller.tasks).toEqual([
                        {id: '1'}, {id: '2'}, {id: '3'}
                    ]);
                }).then(done, done.fail);

                $scope.$digest();
            });

            it('should move one task down on the list', (done) => {
                const mockTaskId = '33';
                controller.tasks = [
                    {id: '1'}, {id: '2'}, {id: '3'}
                ];

                controller.onMoveTaskDown(eventSpy, {id: mockTaskId, index: 1}).then(() => {
                    expect(eventSpy.stopPropagation).toHaveBeenCalled();
                    expect(taskService.move).toHaveBeenCalledWith(mockTaskList.id, mockTaskId, '3');
                    expect(controller.tasks).toEqual([
                        {id: '1'}, {id: '3'}, {id: '2'}
                    ]);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('moveTask', () => {
            it('should call the move api', (done) => {
                const mockTaskId = '33';
                const mockPrevious = '1';

                controller.moveTask(mockTaskId, mockPrevious).then(() => {
                    expect(taskService.move).toHaveBeenCalledWith(mockTaskList.id, mockTaskId, mockPrevious);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('indentTask', () => {
            it('should call the indent api', (done) => {
                const mockTaskId = '33';
                const mockParent = '1';

                controller.indentTask(mockTaskId, mockParent).then(() => {
                    expect(taskService.indent).toHaveBeenCalledWith(mockTaskList.id, mockTaskId, mockParent);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });
    });
});
