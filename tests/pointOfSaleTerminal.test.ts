import { IPointOfSaleTerminal } from "../src/types";

export {};

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
