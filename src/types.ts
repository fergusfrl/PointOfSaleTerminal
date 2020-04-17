export interface IBulkPrice {
    getBulkCount(): number;
    getPrice(): number;
}

export interface IPriceModel {
    getProductId(): string;
    getPrices(): IBulkPrice[];
}

export interface IPointOfSaleTerminal {
    setPricing(priceModels: IPriceModel[]): void;
    scanProduct(productId: string): void;
    calculateTotal(): number;
}

export interface Repeats {
    [key: string]: number
}
