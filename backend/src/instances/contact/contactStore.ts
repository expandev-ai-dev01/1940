/**
 * @summary
 * In-memory store instance for Contact entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/contact/contactStore
 */

import { ContactEntity } from '@/services/contact/contactTypes';

/**
 * In-memory store for Contact records
 */
class ContactStore {
  private records: Map<number, ContactEntity> = new Map();
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
  getAll(): ContactEntity[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: number): ContactEntity | undefined {
    return this.records.get(id);
  }

  /**
   * Add new record
   */
  add(record: ContactEntity): ContactEntity {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: number, data: Partial<ContactEntity>): ContactEntity | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Get count of records created on a specific date (YYYYMMDD)
   * Used for protocol generation
   */
  getDailyCount(dateStr: string): number {
    let count = 0;
    for (const record of this.records.values()) {
      const recordDate = record.dateCreated.slice(0, 10).replace(/-/g, '');
      if (recordDate === dateStr) {
        count++;
      }
    }
    return count;
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
 * Singleton instance of ContactStore
 */
export const contactStore = new ContactStore();
