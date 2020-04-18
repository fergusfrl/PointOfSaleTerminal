import { IPointOfSaleTerminal } from "../src/types";

const PointOfSaleTerminal = require('../src/pointOfSaleTerminal');
const PriceModel = require('../src/priceModel');
const BulkPrice = require('../src/bulkPrice');

// findRepeats tests
test('it does not find repeats', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.findRepeats(['A', 'B', 'C', 'D']);
    expect(result).toStrictEqual({ A: 1, B: 1, C: 1, D: 1 });
});

test('it finds repeats successfully when grouped', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.findRepeats(['A', 'A', 'A', 'B', 'B']);
    expect(result).toStrictEqual({ A: 3, B: 2 });
});

test('it finds repeats successfully when seperated', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.findRepeats(['A', 'B', 'C', 'B', 'A', 'B', 'A', 'C']);
    expect(result).toStrictEqual({ A: 3, B: 3, C: 2 });
});

// calculateTotal tests
test('it calculates the total price for multiple items ', () => {
    const terminal = new PointOfSaleTerminal();

    // given
    setDefaultPricing(terminal);
    scanMultipleProducts(terminal, ['A', 'B', 'C', 'D', 'A', 'B', 'A']);

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(13.25);
});

test('it calculates the total price for a single item multiple times accurately', () => {
    const terminal = new PointOfSaleTerminal();

    // given
    setDefaultPricing(terminal);
    scanMultipleProducts(terminal, ['C', 'C', 'C', 'C', 'C', 'C', 'C']);

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(6);
});

test('it calculates the total price of only single items accurately', () => {
    const terminal = new PointOfSaleTerminal();

    // given
    setDefaultPricing(terminal);
    scanMultipleProducts(terminal, ['A', 'B', 'C', 'D']);

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(7.25);
});

test('it prints a warning when scanned items do not have a price model', () => {
    const terminal = new PointOfSaleTerminal();
    console.warn = jest.fn();

    // given
    setDefaultPricing(terminal);
    terminal.scanProduct('F');

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(0);
    expect(console.warn).toBeCalled();
});

test('it prints a warning and continues when scanned items do not have a price model', () => {
    const terminal = new PointOfSaleTerminal();
    console.warn = jest.fn();

    // given
    setDefaultPricing(terminal);
    scanMultipleProducts(terminal, ['A', 'B', 'F', 'A', 'A']);

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(7.25);
    expect(console.warn).toBeCalledTimes(1);
});

test('it successfully calculates price given single item price models only', () => {
    const terminal = new PointOfSaleTerminal();

        // given
        terminal.setPricing([
            new PriceModel('apple', [new BulkPrice(1, 1)]),
            new PriceModel('banana', [new BulkPrice(1, 1.25)]),
            new PriceModel('candy', [new BulkPrice(1, 3.12)]),
        ]);
        scanMultipleProducts(terminal, ['apple', 'candy', 'candy', 'banana']);
    
        // when
        const result = terminal.calculateTotal();
    
        // then
        expect(result).toBe(8.49);
});

test('it successfully calculates price given multiple bulk prices', () => {
    const terminal = new PointOfSaleTerminal();

    // given
    terminal.setPricing([
        new PriceModel('A', [
            new BulkPrice(1, 1),
            new BulkPrice(5, 4.5),
            new BulkPrice(10, 8),
            new BulkPrice(50, 30)
        ])
    ]);
    scanMultipleProducts(terminal, ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A']);

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(20.5);
});

test('it successfully calculates price given multiple bulk prices', () => {
    const terminal = new PointOfSaleTerminal();

    // given
    terminal.setPricing([
        new PriceModel('A', [
            new BulkPrice(1, 1),
            new BulkPrice(5, 4.5),
            new BulkPrice(10, 8),
            new BulkPrice(50, 30)
        ]),
        new PriceModel('B', [
            new BulkPrice(1, 8),
            new BulkPrice(2, 15),
            new BulkPrice(5, 10)
        ])
    ]);
    scanMultipleProducts(terminal, ['B', 'B', 'A', 'B', 'A', 'A', 'B', 'A', 'A', 'B', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B']);

    // when
    const result = terminal.calculateTotal();

    // then
    expect(result).toBe(37.5);
});

// test utils
const setDefaultPricing = (terminal: IPointOfSaleTerminal): void => {
    terminal.setPricing([
        new PriceModel('A', [
            new BulkPrice(1, 1.25),
            new BulkPrice(3, 3)
        ]),
        new PriceModel('B', [new BulkPrice(1, 4.25)]),
        new PriceModel('C', [
            new BulkPrice(1, 1),
            new BulkPrice(6, 5)
        ]),
        new PriceModel('D', [new BulkPrice(1, 0.75)])
    ]);
};

const scanMultipleProducts = (terminal: IPointOfSaleTerminal, products: string[]): void => {
    products.forEach(item => terminal.scanProduct(item));
};
