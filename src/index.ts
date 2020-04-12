const readline = require('readline');
const PriceModel = require('./priceModel');
const PointOfSaleTerminal = require('./pointOfSaleTerminal');

const terminal = new PointOfSaleTerminal();

// create price models
const apples = new PriceModel('A', 1.25, { count: 3, price: 3.0 });
const bananas = new PriceModel('B', 4.25);
const candy = new PriceModel('C', 1.0, { count: 6, price: 5.0 });
const dentalFloss = new PriceModel('D', 0.75);
terminal.setPricing({ A: apples, B: bananas, C: candy, D: dentalFloss });

// setup stdin and stdout
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// scan products
rl.question('Enter Scanned items:', (answer: string) => {
    answer
        .split(',')
        .forEach(char => terminal.scanProduct(char));
     
    // calculate answer    
    console.log(terminal.calculateTotal());
    rl.close();
});
