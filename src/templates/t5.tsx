import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { date2string,  } from "@/src/utils/dateUtils";

// Template t5: Elegant Accent
export const t5 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>, 
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const bodyContent = `
  <div style="font-family: 'Playfair Display', serif; padding: 50px; background: #fff7f0; color: #3a3a3a;">
    <h1 style="text-align: center; font-size: 36px;">INVOICE</h1>
    <div style="text-align: center; margin-bottom: 30px;">
      <p>${oBiz.be_name}</p>
      <p>${oBiz.be_address || ""} | ${oBiz.be_phone || ""} | ${oBiz.be_email || ""}</p>
    </div>

    <div style="display: flex; justify-content: space-between;">
      <div>
        <h3>Bill To:</h3>
        <p>${(oInv as any)?.client_company_name || "Client"}<br/>${(oInv as any)?.client_address || "Address"}</p>
      </div>
      <div>
        <p><strong>Invoice No:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
        <p><strong>Date:</strong> ${date2string(oInv.inv_date)}</p>
        <p><strong>Due:</strong> ${date2string(oInv.inv_due_date)}</p>
      </div>
    </div>

    <table style="width: 100%; margin-top: 30px; border-collapse: collapse;">
      <thead style="background: #fae0d4;">
        <tr>
          <th style="padding: 10px;">Description</th>
          <th style="padding: 10px; text-align: right;">Qty</th>
          <th style="padding: 10px; text-align: right;">Rate</th>
          <th style="padding: 10px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${oInv!.inv_items!!.map(item => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${item.item_name}</td>
            <td style="padding: 10px; text-align: right;">${item.item_quantity}</td>
            <td style="padding: 10px; text-align: right;">$${Number(item.item_rate).toFixed(2)}</td>
            <td style="padding: 10px; text-align: right;">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="text-align: right; margin-top: 20px;">
      <p>Subtotal: $${Number(oInv.inv_subtotal).toFixed(2)}</p>
      <p>Discount: $${Number(oInv.inv_discount).toFixed(2)}</p>
      <p>Tax: $${Number(oInv.inv_tax_amount).toFixed(2)}</p>
      <h2>Total: $${Number(oInv.inv_total).toFixed(2)}</h2>
      <p>Paid: $${Number(oInv.inv_paid_total).toFixed(2)}</p>
      <h2>Balance Due: $${Number(oInv.inv_balance_due).toFixed(2)}</h2>
    </div>

    <footer style="text-align: center; margin-top: 40px; font-style: italic;">
      ${oInv.inv_tnc || "We appreciate your business."}
    </footer>
  </div>`;

    return `<!DOCTYPE html><html>
    <head><meta charset="UTF-8"
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
            <style>
                html, body {
                margin: 0;
                padding: 0;}
            </style>
    </head>
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
