import { InventoryContext } from './src/inventory-context';
import { StockIncreaseStrategy, StockDecreaseStrategy } from './src/stock-update.strategy';
import { LoggingDecorator, NotificationDecorator, AuditDecorator } from './src/report-decorator';

// Ejemplo de uso del patrón Strategy
console.log("=== DEMOSTRACIÓN DEL PATRÓN STRATEGY ===");

const context = new InventoryContext();
const increaseStrategy = new StockIncreaseStrategy();
const decreaseStrategy = new StockDecreaseStrategy();

// Usando la estrategia de incremento
console.log("\n> Usando la estrategia de incremento (ENTRY):");
context.setStrategy(increaseStrategy);
console.log(`Tipo de movimiento: ${context.getMovementType()}`);
console.log(`Stock inicial: 10, Cantidad a agregar: 5`);
const resultIncrease = context.executeStockUpdate(10, 5);
console.log(`Nuevo stock: ${resultIncrease}`);

// Cambiando a la estrategia de decremento
console.log("\n> Cambiando a la estrategia de decremento (EXIT):");
context.setStrategy(decreaseStrategy);
console.log(`Tipo de movimiento: ${context.getMovementType()}`);
console.log(`Stock inicial: ${resultIncrease}, Cantidad a retirar: 8`);
const resultDecrease = context.executeStockUpdate(resultIncrease, 8);
console.log(`Nuevo stock: ${resultDecrease}`);

// Ejemplo de validación de inventario insuficiente
console.log("\n> Intentando retirar más stock del disponible:");
try {
    context.executeStockUpdate(resultDecrease, 10);
} catch (error) {
    console.log(`Error capturado: ${error.message}`);
}

// Ejemplo de uso del patrón Decorator
console.log("\n\n=== DEMOSTRACIÓN DEL PATRÓN DECORATOR ===");

// Decorando la estrategia con logging
console.log("\n> Estrategia base con Logging Decorator:");
const loggingIncrease = new LoggingDecorator(increaseStrategy);
context.setStrategy(loggingIncrease);
context.executeStockUpdate(20, 10);

// Decorando con notificaciones
console.log("\n> Estrategia con Notification Decorator:");
const notificationIncrease = new NotificationDecorator(increaseStrategy, "email");
context.setStrategy(notificationIncrease);
context.executeStockUpdate(20, 10);

// Decorando con auditoría
console.log("\n> Estrategia con Audit Decorator:");
const auditIncrease = new AuditDecorator(increaseStrategy, "user123");
context.setStrategy(auditIncrease);
context.executeStockUpdate(20, 10);

// Combinando múltiples decoradores
console.log("\n> Combinando múltiples decoradores:");
const baseStrategy = new StockDecreaseStrategy();
const withLogging = new LoggingDecorator(baseStrategy);
const withNotification = new NotificationDecorator(withLogging, "sms");
const withAudit = new AuditDecorator(withNotification, "admin");

context.setStrategy(withAudit);
try {
    // Esta operación debería desencadenar logs, notificaciones y registros de auditoría
    context.executeStockUpdate(50, 25);
} catch (error) {
    console.log(`Error en la operación combinada: ${error.message}`);
}