import { InvDB, BizDB, InvItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

// Template t4: Dark Mode
export const t16 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BizDB>,
    oInvItemList: Partial<InvItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const bodyContent = `
  <div style="background: #aaa; color: #eee; font-family: 'Arial', sans-serif; padding: 40px;">
    <h1 style="border-bottom: 2px solid #444; padding-bottom: 10px;">Invoice</h1>
    <div style="display: flex; justify-content: space-between;">
      <div>
        <h2>${oBiz.biz_name}</h2>
        <p>${oBiz.biz_address || ""}<br/>${oBiz.biz_phone || ""}<br/>${oBiz.biz_email || ""}</p>
      </div>
      <div>
        <p><strong>No:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
        <p><strong>Date:</strong> ${formatDateForUI(oInv.inv_date)}</p>
        <p><strong>Due:</strong> ${formatDateForUI(oInv.inv_due_date)}</p>
      </div>
    </div>

    <h3 style="margin-top: 30px;">Bill To:</h3>
    <p>${oInv.client_company_name || "Client"}<br/>${oInv.client_address || "Address"}</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead style="background: #333;">
        <tr>
          <th style="padding: 10px; text-align: left; color: #fff;">Item</th>
          <th style="padding: 10px; text-align: right; color: #fff;">Qty</th>
          <th style="padding: 10px; text-align: right; color: #fff;">Rate</th>
          <th style="padding: 10px; text-align: right; color: #fff;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${oInvItemList.map(item => `
          <tr style="border-bottom: 1px solid #444;">
            <td style="padding: 10px;">${item.item_name}</td>
            <td style="text-align: right; padding: 10px;">${item.item_quantity}</td>
            <td style="text-align: right; padding: 10px;">$${Number(item.item_rate).toFixed(2)}</td>
            <td style="text-align: right; padding: 10px;">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="text-align: right; margin-top: 20px;">
      <p>Subtotal: $${Number(oInv.inv_subtotal).toFixed(2)}</p>
      <p>Discount: $${Number(oInv.inv_discount).toFixed(2)}</p>
      <p>Tax: $${Number(oInv.inv_tax_amount).toFixed(2)}</p>
      <h2>Total: $${Number(oInv.inv_total).toFixed(2)}</h2>
    </div>
  </div>`;

    return `<!DOCTYPE html><html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #aaa;
      }
    </style>
  </head>
  <body>
    ${
      previewMode === "pdf"
        ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
        : previewMode === "view"
        ? `<div style="transform: scale(0.5); transform-origin: top left; width: 200%;">${bodyContent}</div>`
        : `<div style="transform: scale(0.29); transform-origin: top left; width: 350%;">${bodyContent}</div>`
    }
  </body>
</html>`;
};


