import { Page } from '@playwright/test';

export class CookieManager {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async addOAuthEnabledCookie(domain: string) {
    await this.page.context().addCookies([
      {
        name: 'OAUTH_ENABLED',
        value: 'True',
        path: '/',
        domain: domain,
        sameSite: 'Lax',
      },
    ]);
  }

  async addIsTermsAgreedCookie(domain: string) {
    await this.page.context().addCookies([
      {
        name: 'cookie-agreed',
        value: 'C0000%2CC0002%2CC0003',
        path: '/',
        domain: domain,
        sameSite: 'Lax',
      },
    ]);
  }
}
