import { IBaseElement } from '@/interfaces';
import { capitaliseFirstLetter } from '@/utils/helpers';
import test, { expect, Locator, Page } from '@playwright/test';

export abstract class BaseElement implements IBaseElement {
  page: Page;
  name: string;
  locatorStr: string;
  hiddenByDefault: boolean;

  protected constructor(page: Page, locatorStr: string, name: string, hiddenByDefault: boolean) {
    this.page = page;
    this.locatorStr = locatorStr;
    this.name = name;
    this.hiddenByDefault = hiddenByDefault || false;
  }

  get elementName(): string {
    return this.name || this.constructor.name;
  }

  get typeOf(): string {
    return 'element';
  }

  get typeOfCapitalised(): string {
    return capitaliseFirstLetter(this.typeOf);
  }

  private generateInfoMessage(info: string): string {
    return `The ${this.typeOf} with name "${this.elementName}" and locator "${this.locatorStr}" ${info}`;
  }

  getLocator(options?: {
    has?: Locator;
    hasNot?: Locator;
    hasNotText?: string | RegExp;
    hasText?: string | RegExp;
  }): Locator {
    return this.page.locator(this.locatorStr, options || {});
  }

  async shouldBeVisible(): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should be visible on the page`, async () => {
      const locator = this.getLocator();
      await expect(locator, this.generateInfoMessage('should be visible')).toBeVisible();
    });
  }

  async shouldBeHidden(): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should be hidden`, async () => {
      const locator = this.getLocator();
      await expect(locator, this.generateInfoMessage('should be hidden')).toBeHidden();
    });
  }

  async shouldHaveText(text: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should have text ${text}`, async () => {
      const locator = this.getLocator();
      await expect(locator, this.generateInfoMessage(`contain text ${text}`)).toContainText(text);
    });
  }

  async click(): Promise<void> {
    await test.step(`Clicking the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().click();
    });
  }

  async doubleClick(): Promise<void> {
    await test.step(`Double click on ${this.typeOf} "${this.name}"`, async () => {
      await this.getLocator().dblclick();
    });
  }

  async hover(): Promise<void> {
    await test.step(`Hovering over the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().hover();
    });
  }

  async type(text: string): Promise<void> {
    await test.step(`Typing into the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().pressSequentially(text, { delay: 100 });
    });
  }

  async clear(): Promise<void> {
    await test.step(`Clearing the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().clear();
    });
  }

  async pressKey(key: string): Promise<void> {
    await test.step(`Pressing the key "${key}" on the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().press(key);
    });
  }

  async focus(): Promise<void> {
    await test.step(`Focusing on the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().focus();
    });
  }

  async scrollIntoView(): Promise<void> {
    await test.step(`Scrolling the ${this.typeOf} named ${this.name} into view`, async () => {
      await this.getLocator().scrollIntoViewIfNeeded();
    });
  }

  async selectOption(option: string): Promise<void> {
    await test.step(`Selecting the option "${option}" from the ${this.typeOf} named ${this.name}`, async () => {
      await this.getLocator().selectOption({ label: option });
    });
  }

  async shouldBeDisabled(): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should be disabled`, async () => {
      const locator = this.getLocator();
      await expect(locator, this.generateInfoMessage('should be disabled')).toBeDisabled();
    });
  }

  async shouldHaveValue(value: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should have value "${value}"`, async () => {
      const locator = this.getLocator();
      await expect(locator, this.generateInfoMessage(`should have value ${value}`)).toHaveValue(value);
    });
  }

  async shouldNotHaveValue(value: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should not have value "${value}"`, async () => {
      const locator = this.getLocator();
      await expect(locator, this.generateInfoMessage(`should not have ${value}`)).not.toHaveValue(value);
    });
  }

  async shouldHaveAttribute(attribute: string, value: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} "${this.name}" should have attribute "${attribute}" with value "${value}"`, async () => {
      const locator = this.getLocator();
      await expect(
        locator,
        this.generateInfoMessage(`should attribute "${attribute}" with value have ${value}`)
      ).toHaveAttribute(attribute, value);
    });
  }
}
