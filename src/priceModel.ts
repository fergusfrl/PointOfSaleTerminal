'use strict';

import { BulkPrice } from './types';

module.exports = class PriceModel {
    productId: string;
    singlePrice: number;
    bulkPrice: null|BulkPrice;

    constructor(productId: string, singlePrice: number, bulkPrice:null|BulkPrice = null) {
        this.productId = productId;
        this.singlePrice = singlePrice;
        this.bulkPrice = bulkPrice;
    }

    getProductId(): string {
        return this.productId;
    }

    getSinglePrice(): number {
        return this.singlePrice;
    }

    getBulkPrice(): null|BulkPrice {
        return this.bulkPrice;
    }
}