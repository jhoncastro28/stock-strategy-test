import { expect } from 'chai';
import { InventoryContext } from '../src/inventory-context';
import { StockIncreaseStrategy, StockDecreaseStrategy } from '../src/stock-update.strategy';
import { LoggingDecorator, NotificationDecorator, AuditDecorator } from '../src/report-decorator';
import * as sinon from 'sinon';

describe('Report Decorator Pattern', () => {
    let context: InventoryContext;
    let increaseStrategy: StockIncreaseStrategy;
    let logSpy: sinon.SinonSpy;

    beforeEach(() => {
        context = new InventoryContext();
        increaseStrategy = new StockIncreaseStrategy();
        // Reemplazamos console.log con un spy para verificar las llamadas
        logSpy = sinon.spy(console, 'log');
    });

    afterEach(() => {
        // Restauramos console.log después de cada prueba
        logSpy.restore();
    });

    it('LoggingDecorator should log stock operations', () => {
        const loggingStrategy = new LoggingDecorator(increaseStrategy);
        context.setStrategy(loggingStrategy);

        const result = context.executeStockUpdate(10, 5);

        expect(result).to.equal(15);
        expect(logSpy.calledWith(sinon.match(/\[LOG\] Updating stock/))).to.be.true;
        expect(logSpy.calledWith(sinon.match(/\[LOG\] New stock level: 15/))).to.be.true;
    });

    it('NotificationDecorator should send notifications', () => {
        const notificationStrategy = new NotificationDecorator(increaseStrategy, 'email');
        context.setStrategy(notificationStrategy);

        const result = context.executeStockUpdate(10, 5);

        expect(result).to.equal(15);
        expect(logSpy.calledWith(sinon.match(/\[NOTIFICATION - email\]/))).to.be.true;
    });

    it('AuditDecorator should record audit information', () => {
        const auditStrategy = new AuditDecorator(increaseStrategy, 'user123');
        context.setStrategy(auditStrategy);

        const result = context.executeStockUpdate(10, 5);

        expect(result).to.equal(15);
        expect(logSpy.calledWith(sinon.match(/\[AUDIT\] Operation=ENTRY, User=user123/))).to.be.true;
    });

    it('Decorators can be nested to add multiple behaviors', () => {
        // Creamos una cadena de decoradores: Auditoría -> Notificación -> Logging -> Estrategia Base
        const baseStrategy = new StockIncreaseStrategy();
        const loggingStrategy = new LoggingDecorator(baseStrategy);
        const notificationStrategy = new NotificationDecorator(loggingStrategy, 'sms');
        const auditStrategy = new AuditDecorator(notificationStrategy, 'admin');

        context.setStrategy(auditStrategy);

        const result = context.executeStockUpdate(20, 10);

        expect(result).to.equal(30);
        // Verificamos que todos los decoradores hayan generado sus logs
        expect(logSpy.calledWith(sinon.match(/\[LOG\]/))).to.be.true;
        expect(logSpy.calledWith(sinon.match(/\[NOTIFICATION - sms\]/))).to.be.true;
        expect(logSpy.calledWith(sinon.match(/\[AUDIT\]/))).to.be.true;
    });
});