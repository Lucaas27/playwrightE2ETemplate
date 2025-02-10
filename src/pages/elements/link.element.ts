import { BaseElement } from '@/pages/elements/base.element';
import { Page } from '@playwright/test';

export class Link extends BaseElement {
  constructor(page: Page, locatorStr: string, name: string, hiddenByDefault?: boolean) {
    super(page, locatorStr, name, hiddenByDefault);
  }

  get typeOf(): string {
    return 'link';
  }
}
