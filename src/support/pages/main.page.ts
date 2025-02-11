import { NavBar } from '@/support/components/navBar.component';
import { PageHeader } from '@/support/components/pageHeader.component';
import { BasePage } from '@/support/pages/base.page';
import { Page } from '@playwright/test';

export class MainPage extends BasePage {
  readonly pageHeader = new PageHeader(this.page);
  readonly navBar = new NavBar(this.page);

  constructor(public page: Page) {
    super(page);
  }
}
