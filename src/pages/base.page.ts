import { IBasePage, IElementsVisibility } from '@/interfaces';
import { BaseComponent } from '@/pages/components/base.component';
import { BaseElement } from '@/pages/elements/base.element';
import test, { Page } from '@playwright/test';

export abstract class BasePage implements IBasePage, IElementsVisibility {
  readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  async visit(url: string): Promise<void> {
    await test.step(`Visiting ${url}`, async () => {
      await this.page.goto(url, { waitUntil: 'networkidle' });
    });
  }

  async reloadPage(): Promise<void> {
    await test.step('Reloading page', async () => {
      await this.page.reload({ waitUntil: 'networkidle' });
    });
  }

  async openNewTab(): Promise<Page> {
    return await test.step('Opening new tab', async () => {
      return await this.page.context().newPage();
    });
  }

  async reloadTab(number: number): Promise<void> {
    await test.step(`Reloading tab ${number}`, async () => {
      const tabPage = this.page.context().pages()[number];

      await tabPage.bringToFront();
      await tabPage.reload({ waitUntil: 'networkidle' });
    });
  }

  async closeTab(number: number): Promise<void> {
    await test.step(`Closing tab ${number}`, async () => {
      const tabPage = this.page.context().pages()[number];

      await tabPage.close();
    });
  }

  async waitForDownload(): Promise<void> {
    await test.step('Waiting for download to complete', async () => {
      await this.page.waitForEvent('download');
    });
  }

  /**
   * Uses reflection to retrieve all elements of type `BaseElement` from the current instance and its nested components.
   *
   * This method first collects all properties of the current instance that are instances of `BaseElement`.
   * Then, it collects all properties that are instances of `BaseComponent` and recursively retrieves their elements.
   *
   * @returns {BaseElement[]} An array of `BaseElement` instances found in the current instance and its nested components.
   */
  getElements(): BaseElement[] {
    const elements = Object.getOwnPropertyNames(this)
      .map((prop) => (this as any)[prop])
      .filter((prop) => prop instanceof BaseElement);

    const components = Object.getOwnPropertyNames(this)
      .map((prop) => (this as any)[prop])
      .filter((prop) => prop instanceof BaseComponent);

    for (const component of components) {
      elements.push(...(component as BaseComponent).getElements());
    }

    return elements;
  }

  getElementsHiddenByDefault(): BaseElement[] {
    return this.getElements().filter((element) => element.hiddenByDefault);
  }

  /**
   * Ensures that all elements are visible, except those that are hidden by default.
   *
   * This method retrieves the elements using `getElements` and checks their visibility.
   * If an element is not in the list of elements hidden by default, it verifies that the element is visible.
   * For elements that are hidden by default, it verifies that they are hidden.
   *
   * @returns {Promise<void>} A promise that resolves when the visibility checks are complete.
   */
  async elementsShouldBeVisible(): Promise<void> {
    const elements = this.getElements();
    const elementsHiddenByDefault = this.getElementsHiddenByDefault ? this.getElementsHiddenByDefault() : [];

    for (const element of elements) {
      if (!elementsHiddenByDefault.includes(element)) {
        await element.shouldBeVisible();
      }
    }

    for (const hiddenElement of elementsHiddenByDefault) {
      await hiddenElement.shouldBeHidden();
    }
  }
}
