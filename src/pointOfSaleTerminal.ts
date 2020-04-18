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
     * @returns total to be paid
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
     * finds all possible combinations of bulk counts which sum to the number scans of a single product
     * eg. (6, [1,2,3]) -> [1,1,1,1,1,1], [1,1,1,1,2], [1,1,1,3], [2,2,1,1], [2,2,2], [3,3], [1,2,3]
     * 
     * @param noOfRepeats 
     * @param bulkCounts 
     * 
     * @returns all possible bulkCount combinations
     */
    private getCombinations(noOfRepeats: number, bulkCounts: number[]): number[][] {
        const combiations: number[][] = [];

        const findCombinations = (i: number, remaining: number, currentCombination: number[]) => {
            if(remaining < 0) {
                // overshot, not a viable combination
                return;
            }

            if(remaining === 0) {
                // perfect combination sums to target, add to return value
                combiations.push(currentCombination);
                return;
            }

            // increment over possible bulkCounts
            for(let j = i; j < bulkCounts.length; j++) {
                const candidate = bulkCounts[j];
                // test how many of a bulkCount will fit into target sum
                const maxCount = Math.floor(remaining / candidate);

                // return becasue incremental nature bulkCounts will be highter than current candidate so will also = 0
                if (maxCount === 0) return;

                // decrement the no. of current bulkCounts we're using then recursively run function with remainder of target sum
                for(let count = maxCount; count > 0; count--) {
                    remaining -= count*candidate;
                    const candidateArray = Array(count).fill(candidate);
                    findCombinations(j+1, remaining, [...currentCombination, ...candidateArray]);
                    remaining += count*candidate;
                }
            }
        }

        findCombinations(0, noOfRepeats, []);
        return combiations;
    }

    /**
     * finds the cheapest possible price for a given set of combinations
     * eg. [1,1,1], [1,2] -> [1,2] given [1,1,1]=3 and [1,2]=2.5
     * 
     * @param bulkPrices 
     * @param combinations
     * 
     * @returns price of the cheapest combination
     */
    private calculateCombinationsCheapestCost(bulkPrices: IBulkPrice[], combinations: number[][]): number {
        return combinations
            .map(combination => this.calculateCombinationCost(bulkPrices, combination))
            .reduce((prev, curr) => prev < curr ? prev : curr);
    }

    /**
     * finds the price for a given combination
     * eg. [1,1,1] if 1 item=$2 -> 6
     * 
     * @param bulkPrices 
     * @param combination 
     * 
     * @returns the cost of a combination
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
     * @param items
     * 
     * @returns a count map of items pressent in items 
     */
    private findRepeats(items: string[]): Repeats {
        return items.reduce((prev: Repeats, curr: string) => ({
            ...prev,
            [curr]: curr in prev ? prev[curr]+1 : 1
        }), {});
    }
}
