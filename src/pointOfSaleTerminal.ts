'use strict';

import { BulkPrice, BulkTotal, Repeats } from './types';

module.exports = class PointOfSaleTerminal {
    private priceModel: any;
    private scannedProducts: string[];

    constructor() {
        this.priceModel = {};
        this.scannedProducts = [];
    }

    /**
     * Set the pricing model for items.
     * 
     * @param priceModel 
     */
    setPricing(priceModel: any): void {
        this.priceModel = priceModel;
    }

    /**
     * Scans a single item at a time. Item must exist within the rpice model.
     * 
     * @param productId 
     */
    scanProduct(productId: string): void {
        this.scannedProducts.push(productId);
    }

    /**
     * Calculates the total cost of all scanned items for a given price model
     * 
     * @returns {number} total to be paid
     */
    calculateTotal(): number {
        const repeats: Repeats = this.findRepeats(this.scannedProducts);
        const scannedItems: string[] = Object.keys(repeats);
        let totalPrice: number = 0.0;
        
        for(const item of scannedItems) {
            const priceModal = this.priceModel[item];

            if (!priceModal) {
                console.warn(`Scanned item "${item}" does not have a price model. This item will be ignored.`)
                continue;
            }

            const bulkPrices: BulkPrice = priceModal.getBulkPrice();
            let noOfRepeatsRemaining: number = repeats[item];

            if(bulkPrices && bulkPrices.count <= noOfRepeatsRemaining) {
                const bulkTotal: BulkTotal = this.calculateBulkTotal(bulkPrices.price, bulkPrices.count, noOfRepeatsRemaining);
                totalPrice += bulkTotal.price;
                noOfRepeatsRemaining = bulkTotal.remainder;
            }

            totalPrice += this.calculateSinglesTotal(
                priceModal.getSinglePrice(), noOfRepeatsRemaining);
        }

        return totalPrice;
    }

    /**
     * Calculates the price for bulk items and the remainder of items which do not belong to a bulk buy.
     * 
     * @param {number} bulkPrice 
     * @param {number} bulkCount 
     * @param {number} repeatCount 
     * 
     * @returns {{ price: number, remainder: number }}
     */
    private calculateBulkTotal(bulkPrice: number, bulkCount: number, repeatCount: number): BulkTotal {
        const bulkBuys = Math.floor(repeatCount / bulkCount);
        return {
            price: bulkBuys * bulkPrice,
            remainder: repeatCount - bulkBuys * bulkCount
        };
    }

    /**
     * Calculates the price for multiple non-bulk items
     * 
     * @param {number} price 
     * @param {number} count 
     * 
     * @returns {number}
     */
    private calculateSinglesTotal(price: number, count: number): number {
        return price * count;
    }

    /**
     * Finds all repeats in a string array and returns a map of each strings count
     * eg. ['A', 'A', 'A', 'B', 'B', 'A'] -> { A: 4, B: 2 }
     * 
     * @param {string[]} items
     * @returns {{ string: number }}
     */
    private findRepeats(items: string[]): Repeats {
        return items.reduce((prev: Repeats, curr: string) => ({
            ...prev,
            [curr]: curr in prev ? prev[curr]+1 : 1
        }), {});
    }
}
