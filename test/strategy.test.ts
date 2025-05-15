import { expect } from 'chai';
import { InventoryContext } from '../src/inventory-context';
import { StockIncreaseStrategy, StockDecreaseStrategy } from '../src/stock-update.strategy';

describe('Stock Update Strategy', () => {
    let context: InventoryContext;
    let increaseStrategy: StockIncreaseStrategy;
    let decreaseStrategy: StockDecreaseStrategy;

    beforeEach(() => {
        context = new InventoryContext();
        increaseStrategy = new StockIncreaseStrategy();
        decreaseStrategy = new StockDecreaseStrategy();
    });

    describe('StockIncreaseStrategy', () => {
        it('should increase stock correctly', () => {
            context.setStrategy(increaseStrategy);
            const result = context.executeStockUpdate(10, 5);
            expect(result).to.equal(15);
        });
    });
});
