import { ClitestPage } from './app.po';

describe('clitest App', function() {
  let page: ClitestPage;

  beforeEach(() => {
    page = new ClitestPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('clitest works!');
  });
});
