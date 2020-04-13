'use strict';

import { BulkPrice } from './types';

module.exports = class PriceModel {
    singlePrice: number;
    bulkPrice: null|BulkPrice;

    constructor(singlePrice: number, bulkPrice:null|BulkPrice = null) {
        this.singlePrice = singlePrice;
        this.bulkPrice = bulkPrice;
    }

    getSinglePrice(): number {
        return this.singlePrice;
    }

    getBulkPrice(): null|BulkPrice {
        return this.bulkPrice;
    }
}
