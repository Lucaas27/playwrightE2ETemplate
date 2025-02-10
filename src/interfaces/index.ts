import { Locator, Page } from '@playwright/test';

export interface IBasePage {
  page: Page;
  visit(url: string): Promise<void>;
  reloadPage(): Promise<void>;
  openNewTab(): Promise<Page>;
  reloadTab(number: number): Promise<void>;
  waitForDownload(): Promise<void>;
  getElementsHiddenByDefault(): IBaseElement[];
  elementsShouldBeVisible(): Promise<void>;
}

export interface IBaseElement {
  page: Page;
  name: string;
  locatorStr: string;
  elementName: string;
  typeOf: string;
  typeOfCapitalised: string;
  getLocator(options?: {
    has?: Locator;
    hasNot?: Locator;
    hasNotText?: string | RegExp;
    hasText?: string | RegExp;
  }): Locator;
  shouldBeVisible(): Promise<void>;
  shouldBeHidden(): Promise<void>;
  shouldHaveText(text: string): Promise<void>;
  click(): Promise<void>;
  doubleClick(): Promise<void>;
  hover(): Promise<void>;
  type(text: string): Promise<void>;
  clear(): Promise<void>;
  pressKey(key: string): Promise<void>;
  focus(): Promise<void>;
  scrollIntoView(): Promise<void>;
  selectOption(option: string): Promise<void>;
  shouldBeDisabled(): Promise<void>;
  shouldHaveValue(value: string): Promise<void>;
  shouldNotHaveValue(value: string): Promise<void>;
  shouldHaveAttribute(attribute: string, value: string): Promise<void>;
}

export interface IElementsVisibility {
  getElements(): IBaseElement[];
}
export interface IBaseComponent {
  page: Page;
}

export interface ILocatorContext {
  [key: string]: string | boolean | number;
}

export interface ILocatorProps extends ILocatorContext {
  locator?: string;
}
