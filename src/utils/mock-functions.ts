import {Page} from '@playwright/test';

export class MockFunctions {
    readonly page: Page;

    constructor(page) {
        this.page = page;
    };

    waitMockApiResponse = async (url, status, response?) => {
        await this.page.route(url, async (route) => {
            if(response !== undefined){
                await route.fulfill({
                    status: status,
                    body: JSON.stringify(response)
                });
            } else {
                await route.fulfill({
                    status: status
                }); 
            }
        });
    };
}