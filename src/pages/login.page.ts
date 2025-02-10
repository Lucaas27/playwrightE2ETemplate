import { Button } from '@/pages/elements/button.element';
import { Input } from '@/pages/elements/input.element';
import { Title } from '@/pages/elements/title.element';
import { BasePage } from '@/pages/base.page';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly title: Title = new Title(this.page, 'body > main > div > div.ui.segment > h3', 'Log In Title');
  readonly continueButton: Button = new Button(
    this.page,
    '[data-testid="login-page-continue-login-button"]',
    'Continue'
  );
  readonly usernameInput: Input = new Input(this.page, '[data-testid="login-page-username-input"]', 'Username');
  readonly passwordInput: Input = new Input(this.page, '[data-testid="login-page-password-input"]', 'Password');

  constructor(public page: Page) {
    super(page);
  }
}
