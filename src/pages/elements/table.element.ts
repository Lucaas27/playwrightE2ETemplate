import { BaseElement } from '@/pages/elements/base.element';
import test, { expect, Locator, Page } from '@playwright/test';

export class Table extends BaseElement {
  constructor(page: Page, locatorStr: string, name: string, hiddenByDefault?: boolean) {
    super(page, locatorStr, name, hiddenByDefault);
  }

  get typeOf(): string {
    return 'table';
  }

  async shouldHaveColumn(columnName: string, not: boolean = false): Promise<Locator> {
    let column: Locator;
    await test.step(`Table column "${columnName}" should be defined`, async () => {
      column = this.page.locator(`th:has-text("${columnName}")`);
      not ? expect(column).not.toBeDefined() : expect(column).toBeDefined();
    });

    return column;
  }

  async shouldHaveRow(rowNumber: number, not: boolean = false): Promise<Locator> {
    let row: Locator;
    await test.step(`Table row number "${rowNumber}" should be defined`, async () => {
      row = this.page.locator(`tr:nth-child(${rowNumber})`);
      not ? expect(row).not.toBeDefined() : expect(row).toBeDefined();
    });

    return row;
  }

  async shouldHaveCellWithText(rowNumber: number, text: string, not: boolean = false): Promise<Locator> {
    let cell: Locator;
    await test.step(`Row number "${rowNumber}" should contain a cell with text "${text}"`, async () => {
      cell = this.page.locator(`tr:nth-child(${rowNumber}) td:has-text("${text}")`);
      expect(cell).toBeDefined();
      not ? await expect(cell).not.toContainText(text) : await expect(cell).toContainText(text);
    });

    return cell;
  }

  async shouldHaveCellWithAttribute(
    rowNumber: number,
    columnName: string,
    attribute: string,
    value: string,
    not: boolean = false
  ): Promise<Locator> {
    let cell: Locator;
    await test.step(`Row number "${rowNumber}" in column "${columnName}" should ${
      not ? 'not ' : ''
    }have attribute "${attribute}" with value "${value}"`, async () => {
      const columnIndex = await this.page
        .locator(`th:has-text("${columnName}")`)
        .evaluate((th) => Array.from(th.parentNode.children).indexOf(th) + 1);

      cell = this.page.locator(`tr:nth-child(${rowNumber}) td:nth-child(${columnIndex})`);

      not
        ? await expect(cell).not.toHaveAttribute(attribute, value)
        : await expect(cell).toHaveAttribute(attribute, value);
    });
    return cell;
  }

  async shouldHaveNumberOfRows(numberOfRows: number, not: boolean = false): Promise<void> {
    await test.step(`Table should have "${numberOfRows}" rows`, async () => {
      const rows = this.page.locator('tr');
      not ? await expect(rows).not.toHaveCount(numberOfRows) : await expect(rows).toHaveCount(numberOfRows);
    });
  }

  async shouldHaveNumberOfColumns(numberOfColumns: number, not: boolean = false): Promise<void> {
    await test.step(`Table should have "${numberOfColumns}" columns`, async () => {
      const columns = this.page.locator('th');
      not ? await expect(columns).not.toHaveCount(numberOfColumns) : await expect(columns).toHaveCount(numberOfColumns);
    });
  }

  async shouldAllCellsInColumnHaveText(columnName: string, text: string, not: boolean = false): Promise<void> {
    await test.step(`All cells in column "${columnName}" should have text "${text}"`, async () => {
      const columnIndex = await this.page
        .locator(`th:has-text("${columnName}")`)
        .evaluate((th) => Array.from(th.parentNode.children).indexOf(th) + 1);
      const columnCells = this.page.locator(`tr td:nth-child(${columnIndex})`);
      const cellCount = await columnCells.count();
      for (let i = 0; i < cellCount; i++) {
        const cell = columnCells.nth(i);
        not ? await expect(cell).not.toContainText(text) : await expect(cell).toContainText(text);
      }
    });
  }

  async shouldHaveTableHeaders(headers: string[]): Promise<void> {
    headers.forEach(async (header) => {
      await this.shouldHaveColumn(header);
    });
  }
}
