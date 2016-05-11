export class ClitestPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('clitest-app h1')).getText();
  }
}
