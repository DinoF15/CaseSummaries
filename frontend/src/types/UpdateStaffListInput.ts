// src/types/StaffListInput.ts

/**
 * Represents the input required to update a staff record.
 */
export interface UpdateStaffListInput {
    id: string;           // The unique identifier for the staff member (required)
    name?: string;        // The staff member's name (optional – only include if updating)
    createdAt?: string;   // (Optional) The creation timestamp (usually not updated)
    updatedAt?: string;   // The updated timestamp (set this to the current time when updating)
  }
  