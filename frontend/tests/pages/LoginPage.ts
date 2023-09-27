import BasePage from './BasePage';
import LoginDTO, { LoginDto } from '../data-objects/LoginDto';

const headerText = '//div[@class="clickable brand"]/span[@class="rocks"]';
const emailTextBox = '//ion-input[@inputmode="email"]/input';
const passwordTextBox = '//ion-input[@type="password"]/input';
const loginNowButton = '#login-login';
const goToRegisterButton = '#login-register';

class LoginPage extends BasePage {
  async isHeaderTextPresent() {
    await this.page.locator(headerText).last().waitFor();
    const headerTextPresnt = await this.page
      .locator(headerText)
      .last()
      .isVisible();
    return headerTextPresnt;
  }

  async loginToApp(loginData: LoginDto) {
    await this.page
      .locator(emailTextBox)
      .last()
      .fill(loginData.email || '');
    await this.page
      .locator(passwordTextBox)
      .last()
      .fill(loginData.password || '');
    await this.page.locator(loginNowButton).first().click();
  }

  async goToRegisterPage() {
    await this.page.locator(goToRegisterButton).first().waitFor();
    await this.page.locator(goToRegisterButton).first().click();
  }

  async getLoginDetails() {
    const loginData = LoginDTO;
    loginData.email = await this.page
      .locator(emailTextBox)
      .first()
      .getAttribute('value');
    loginData.password = await this.page
      .locator(passwordTextBox)
      .first()
      .getAttribute('value');
    return loginData;
  }
}

export default LoginPage;