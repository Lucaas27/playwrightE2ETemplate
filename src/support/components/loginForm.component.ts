import { BaseComponent } from '@/support/components/base.component';
import { Button } from '@/support/elements/button.element';
import { Input } from '@/support/elements/input.element';
import { Page } from '@playwright/test';

export class LoginForm extends BaseComponent {
  readonly loginButton: Button = new Button(this.page, '[data-test="login-button"]', 'Login');
  readonly usernameInput: Input = new Input(this.page, '[data-test="username"]', 'Username');
  readonly passwordInput: Input = new Input(this.page, '[data-test="password"]', 'Password');

  constructor(public page: Page) {
    super(page);
    this.page = page;
  }

  async fillOutForm(username: string, password: string): Promise<void> {
    await this.usernameInput.type(username);
    await this.passwordInput.type(password);
  }
}
