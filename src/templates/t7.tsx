import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { date2string } from "@/src/utils/dateUtils";

// Template t2: Modern Minimal
export const t7 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>,
    // oInv!.inv_items: Partial<ItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const bodyContent = `
  <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #333;">
    <header style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 32px;">Invoice</h1>
      <p style="margin: 4px 0; font-size: 14px;">No: ${oInv.inv_number || "INV-XXXX"}</p>
      <p style="margin: 4px 0; font-size: 14px;">Date: ${date2string(oInv.inv_date)}</p>
      <p style="margin: 4px 0; font-size: 14px;">Due: ${date2string(oInv.inv_due_date)}</p>
    </header>

    <section>
      <h2 style="font-size: 18px; margin-bottom: 5px;">Bill To:</h2>
      <p style="margin: 0;">${(oInv as any)?.client_company_name || "Client Name"}</p>
      <p style="margin: 0;">${(oInv as any)?.client_address || "Client Address"}</p>
    </section>

    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <thead>
        <tr style="background: #f9f9f9;">
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Description</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Qty</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Rate</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${oInv!.inv_items!.map(item => `
          <tr>
            <td style="padding: 8px;">${item.item_name}</td>
            <td style="text-align: right; padding: 8px;">${item.item_quantity}</td>
            <td style="text-align: right; padding: 8px;">$${Number(item.item_rate).toFixed(2)}</td>
            <td style="text-align: right; padding: 8px;">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="margin-top: 20px; text-align: right;">
      <p>Subtotal: $${Number(oInv.inv_subtotal).toFixed(2)}</p>
      <p>Discount: $${Number(oInv.inv_discount).toFixed(2)}</p>
      <p>Tax: $${Number(oInv.inv_tax_amount).toFixed(2)}</p>
      <h3>Total: $${Number(oInv.inv_total).toFixed(2)}</h3>
    </div>
  </div>`;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body>
        ${previewMode === "pdf"
            ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
            : previewMode === "view"
                ? `<div style="transform: scale(0.5); transform-origin: top left; width: 200%;">${bodyContent}</div>`
                : `<div style="transform: scale(0.29); transform-origin: top left; width: 350%;">${bodyContent}</div>`
        }
    </body>

    </html>`;
};


