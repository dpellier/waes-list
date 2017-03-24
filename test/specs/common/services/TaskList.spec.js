
describe('TaskList Service', () => {
    beforeEach(angular.mock.module('waes-list-common'));

    const mockRes = {
        items: ['1', '2']
    };
    const mockTask = {
        id: '42',
        title: 'task'
    };

    let $rootScope;
    let $q;
    let apiService;
    let service;

    beforeEach(inject((_$rootScope_, _$q_, _apiService_, _taskListService_) => {
        $rootScope = _$rootScope_;
        $q = _$q_;
        apiService = _apiService_;
        service = _taskListService_;

        spyOn(apiService, 'get').and.returnValue($q.resolve(mockRes));
        spyOn(apiService, 'post').and.returnValue($q.resolve());
        spyOn(apiService, 'delete').and.returnValue($q.resolve());
    }));

    describe('list', () => {
        it('should return the list of task list', (done) => {
            service.list().then((lists) => {
                expect(apiService.get).toHaveBeenCalledWith(service.apiUrl);
                expect(lists).toEqual(mockRes.items);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('create', () => {
        it('should call the create task api', (done) => {
            service.create(mockTask).then(() => {
                expect(apiService.post).toHaveBeenCalledWith(service.apiUrl, mockTask);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('delete', () => {
        it('should call the delete task api', (done) => {
            service.delete(mockTask.id).then(() => {
                expect(apiService.delete).toHaveBeenCalled();
                expect(apiService.delete.calls.mostRecent().args[0]).toMatch(new RegExp(`${service.apiUrl}/${mockTask.id}`));
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });
});
