
describe('App', () => {
    it('should have a title', () => {
        browser.get('/');
        expect(browser.getTitle()).toBe('Waes List');
    });
});
