'use strict';

import { IBulkPrice } from './types';

module.exports = class BulkPrice implements IBulkPrice {
    private bulkCount: number;
    private price: number;

    constructor(bulkCount: number, price: number) {
        this.bulkCount = bulkCount;
        this.price = price;
    }

    getBulkCount(): number {
        return this.bulkCount;
    }

    getPrice(): number {
        return this.price;
    }
}
