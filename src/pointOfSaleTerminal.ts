'use strict';

import { Repeats, IPriceModel, IBulkPrice, IPointOfSaleTerminal } from './types';

module.exports = class PointOfSaleTerminal implements IPointOfSaleTerminal {
    private priceModels: IPriceModel[];
    private scannedProducts: string[];

    constructor() {
        this.priceModels = [];
        this.scannedProducts = [];
    }

    /**
     * Set the pricing model for items.
     * 
     * @param priceModel 
     */
    setPricing(priceModels: IPriceModel[]): void {
        this.priceModels = priceModels;
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
     * Calculates the total cost of all scanned items using a given price model
     * 
     * @returns {number} total to be paid
     */
    calculateTotal(): number {
        const repeats: Repeats = this.findRepeats(this.scannedProducts);
        let totalPrice: number = 0.0;

        for(const productId in repeats) {
            const priceModel = this.priceModels.find(model => model.getProductId() === productId);

            if(!priceModel) {
                console.warn(`Product with ID "${productId}" does not exist. Ignoring this product.`);
                continue;
            }

            const bulkCounts: number[] = priceModel.getPrices().map(bulkPrice => bulkPrice.getBulkCount());
            const possibleCombinations: number[][] = this.getCombinations(repeats[productId], bulkCounts);
            const cheapestCombinationCost: number = this.calculateCombinationsCheapestCost(
                priceModel.getPrices(), possibleCombinations);
            totalPrice += cheapestCombinationCost;
        }

        return totalPrice;
    }

    /**
     * 
     * @param noOfRepeats 
     * @param bulkCounts 
     */
    private getCombinations(noOfRepeats: number, bulkCounts: number[]): number[][] {
        const combiations: number[][] = [];

        const findCombinations = (i: number, remaining: number, currentCombination: number[]) => {
            if(remaining < 0) {
                return;
            }

            if(remaining === 0) {
                combiations.push(currentCombination);
                return;
            }

            for(let j = i; j < bulkCounts.length; j++) {
                const candidate = bulkCounts[j];
                const maxCount = Math.floor(remaining / candidate);

                for(let count = maxCount; count > 0; count--) {
                    remaining -= count*candidate;
                    findCombinations(j+1, remaining, currentCombination.concat(Array(count).fill(candidate)));
                    remaining += count*candidate;
                }
            }
        }

        findCombinations(0, noOfRepeats, []);
        return combiations;
    }

    /**
     * 
     * @param bulkPrices 
     * @param combinations 
     */
    private calculateCombinationsCheapestCost(bulkPrices: IBulkPrice[], combinations: number[][]): number {
        return combinations
            .map(combination => this.calculateCombinationCost(bulkPrices, combination))
            .reduce((prev, curr) => prev < curr ? prev : curr);
    }

    /**
     * 
     * @param bulkPrices 
     * @param combination 
     */
    private calculateCombinationCost(bulkPrices: IBulkPrice[], combination: number[]): number {
        return combination
            .map((bulkCount: number) => 
                bulkPrices.find((bulkPrice: IBulkPrice) => 
                    bulkPrice.getBulkCount() === bulkCount
                )?.getPrice() || 0
            )
            .reduce((prev: number, curr: number) => prev + curr, 0);
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
