/**
 * @summary
 * Centralized service instances exports.
 * Provides single import point for all service configurations and instances.
 *
 * @module instances
 */

/**
 * InitExample instances
 */
export { initExampleStore, type InitExampleRecord } from './initExample';

/**
 * Vehicle instances
 */
export { vehicleStore, type VehicleRecord } from './vehicle';

/**
 * Contact instances
 */
export { contactStore } from './contact';
