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

        it('should throw error for negative quantities', () => {
            context.setStrategy(increaseStrategy);
            expect(() => context.executeStockUpdate(10, -5)).to.throw('Quantity must be positive');
        });

        it('should throw error for zero quantities', () => {
            context.setStrategy(increaseStrategy);
            expect(() => context.executeStockUpdate(10, 0)).to.throw('Quantity must be positive');
        });

        it('should return ENTRY as movement type', () => {
            context.setStrategy(increaseStrategy);
            expect(context.getMovementType()).to.equal('ENTRY');
        });
    });

    describe('StockDecreaseStrategy', () => {
        it('should decrease stock correctly', () => {
            context.setStrategy(decreaseStrategy);
            const result = context.executeStockUpdate(10, 5);
            expect(result).to.equal(5);
        });

        it('should throw error for negative quantities', () => {
            context.setStrategy(decreaseStrategy);
            expect(() => context.executeStockUpdate(10, -5)).to.throw('Quantity must be positive');
        });

        it('should throw error for zero quantities', () => {
            context.setStrategy(decreaseStrategy);
            expect(() => context.executeStockUpdate(10, 0)).to.throw('Quantity must be positive');
        });

        it('should throw error for insufficient stock', () => {
            context.setStrategy(decreaseStrategy);
            expect(() => context.executeStockUpdate(10, 15)).to.throw('Insufficient stock available');
        });

        it('should return EXIT as movement type', () => {
            context.setStrategy(decreaseStrategy);
            expect(context.getMovementType()).to.equal('EXIT');
        });
    });

    describe('InventoryContext', () => {
        it('should throw error when no strategy is set', () => {
            const emptyContext = new InventoryContext();
            expect(() => emptyContext.executeStockUpdate(10, 5)).to.throw('No strategy set');
        });

        it('should allow changing strategies', () => {
            context.setStrategy(increaseStrategy);
            let result = context.executeStockUpdate(10, 5);
            expect(result).to.equal(15);

            context.setStrategy(decreaseStrategy);
            result = context.executeStockUpdate(15, 7);
            expect(result).to.equal(8);
        });
    });
});