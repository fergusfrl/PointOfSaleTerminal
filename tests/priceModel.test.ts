import { IBulkPrice, IPriceModel } from '../src/types';

const PriceModel = require('../src/priceModel');
const BulkPrice = require('../src/bulkPrice');

test('it successfully removes impossible bulk amounts', () => {
    const priceModel: IPriceModel = new PriceModel('apples', [
        new BulkPrice(0, 0.25),
        new BulkPrice(-1, 0.25),
        new BulkPrice(1, 0.25)
    ]);
    
    const result = priceModel.getPrices().map(item => item.getBulkCount());
    expect(result).toEqual([1]);
});

test('it successfully sorts bulk prices', () => {
    const priceModel: IPriceModel = new PriceModel('apples', [
        new BulkPrice(6, 0.25),
        new BulkPrice(4, 0.25),
        new BulkPrice(10, 0.25),
        new BulkPrice(1, 0.25),
        new BulkPrice(100, 0.25)
    ]);
    
    const result = priceModel.getPrices().map(item => item.getBulkCount());
    expect(result).toEqual([1, 4, 6, 10, 100]);
});

test('it successfully removes duplicates', () => {
    const priceModel: IPriceModel = new PriceModel('apples', [
        new BulkPrice(1, 0.25),
        new BulkPrice(1, 0.25),
        new BulkPrice(1, 0.25),
        new BulkPrice(10, 0.25),
        new BulkPrice(10, 0.25),
        new BulkPrice(100, 0.25)
    ]);
    
    const result = priceModel.getPrices().map(item => item.getBulkCount());
    expect(result).toEqual([1, 10, 100]);
});

test('it successfully removes duplicates in favour for cheaper duplicate', () => {
    const priceModel: IPriceModel = new PriceModel('apples', [
        new BulkPrice(1, 1),
        new BulkPrice(1, 5),
        new BulkPrice(1, 0.25),
        new BulkPrice(10, 20),
        new BulkPrice(10, 0.25),
        new BulkPrice(100, 0.25)
    ]);
    
    const result = priceModel.getPrices().map(item => item.getPrice());
    expect(result).toEqual([0.25, 0.25, 0.25]);
});
