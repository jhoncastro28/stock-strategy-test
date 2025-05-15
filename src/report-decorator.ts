import { StockUpdateStrategy } from './stock-update.strategy';

// Interfaz base para el patrón Decorator
export interface ReportDecorator extends StockUpdateStrategy {
    getStrategy(): StockUpdateStrategy;
}

// Decorator base abstracto
export abstract class BaseReportDecorator implements ReportDecorator {
    protected strategy: StockUpdateStrategy;

    constructor(strategy: StockUpdateStrategy) {
        this.strategy = strategy;
    }

    getStrategy(): StockUpdateStrategy {
        return this.strategy;
    }

    updateStock(currentStock: number, quantity: number): number {
        return this.strategy.updateStock(currentStock, quantity);
    }

    getMovementType(): string {
        return this.strategy.getMovementType();
    }

    validateOperation(currentStock: number, quantity: number): void {
        this.strategy.validateOperation(currentStock, quantity);
    }
}

// Decorator concreto para logging
export class LoggingDecorator extends BaseReportDecorator {
    updateStock(currentStock: number, quantity: number): number {
        console.log(`[LOG] Updating stock: current=${currentStock}, change=${quantity}, operation=${this.getMovementType()}`);
        const result = super.updateStock(currentStock, quantity);
        console.log(`[LOG] New stock level: ${result}`);
        return result;
    }
}

// Decorator concreto para notificaciones
export class NotificationDecorator extends BaseReportDecorator {
    private notificationChannel: string;

    constructor(strategy: StockUpdateStrategy, channel: string) {
        super(strategy);
        this.notificationChannel = channel;
    }

    updateStock(currentStock: number, quantity: number): number {
        const result = super.updateStock(currentStock, quantity);
        this.sendNotification(currentStock, quantity, result);
        return result;
    }

    private sendNotification(oldStock: number, change: number, newStock: number): void {
        console.log(`[NOTIFICATION - ${this.notificationChannel}] Stock ${this.getMovementType()} operation completed.`);
        console.log(`[NOTIFICATION - ${this.notificationChannel}] Previous: ${oldStock}, Change: ${change}, New: ${newStock}`);
    }
}

// Decorator concreto para auditoría
export class AuditDecorator extends BaseReportDecorator {
    private userId: string;

    constructor(strategy: StockUpdateStrategy, userId: string) {
        super(strategy);
        this.userId = userId;
    }

    updateStock(currentStock: number, quantity: number): number {
        const timestamp = new Date().toISOString();
        const result = super.updateStock(currentStock, quantity);

        // Registrar la auditoría
        console.log(`[AUDIT] Operation=${this.getMovementType()}, User=${this.userId}, Timestamp=${timestamp}`);
        console.log(`[AUDIT] Stock change from ${currentStock} to ${result}, Difference=${quantity}`);

        return result;
    }
}