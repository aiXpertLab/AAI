import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export const t10 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>,
    // oInv!.inv_items: Partial<ItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf"
) => {
    const bodyContent = `
    <div class="invoice-wrapper">
      <div class="card">
        <div class="header">
          ${oBiz.biz_logo64 ? `<img src="${oBiz.biz_logo64}" class="logo" alt="Logo"/>` : ""}
          <h1>${oBiz.be_name || "Your Company"}</h1>
          <p class="info">${oBiz.be_address || ""} | ${oBiz.be_email || ""} | ${oBiz.be_phone || ""}</p>
        </div>

        <div class="invoice-meta">
          <div>
            <h2>Invoice</h2>
            <p><strong>No:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
            <p><strong>Date:</strong> ${formatDateForUI(oInv.inv_date)}</p>
            <p><strong>Due:</strong> ${formatDateForUI(oInv.inv_due_date)}</p>
          </div>
          <div>
            <h3>Bill To:</h3>
            <p>${oInv.client_company_name || "Client Company Name"}<br/>${oInv.client_address || "Client Address"}</p>
          </div>
        </div>

        <table class="item-table">
          <thead>
            <tr>
              <th>Item</th><th>Qty</th><th>Rate</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${oInv!.inv_items
            .map(
                (item) => `
              <tr>
                <td>${item.item_name}</td>
                <td>${item.item_quantity}</td>
                <td>$${Number(item.item_rate).toFixed(2)}</td>
                <td>$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
              </tr>`
            )
            .join("")}
          </tbody>
        </table>

        <div class="summary">
          <table>
            <tr><td>Subtotal:</td><td>$${Number(oInv.inv_subtotal).toFixed(2)}</td></tr>
            <tr><td>Discount:</td><td>$${Number(oInv.inv_discount).toFixed(2)}</td></tr>
            <tr><td>Tax:</td><td>$${Number(oInv.inv_tax_amount).toFixed(2)}</td></tr>
            <tr class="total"><td>Total:</td><td>$${Number(oInv.inv_total).toFixed(2)}</td></tr>
            ${oInv.inv_paid_total != null
            ? `<tr><td>Paid:</td><td>$${Number(oInv.inv_paid_total).toFixed(2)}</td></tr>`
            : ""
        }
            <tr class="due"><td><strong>Balance Due:</strong></td><td><strong>$${Number(oInv.inv_balance_due).toFixed(2)}</strong></td></tr>
          </table>
        </div>

        ${oInv.inv_notes
            ? `<div class="notes"><h4>Notes</h4><p>${oInv.inv_notes.replace(/\n/g, "<br/>")}</p></div>`
            : ""
        }

        <footer>
          ${oInv.inv_terms_conditions || "Thank you for your business!"}
        </footer>
      </div>
    </div>
  `;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Georgia', serif;
          background: url('https://www.transparenttextures.com/patterns/cream-pixels.png'), #fcefee;
        }


        .card {
          background: rgba(255, 255, 255, 0);
          border-radius: 16px;
          padding: 40px;
          max-width: 800px;
          margin: auto;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .info {
          font-size: 14px;
          color: #777;
        }

        .invoice-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .invoice-meta h2, .invoice-meta h3 {
          margin-bottom: 5px;
        }

        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .item-table th {
          background: #eac8d8;
          color: #333;
          padding: 10px;
        }

        .item-table td {
          border-bottom: 1px solid #eee;
          padding: 10px;
        }

        .summary {
          display: flex;
          justify-content: flex-end;
        }

        .summary table {
          width: 280px;
        }

        .summary td {
          padding: 6px;
          text-align: right;
        }

        .summary .total td {
          font-weight: bold;
          background: #f6d1e2;
        }

        .summary .due td {
          color: #c0392b;
          font-weight: bold;
        }

        .notes {
          margin-top: 20px;
          font-size: 14px;
          line-height: 1.5;
        }

        footer {
          text-align: center;
          margin-top: 40px;
          color: #999;
          font-style: italic;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      ${previewMode === "pdf"
            ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
            : previewMode === "view"
                ? `<div style="transform: scale(0.5); transform-origin: top left; width: 200%;">${bodyContent}</div>`
                : `<div style="transform: scale(0.3); transform-origin: top left; width: 350%;">${bodyContent}</div>`
        }
    </body>
    </html>
  `;
};




