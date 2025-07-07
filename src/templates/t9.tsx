import { InvDB, BizDB, InvItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export const t9 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BizDB>,
    oInvItemList: Partial<InvItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf"
) => {
    const bodyContent = `
    <div class="wrapper">
      <header>
        ${oBiz.biz_logo64 ? `<img src="${oBiz.biz_logo64}" alt="Logo" class="logo" />` : ""}
        <h1>${oInv.biz_name || "Your Company"}</h1>
      </header>

      <section class="invoice-summary">
        <div>
          <h2>Invoice</h2>
          <p><strong>No:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
          <p><strong>Date:</strong> ${formatDateForUI(oInv.inv_date)}</p>
          <p><strong>Due:</strong> ${formatDateForUI(oInv.inv_due_date)}</p>
        </div>
        <div>
          <h3>Bill To:</h3>
          <p>
            ${oInv.client_company_name || "Client Company Name"}<br />
            ${oInv.client_address || "Client Address"}
          </p>
        </div>
      </section>

      <table class="item-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${oInvItemList
            .map(
                (item, i) => `
            <tr class="${i % 2 === 0 ? "even" : "odd"}">
              <td>${item.item_name}</td>
              <td>${item.item_quantity}</td>
              <td>$${Number(item.item_rate).toFixed(2)}</td>
              <td>$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <section class="totals">
        <table>
          <tr><td>Subtotal:</td><td>$${Number(oInv.inv_subtotal).toFixed(2)}</td></tr>
          <tr><td>Tax:</td><td>$${Number(oInv.inv_tax_amount).toFixed(2)}</td></tr>
          <tr class="grand-total"><td><strong>Total:</strong></td><td><strong>$${Number(oInv.inv_total).toFixed(2)}</strong></td></tr>
          <tr class="balance"><td><strong>Balance Due:</strong></td><td><strong>$${Number(oInv.inv_balance_due).toFixed(2)}</strong></td></tr>
        </table>
      </section>

      ${oInv.inv_notes
            ? `<section class="notes"><h4>Notes</h4><p>${oInv.inv_notes.replace(/\n/g, "<br/>")}</p></section>`
            : ""
        }

      <footer>
        ${oInv.inv_terms_conditions || "Thank you for your business!"}
      </footer>
    </div>
  `;

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f6f8fb;
            color: #333;
          }

          .wrapper {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
          }

          header {
            text-align: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .logo {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50%;
            margin-bottom: 10px;
          }

          h1 {
            margin: 5px 0;
            font-size: 24px;
          }

          .invoice-summary {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 30px;
          }

          .invoice-summary div {
            flex: 1;
          }

          .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }

          .item-table th {
            background-color: #444;
            color: white;
            padding: 10px;
            text-align: left;
          }

          .item-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }

          .item-table tr.even {
            background-color: #f9f9f9;
          }

          .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }

          .totals table {
            width: 300px;
          }

          .totals td {
            padding: 6px 0;
            text-align: right;
          }

          .grand-total {
            font-weight: bold;
            background-color: #e7f3ff;
          }

          .balance {
            font-weight: bold;
            color: #d9534f;
          }

          .notes {
            border-top: 1px dashed #ccc;
            padding-top: 20px;
            margin-top: 20px;
          }

          footer {
            text-align: center;
            color: #888;
            font-style: italic;
            font-size: 14px;
            margin-top: 40px;
          }
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
    </html>
  `;
};
