import { BaseComponent } from '@/support/components/base.component';
import { Button } from '@/support/elements/button.element';
import { Link } from '@/support/elements/link.element';
import { Select } from '@/support/elements/select.element';
import { Title } from '@/support/elements/title.element';
import { Page } from '@playwright/test';

export class PageHeader extends BaseComponent {
  readonly appTitle = new Title(this.page, '.app_logo', 'App Title');
  readonly pageTitle = new Title(this.page, '[data-test=title]', 'Page Title');
  readonly shoppingCart = new Link(this.page, '[data-test=shopping-cart-link]', 'Shopping Cart');
  readonly sortSelector = new Select(this.page, '[data-test=product-sort-container]', 'Sort Selector');
  readonly hamburgerMenu = new Button(this.page, '[data-test=open-menu]', 'Hamburger Menu');

  constructor(public page: Page) {
    super(page);
  }
}
