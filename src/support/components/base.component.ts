import { IBaseComponent, IElementsVisibility } from '@/interfaces';
import { BaseElement } from '@/support/elements/base.element';
import { Page } from '@playwright/test';

export abstract class BaseComponent implements IBaseComponent, IElementsVisibility {
  constructor(public page: Page) {}

  /**
   * Retrieves all properties of the current instance that are instances of `BaseElement`.
   *
   * @returns {BaseElement[]} An array of `BaseElement` instances found among the properties of the current instance.
   */
  getElements(): BaseElement[] {
    return Object.getOwnPropertyNames(this)
      .map((prop) => (this as any)[prop])
      .filter((prop) => prop instanceof BaseElement);
  }
}
