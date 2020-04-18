'use strict';

import { IBulkPrice, IPriceModel } from './types';

module.exports = class PriceModel implements IPriceModel {
    private productId: string;
    private prices: IBulkPrice[];

    constructor(productId: string, prices: IBulkPrice[]) {
        this.productId = productId;
        this.prices = prices;
    }

    /**
     * get the product ID for this priceModel
     * 
     * @returns the product ID
     */
    getProductId(): string {
        return this.productId;
    }

    /**
     * returns the sorted list of bulk prices with the duplicates removed, leaving only the cheapest duplicate
     * 
     * @returns a list of bulk orders
     */
    getPrices(): IBulkPrice[] {
        return this.prices
            .filter(this.impossibleBulkAmounts)
            .sort(this.sortPrice)
            .reduce(this.removeDuplicates, []);
    }

    /**
     * finds whether a bulk count is <= 0, therefore impossible
     * 
     * @param item
     * 
     * @returns whether the bulk count is possibel
     */
    private impossibleBulkAmounts(item: IBulkPrice): boolean {
        return item.getBulkCount() > 0;
    }

    /**
     * finds the correct order of bulkPrices, accending by count first, then 2ndarily sorted by price
     * 
     * @param a 
     * @param b
     * 
     * @returns a number indicating intended sort order compaiered with the following item in an array
     */
    private sortPrice(a: IBulkPrice, b: IBulkPrice): number {
        if (a.getBulkCount() > b.getBulkCount()) return 1;
        if (a.getBulkCount() < b.getBulkCount()) return -1;
        return a.getPrice() > b.getPrice() ? 1 : -1
    }

    /**
     * removes items with duplicate counts from the input array
     * 
     * @param prev 
     * @param curr 
     * 
     * @returns an array of bulkprice without count duplicates
     */
    private removeDuplicates(prev: IBulkPrice[], curr: IBulkPrice): IBulkPrice[] {
        const duplicate = prev.find(bulkPrice => bulkPrice.getBulkCount() === curr.getBulkCount());
        return duplicate ? prev : [...prev, curr];
    }
}
