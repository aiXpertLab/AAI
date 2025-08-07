// src/db/saveInvoiceAndItems.ts
import { insertInvoice } from "./crud_invoices";
import { ItemUI } from "@/src/types";

export const saveInvoiceAndItems = async (db: any, invoice: any, items: ItemUI[]) => {
  try {
    // 1. Calculate subtotal and total
    const subtotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity?.toString() ?? "1");
      const price = parseFloat(item.item_unit_price ?? "0");
      return sum + quantity * price;
    }, 0);

    // Add subtotal + total into invoice object
    const invoiceToSave = {
      ...invoice,
      inv_subtotal: subtotal,
      inv_total: subtotal, // Modify if taxes/discounts added later
    };

    // 2. Insert invoice
    const result = await insertInvoice(db, invoiceToSave);
    const invId = result.lastInsertRowId || result.insertId;
    if (!invId) throw new Error("Failed to retrieve invoice ID after insert");

    // 3. Insert items into inv_items table
    for (const item of items) {
      const quantity = parseFloat(item.quantity?.toString() ?? "1");
      const unitPrice = parseFloat(item.item_unit_price ?? "0");
      const amount = quantity * unitPrice;

      await db.runAsync(
        `INSERT INTO inv_items (
          inv_id, item_id, item_name, item_description,
          item_quantity, item_unit_price, item_amount,
          item_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        invId,
        item.id,
        item.item_name,
        item.item_description ?? '',
        quantity,
        unitPrice,
        amount
      );
    }

    return invId;
  } catch (error) {
    console.error("saveInvoiceAndItems error:", error);
    throw error;
  }
};
