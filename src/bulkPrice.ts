'use strict';

import { IBulkPrice } from './types';

module.exports = class BulkPrice implements IBulkPrice {
    private bulkCount: number;
    private price: number;

    constructor(bulkCount: number, price: number) {
        this.bulkCount = bulkCount;
        this.price = price;
    }

    /**
     * get the bulk count
     * 
     * @returns the number of individual items required to fit in a bulk order
     */
    getBulkCount(): number {
        return this.bulkCount;
    }

    /**
     * get the price for this bulk order
     * 
     * @returns the price for this bulk order
     */
    getPrice(): number {
        return this.price;
    }
}
