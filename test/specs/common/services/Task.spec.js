
describe('Task Service', () => {
    beforeEach(angular.mock.module('waes-list-common'));

    const mockTaskListId = '42';

    let $rootScope;
    let $q;
    let apiService;
    let service;
    let getSpy;
    let mockTask;

    beforeEach(inject((_$rootScope_, _$q_, _apiService_, _taskService_) => {
        $rootScope = _$rootScope_;
        $q = _$q_;
        apiService = _apiService_;
        service = _taskService_;

        mockTask = {
            id: '33',
            title: 'task',
            completed: 'Thu Jan 01 1970 01:00:00 GMT+0100 (CET)'
        };

        getSpy = spyOn(apiService, 'get').and.returnValue($q.resolve({}));
        spyOn(apiService, 'post').and.returnValue($q.resolve());
        spyOn(apiService, 'put').and.returnValue($q.resolve());
        spyOn(apiService, 'delete').and.returnValue($q.resolve());
    }));

    describe('list', () => {
        it('should return empty array if no result', (done) => {
            service.list(mockTaskListId).then((lists) => {
                expect(apiService.get).toHaveBeenCalled();
                expect(apiService.get.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks$`));
                expect(lists).toEqual([]);
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should return the parent list with their children set', (done) => {
            getSpy.and.returnValue($q.resolve({
                items: [
                    {id: 'root1'},
                    {id: 'root2'},
                    {id: 'child2.1', parent: 'root2'},
                    {id: 'child2.2', parent: 'root2'}
                ]
            }));

            service.list(mockTaskListId).then((lists) => {
                expect(apiService.get).toHaveBeenCalled();
                expect(apiService.get.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks$`));
                expect(lists).toEqual([
                    {id: 'root1'},
                    {id: 'root2', children: [
                        {id: 'child2.1', parent: 'root2'},
                        {id: 'child2.2', parent: 'root2'}
                    ]}
                ]);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('create', () => {
        it('should call the create task api', (done) => {
            service.create(mockTaskListId, mockTask).then(() => {
                expect(apiService.post).toHaveBeenCalled();
                expect(apiService.post.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks$`));
                expect(apiService.post.calls.mostRecent().args[1]).toBe(mockTask);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('update', () => {
        it('should call the update task api', (done) => {
            service.update(mockTaskListId, mockTask).then(() => {
                expect(apiService.put).toHaveBeenCalled();
                expect(apiService.put.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks/${mockTask.id}$`));
                expect(apiService.put.calls.mostRecent().args[1]).toBe(mockTask);
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should remove completed property if status is not completed', (done) => {
            mockTask.status = service.status.todo;

            service.update(mockTaskListId, mockTask).then(() => {
                expect(apiService.put.calls.mostRecent().args[1]).toEqual({
                    id: '33',
                    title: 'task',
                    status: service.status.todo
                });
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('delete', () => {
        it('should call the delete task api', (done) => {
            service.delete(mockTaskListId, mockTask.id).then(() => {
                expect(apiService.delete).toHaveBeenCalled();
                expect(apiService.delete.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks/${mockTask.id}$`));
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('move', () => {
        const previous = '111';

        it('should call the move task api', (done) => {
            service.move(mockTaskListId, mockTask.id, previous).then(() => {
                expect(apiService.post).toHaveBeenCalled();
                expect(apiService.post.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks/${mockTask.id}/move\\?previous=${previous}$`));
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should call the move task api without argument', (done) => {
            service.move(mockTaskListId, mockTask.id, null).then(() => {
                expect(apiService.post).toHaveBeenCalled();
                expect(apiService.post.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks/${mockTask.id}/move$`));
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('indent', () => {
        const parent = '111';

        it('should call the indent task api', (done) => {
            service.indent(mockTaskListId, mockTask.id, parent).then(() => {
                expect(apiService.post).toHaveBeenCalled();
                expect(apiService.post.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks/${mockTask.id}/move\\?parent=${parent}$`));
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should call the move task api without argument', (done) => {
            service.indent(mockTaskListId, mockTask.id, null).then(() => {
                expect(apiService.post).toHaveBeenCalled();
                expect(apiService.post.calls.mostRecent().args[0]).toMatch(new RegExp(`www.googleapis.com/tasks/v1/lists/${mockTaskListId}/tasks/${mockTask.id}/move$`));
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });
});
