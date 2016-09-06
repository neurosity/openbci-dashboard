import { OpenbciDashboardPage } from './app.po';

describe('openbci-dashboard App', function() {
  let page: OpenbciDashboardPage;

  beforeEach(() => {
    page = new OpenbciDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
