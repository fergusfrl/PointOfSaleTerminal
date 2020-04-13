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
* setPricing({ string: PricingModel })

    sets pricing model
    ```js
    terminal.setPricing({ A: pricingModel });
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

> ### PriceModel
**constructors**
* PriceModel(number, number)
    ```js
    const priceModel = new PriceModel(3, 2.75);
    ```
**methods**
* getCount()

    returns the bulk count
    ```js
    priceModel.getCount();
    ```
* getPrice()

    returns the bulk price
    ```js
    priceModel.getPrice();
    ```
