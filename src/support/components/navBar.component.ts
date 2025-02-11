import { BaseComponent } from '@/support/components/base.component';
import { Link } from '@/support/elements/link.element';
import { Page } from '@playwright/test';

export class NavBar extends BaseComponent {
  readonly allProductsLink = new Link(this.page, '[data-test=inventory-sidebar-link]', 'Products', true);
  readonly aboutLink = new Link(this.page, '[data-test=about-sidebar-link]', 'Home', true);
  readonly logoutLink = new Link(this.page, '[data-test=logout-sidebar-link]', 'Logout', true);
  readonly resetSideBarLink = new Link(this.page, '[data-test=reset-sidebar-link]', 'Shopping Cart', true);

  constructor(public page: Page) {
    super(page);
  }
}
