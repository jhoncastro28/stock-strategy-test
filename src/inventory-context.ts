import { StockUpdateStrategy } from './stock-update.strategy';

export class InventoryContext {
    private strategy!: StockUpdateStrategy;

    setStrategy(strategy: StockUpdateStrategy): void {
        this.strategy = strategy;
    }

    executeStockUpdate(currentStock: number, quantity: number): number {
        if (!this.strategy) {
            throw new Error('No strategy set');
        }

        this.strategy.validateOperation(currentStock, quantity);
        return this.strategy.updateStock(currentStock, quantity);
    }

    getMovementType(): string {
        return this.strategy.getMovementType();
    }
}
