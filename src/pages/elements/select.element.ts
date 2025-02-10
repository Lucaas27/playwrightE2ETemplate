import { BaseElement } from '@/pages/elements/base.element';
import test, { expect, Page } from '@playwright/test';

export class Select extends BaseElement {
  constructor(page: Page, locatorStr: string, name: string, hiddenByDefault?: boolean) {
    super(page, locatorStr, name, hiddenByDefault);
  }

  get typeOf(): string {
    return 'select';
  }

  async shouldHaveOption(option: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} named ${this.name} should have option "${option}"`, async () => {
      const optionLocator = this.page.locator(`option:has-text("${option}")`);
      expect(optionLocator).toBeDefined();
    });
  }

  async shouldHaveSelectedOption(option: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} named ${this.name} should have option "${option}" selected`, async () => {
      const selectedOptionLocator = this.page.locator(`option:selected:has-text("${option}")`);
      expect(selectedOptionLocator).toBeDefined();
      expect(await this.getSelectedOptionText()).toBe(option);
    });
  }

  async selectByVisibleText(text: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} named ${this.name} should select option with text "${text}"`, async () => {
      await this.page.selectOption(this.locatorStr, { label: text });
      expect(await this.getSelectedOptionText()).toBe(text);
    });
  }

  async selectByValue(value: string): Promise<void> {
    await test.step(`${this.typeOfCapitalised} named ${this.name} should select option with value "${value}"`, async () => {
      await this.page.selectOption(this.locatorStr, { value });
      expect(await this.getSelectedOptionValue()).toBe(value);
    });
  }

  async getSelectedOptionText(): Promise<string> {
    const selectedOption = await this.page
      .locator(this.locatorStr)
      .evaluate((element) => element['selectedOptions'][0].textContent);

    return selectedOption;
  }

  async getSelectedOptionValue(): Promise<string> {
    const selectedOption = await this.page
      .locator(this.locatorStr)
      .evaluate((element) => element['selectedOptions'][0].value);

    return selectedOption;
  }
}
