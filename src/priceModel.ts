'use strict';

import { IBulkPrice, IPriceModel } from './types';

module.exports = class PriceModel implements IPriceModel {
    private productId: string;
    private prices: IBulkPrice[];

    constructor(productId: string, prices: IBulkPrice[]) {
        this.productId = productId;
        this.prices = prices;
    }

    getProductId(): string {
        return this.productId;
    }

    getPrices(): IBulkPrice[] {
        return this.prices
            .sort((a, b) => (a.getBulkCount() > b.getBulkCount()) ? 1 : -1);
            // remove duplicates
    }
}
