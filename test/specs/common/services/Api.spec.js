
describe('Api Service', () => {
    beforeEach(angular.mock.module('waes-list-common'));

    const mockToken = 'token';
    const mockApiUrl = 'dummyUrl';
    const mockPayload = { dummy: 'value' };
    const success = 200;

    let $httpBackend;
    let apiService;

    beforeEach(inject((_$httpBackend_, _apiService_) => {
        $httpBackend = _$httpBackend_;
        apiService = _apiService_;

        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({
            access_token: mockToken
        }));
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get', () => {
        it('should make a GET request', () => {
            $httpBackend
                .expectGET(`${mockApiUrl}?access_token=${mockToken}`)
                .respond(success);

            apiService.get(mockApiUrl);
            expect($httpBackend.flush).not.toThrow();
        });
    });

    describe('post', () => {
        it('should make a POST request', () => {
            $httpBackend
                .expectPOST(`${mockApiUrl}?access_token=${mockToken}`, mockPayload)
                .respond(success);

            apiService.post(mockApiUrl, mockPayload);
            expect($httpBackend.flush).not.toThrow();
        });
    });

    describe('put', () => {
        it('should make a PUT request', () => {
            $httpBackend
                .expectPUT(`${mockApiUrl}?access_token=${mockToken}`, mockPayload)
                .respond(success);

            apiService.put(mockApiUrl, mockPayload);
            expect($httpBackend.flush).not.toThrow();
        });
    });

    describe('delete', () => {
        it('should make a DELETE request', () => {
            $httpBackend
                .expectDELETE(`${mockApiUrl}?access_token=${mockToken}`)
                .respond(success);

            apiService.delete(mockApiUrl, mockPayload);
            expect($httpBackend.flush).not.toThrow();
        });
    });
});
