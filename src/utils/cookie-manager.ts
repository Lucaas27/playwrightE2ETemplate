import {Page} from "@playwright/test";

export class CookieManager {
    readonly page: Page;

    constructor(page) {
        this.page = page;
    }

    async addOAuthEnabledCookie(domain) {
        await this.page.context().addCookies([{
            name: "OAUTH_ENABLED",
            value: "True",
            path: "/",
            domain: domain,
            sameSite: "Lax"
        }]);
    }


    async addWso2Cookie(domain) {
        await this.page.context().addCookies([{
            name: "X-Use-Wso2",
            value: "true",
            path: "/",
            domain: domain,
            sameSite: "Lax"
        }]);
    }

    async addIsAdviserCookie(domain) {
        await this.page.context().addCookies([{
            name: "ajbic_site",
            value: "adviser",
            path: "/",
            domain: domain,
            sameSite: "Lax"
        }]);

    }

    async addIsTermsAgreedCookie(domain) {
        await this.page.context().addCookies([{
            name: "cookie-agreed",
            value: "C0000%2CC0002%2CC0003",
            path: "/",
            domain: domain,
            sameSite: "Lax"
        }]);
    }

}