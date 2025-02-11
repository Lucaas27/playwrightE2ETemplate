import { LoginForm } from '@/support/components/loginForm.component';
import { Title } from '@/support/elements/title.element';
import { BasePage } from '@/support/pages/base.page';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly title: Title = new Title(this.page, '.login_logo', 'Log In Title');
  readonly loginForm: LoginForm = new LoginForm(this.page);

  constructor(public page: Page) {
    super(page);
  }
}
