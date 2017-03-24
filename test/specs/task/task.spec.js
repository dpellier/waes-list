
describe('Task', () => {
    beforeEach(angular.mock.module('waes-list-task'));

    const mockIndex = 1;
    const mockTaskListId = '42';

    let $q;
    let $scope;
    let $compile;
    let element;
    let controller;
    let taskService;
    let $scopeSpy;
    let mockTask;

    beforeEach(inject((_$q_, _$rootScope_, _$compile_, _taskService_) => {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        mockTask = {id: 'id'};

        taskService = _taskService_;
        spyOn(taskService, 'update').and.returnValue($q.resolve());

        $scopeSpy = jasmine.createSpyObj('$scope', ['$broadcast', '$emit']);

        $scope.model = mockTask;
        $scope.index = mockIndex;

        generateElement();
        controller.$scope = $scopeSpy;
    }));

    function generateElement() {
        element = angular.element(`<task model="model" index="index" task-list-id="${mockTaskListId}"></task>`);

        $compile(element)($scope);
        $scope.$digest();

        controller = element.controller('task');
    }

    describe('controller', () => {
        it('should correctly be initialized', () => {
            expect(controller._color).toBeDefined();
            expect(controller.menuActions).toBeDefined();
            expect(controller.menuActions.length).toBeGreaterThan(0);
        });

        describe('onUpdate', () => {
            it('should do nothing if the task is the emitter', () => {
                controller.onUpdate({}, mockTask);

                expect(taskService.update).not.toHaveBeenCalled();
            });

            it('should update status and update task', () => {
                const mockEmitter = {id: 'emitter', status: 'status'};

                controller.onUpdate({}, mockEmitter);

                expect(mockTask.status).toBe(mockEmitter.status);
                expect(taskService.update).toHaveBeenCalledWith(mockTaskListId, mockTask);
            });
        });

        describe('changeStatus', () => {
            it('should update task and broadcast an update event', () => {
                controller.changeStatus();

                expect(taskService.update).toHaveBeenCalledWith(mockTaskListId, mockTask);
                expect($scopeSpy.$broadcast).toHaveBeenCalledWith('task:update:status', mockTask);
            });
        });

        describe('editName', () => {
            it('should update task and set edition mode to false', (done) => {
                controller.editName().then(() => {
                    expect(taskService.update).toHaveBeenCalledWith(mockTaskListId, mockTask);
                    expect(controller._edition).toBe(false);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('update', () => {
            it('should call the update api', (done) => {
                controller.update().then(() => {
                    expect(taskService.update).toHaveBeenCalledWith(mockTaskListId, mockTask);
                }).then(done, done.fail);

                $scope.$digest();
            });
        });

        describe('emitMoveUp', () => {
            it('should emit a move up event', () => {
                controller.emitMoveUp();

                expect($scopeSpy.$emit).toHaveBeenCalledWith('task:move:up', {id: mockTask.id, index: mockIndex});
            });
        });

        describe('emitMoveDown', () => {
            it('should emit a move down event', () => {
                controller.emitMoveDown();

                expect($scopeSpy.$emit).toHaveBeenCalledWith('task:move:down', {id: mockTask.id, index: mockIndex});
            });
        });

        describe('emitIndentMore', () => {
            it('should emit an indent more event', () => {
                controller.emitIndentMore();

                expect($scopeSpy.$emit).toHaveBeenCalledWith('task:indent:more', {task: mockTask, index: mockIndex});
            });
        });

        describe('emitIndentLess', () => {
            it('should emit an indent less event', () => {
                controller.emitIndentLess();

                expect($scopeSpy.$emit).toHaveBeenCalledWith('task:indent:less', {task: mockTask, index: mockIndex});
            });
        });

        describe('emitRemove', () => {
            it('should emit a remove event', () => {
                controller.emitRemove();

                expect($scopeSpy.$emit).toHaveBeenCalledWith('task:remove', {id: mockTask.id, index: mockIndex});
            });
        });
    });
});
