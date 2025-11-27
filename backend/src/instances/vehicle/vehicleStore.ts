/**
 * @summary
 * In-memory store instance for Vehicle entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/vehicle/vehicleStore
 */

import { VehicleEntity } from '@/services/vehicle/vehicleTypes';

/**
 * Vehicle record structure matches the Entity definition
 */
export type VehicleRecord = VehicleEntity;

/**
 * In-memory store for Vehicle records
 */
class VehicleStore {
  private records: Map<number, VehicleRecord> = new Map();
  private currentId: number = 0;

  /**
   * Get next available ID
   */
  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  /**
   * Get all records
   */
  getAll(): VehicleRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: number): VehicleRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Add new record
   */
  add(record: VehicleRecord): VehicleRecord {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: number, data: Partial<VehicleRecord>): VehicleRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Delete record by ID
   */
  delete(id: number): boolean {
    return this.records.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: number): boolean {
    return this.records.has(id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records
   */
  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

/**
 * Singleton instance of VehicleStore
 */
export const vehicleStore = new VehicleStore();
