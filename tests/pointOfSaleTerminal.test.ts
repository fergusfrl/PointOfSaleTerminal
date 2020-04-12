export {};

const PointOfSaleTerminal = require('../src/pointOfSaleTerminal');
const PriceModel = require('../src/priceModel');

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

// calculateSingleTotal tests
test('it calculates single item int prices correctly', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateSinglesTotal(1, 10);
    expect(result).toBe(10);
});

test('it calculates single item float prices correctly', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateSinglesTotal(1.25, 10);
    expect(result).toBe(12.5);
});

// calculateBulkTotal tests
test('it calculates bulk int item prices correctly when there is a bulk buy', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateBulkTotal(3, 5, 10);
    expect(result).toStrictEqual({ price: 6, remainder: 0 });
});

test('it calculates bulk int item prices correctly when there is a bulk buy with remainder', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateBulkTotal(3, 5, 12);
    expect(result).toStrictEqual({ price: 6, remainder: 2 });
});

test('it calculates bulk int item prices correctly when there is no bulk buy', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateBulkTotal(3, 5, 4);
    expect(result).toStrictEqual({ price: 0, remainder: 4 });
});

test('it calculates bulk float item prices correctly when there is a bulk buy', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateBulkTotal(3.12, 5, 10);
    expect(result).toStrictEqual({ price: 6.24, remainder: 0 });
});

test('it calculates bulk float item prices correctly when there is a bulk buy with remainder', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateBulkTotal(2.13, 5, 12);
    expect(result).toStrictEqual({ price: 4.26, remainder: 2 });
});

test('it calculates bulk float item prices correctly when there is no bulk buy', () => {
    const terminal = new PointOfSaleTerminal();
    const result = terminal.calculateBulkTotal(4.8, 5, 4);
    expect(result).toStrictEqual({ price: 0, remainder: 4 });
});

// calculateTotal tests
test('it calculates the total price for multiple items ', () => {
    const terminal = new PointOfSaleTerminal();

    // set pricing
    terminal.setPricing({
        A: new PriceModel('A', 1.25, { count: 3, price: 3 }),
        B: new PriceModel('B', 4.25),
        C: new PriceModel('C', 1, { count: 6, price: 5 }),
        D: new PriceModel('D', 0.75)
    });

    // scan items
    scanMultipleProducts(terminal, ['A', 'B', 'C', 'D', 'A', 'B', 'A']);

    // calculate total
    const result = terminal.calculateTotal();
    expect(result).toBe(13.25);
});

test('it calculates the total price for a single item multiple times accurately', () => {
    const terminal = new PointOfSaleTerminal();

    // set pricing
    terminal.setPricing({
        A: new PriceModel('A', 1.25, { count: 3, price: 3 }),
        B: new PriceModel('B', 4.25),
        C: new PriceModel('C', 1, { count: 6, price: 5 }),
        D: new PriceModel('D', 0.75)
    });

    // scan items
    scanMultipleProducts(terminal, ['C', 'C', 'C', 'C', 'C', 'C', 'C']);

    // calculate total
    const result = terminal.calculateTotal();
    expect(result).toBe(6);
});

test('it calculates the total price of only single items accurately', () => {
    const terminal = new PointOfSaleTerminal();

    // set pricing
    terminal.setPricing({
        A: new PriceModel('A', 1.25, { count: 3, price: 3 }),
        B: new PriceModel('B', 4.25),
        C: new PriceModel('C', 1, { count: 6, price: 5 }),
        D: new PriceModel('D', 0.75)
    });

    // scan items
    scanMultipleProducts(terminal, ['A', 'B', 'C', 'D']);

    // calculate total
    const result = terminal.calculateTotal();
    expect(result).toBe(7.25);
});

test('it prints a warning when scanned items do not have a price model', () => {
    const terminal = new PointOfSaleTerminal();
    console.warn = jest.fn();

    // set pricing
    terminal.setPricing({
        A: new PriceModel('A', 1.25, { count: 3, price: 3 }),
        B: new PriceModel('B', 4.25),
        C: new PriceModel('C', 1, { count: 6, price: 5 }),
        D: new PriceModel('D', 0.75)
    });

    // scan items
    terminal.scanProduct('F');

    // calculate total
    const result = terminal.calculateTotal();
    // expect output
    expect(result).toBe(0);
    expect(console.warn).toBeCalled();
});

test('it prints a warning and continues when scanned items do not have a price model', () => {
    const terminal = new PointOfSaleTerminal();
    console.warn = jest.fn();

    // set pricing
    terminal.setPricing({
        A: new PriceModel('A', 1.25, { count: 3, price: 3 }),
        B: new PriceModel('B', 4.25),
        C: new PriceModel('C', 1, { count: 6, price: 5 }),
        D: new PriceModel('D', 0.75)
    });

    // scan items
    scanMultipleProducts(terminal, ['A', 'B', 'F', 'A', 'A']);

    // calculate total
    const result = terminal.calculateTotal();
    // expect output
    expect(result).toBe(7.25);
    expect(console.warn).toBeCalledTimes(1);
});

// test utils
const scanMultipleProducts = (terminal: any, products: string[]): void => {
    products.forEach(item => terminal.scanProduct(item));
}
