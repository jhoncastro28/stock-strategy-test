export interface StockUpdateStrategy {
    updateStock(currentStock: number, quantity: number): number;
    getMovementType(): string;
    validateOperation(currentStock: number, quantity: number): void;
}

export class StockIncreaseStrategy implements StockUpdateStrategy {
    getMovementType(): string {
        return 'ENTRY';
    }

    validateOperation(currentStock: number, quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
    }

    updateStock(currentStock: number, quantity: number): number {
        return currentStock + quantity;
    }
}

export class StockDecreaseStrategy implements StockUpdateStrategy {
    getMovementType(): string {
        return 'EXIT';
    }

    validateOperation(currentStock: number, quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
        if (currentStock < quantity) {
            throw new Error(`Insufficient stock available. Current: ${currentStock}, Requested: ${quantity}`);
        }
    }

    updateStock(currentStock: number, quantity: number): number {
        return currentStock - quantity;
    }
}
