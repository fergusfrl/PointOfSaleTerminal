const readline = require('readline');
const PriceModel = require('./src/priceModel');
const BulkPrice = require('./src/bulkPrice');
const PointOfSaleTerminal = require('./src/pointOfSaleTerminal');
const terminal = new PointOfSaleTerminal();

// create price models
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

// setup stdin and stdout
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// scan products via cmd line
rl.question('Enter Scanned items:', (answer: string) => {
    answer
        .split(',')
        .forEach(char => terminal.scanProduct(char));
     
    // calculate answer    
    console.log(`Total Price: $${terminal.calculateTotal()}`);
    rl.close();
});
