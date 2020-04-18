# Point of Sale Terminal
A point-of-sale scanning system class library. Accepts a list of products then calculates the total price given a preconfigured single and bulk cost.

<br>

## Getting Started

```js
// insatll dependencies
$ npm install
```

```js
// transpile typescript into javascript
$ npm run build
```

### Running Application Interface
```js
$ npm run exec
```
You will be prompted to enter the scanned products. Products should be seperated by a comma (",").

> eg. A,A,B,C,A,B,D,A

Available products include:
| Product | Scannable ID | Single Price | Bulk Price  |
|---------|--------------|--------------|-------------|
| apple   | A            | $1.25        | 3 for $3.00 |
| banana  | B            | $4.25        |             |
| candy   | C            | $1.00        | 6 for $5.00 |
| date    | D            | $0.75        |             |

### Running Test Cases
```js
// runs a suite of tests on the PointOfSaleTerminal class
$ npm test
```

<br>

## Documentation
> ### PointOfSaleTerminal
**constructors**
* PointOfSaleTerminal()
    ```js
    const terminal = new PointOfSaleTerminal();
    ```
**methods**
* setPricing(PriceModel[])

    sets pricing model
    ```js
    terminal.setPricing([
        priceModelOne,
        priceModelTwo,
        priceModelThree
    ]);
    ```
* scanProduct(string)

    scans a single product
    ```js
    terminal.scanProduct('A');
    ```
* calculateTotal()
    
    returns the total cost of all scanned products according to the pricing model.
    ```js
    terminal.calculateTotal();
    ```

<br>

> ### BulkPrice
**constructors**
* BulkPrice(number, number)
    ```js
    const bulkPrice = new BulkPrice(1, 3)
    ```
**methods**
* getBulkCount()

    returns the number of items required to be a bulk
    ```js
    bulkPrice.getBulkCount();
    ```
* getPrice()

    returns the price for the bulk amount
    ```js
    bulkPrice.getPrice();
    ```

<br>

> ### PriceModel
**constructors**
* PriceModel(string, BulkPrice[])
    ```js
    const priceModel = new PriceModel('apples', [
        bulkPriceOne,
        bulkPriceTwo
    ]);
    ```
**methods**
* getProductId()

    returns the bulk count
    ```js
    priceModel.getProductId();
    ```
* getPrices()

    returns the bulk price
    ```js
    priceModel.getPrices();
    ```
