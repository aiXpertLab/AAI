import { InvDB, BE_DB, ItemDB, ClientDB } from "@/src/types";
import {date2string} from "@/src/utils/dateUtils"

export const t1 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>, 
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const paidStamp = (oInv.inv_payment_status === "Paid" || Number(oInv.inv_balance_due) === 0) && oBiz.be_show_paid_stamp
        ? `    <div class="paid-stamp">PAID</div>  `  : "";

    const bodyContent = `
    
  <div class="invoice-container">
    
    <div class="invoice-header">
      <div class="company-details" style="text-align: left;">
        ${oBiz.be_logo ? `
          <div class="logo-section" style="margin-bottom: 10px;">
            <img src="${oBiz.be_logo}" alt="Logo" class="logo"
              style="width: 150px; height: 100px; object-fit: cover; display: block;" />
          </div>` : ""
        }
        <h1 style="margin: 0;">${oBiz.be_name}</h1>
        <p style="margin: 5px 0;">
          ${oBiz.be_address || ""}<br/>
          ${oBiz.be_phone || ""}<br/>
          ${oBiz.be_email || ""}<br/>
          ${oBiz.be_biz_number || ""}
        </p>
      </div>
      <div class="invoice-info">
        <h2>Invoice</h2>
        <p><strong>No:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
        <p><strong>Date:</strong> ${date2string(oInv.inv_date)}</p>
        <p><strong>Due:</strong> ${date2string(oInv.inv_due_date)}</p>
        <p><strong>Terms:</strong> Net ${oInv.inv_payment_term || 7}</p>
      </div>
    </div>




    <div class="bill-section">
      <h3>Bill To:</h3>
      <p>
        ${(oInv as any)?.client_company_name || "Client Company Name"}<br />
        ${(oInv as any)?.client_address || "Client Address"}
      </p>
    </div>

    <table class="item-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${oInv!.inv_items!
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

    <div class="summary-section">
      <table>
        <tr>
          <td>Subtotal:</td>
          <td>$${Number(oInv.inv_subtotal).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Discount:</td>
          <td>$${Number(oInv.inv_discount).toFixed(2)}</td>
        </tr>
        <tr>
          <td>${oInv.inv_tax_label}:</td>
          <td>$${Number(oInv.inv_tax_amount).toFixed(2)}</td>
        </tr>
        <tr class="grand-total">
          <td><strong>Total:</strong></td>
          <td><strong>$${Number(oInv.inv_total).toFixed(2)}</strong></td>
        </tr>
        ${oInv.inv_paid_total != null
            ? `<tr><td>Paid:</td><td>$${Number(oInv.inv_paid_total).toFixed(2)}</td></tr>`
            : ""
        }
        <tr class="balance-due">
          <td><strong>Balance Due:</strong></td>
          <td><strong>$${Number(oInv.inv_balance_due).toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>

    ${oInv.inv_notes
            ? `<div class="notes-section"><h4>Notes</h4><p>${oInv.inv_notes.replace(/\n/g, "<br/>")}</p></div>`
            : ""
        }

    <footer class="invoice-footer">
      ${oInv.inv_tnc || "Thank you for your business!"}
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
          font-family: 'Helvetica Neue', sans-serif;
          background: #f9f9f9;
          margin: 0;
          padding: 0px;
        }

        .invoice-container {
          max-width: 900px;
          margin: auto;
          background: #ffffff;
          padding: 40px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #ddd;
          padding-bottom: 20px;
        }

        .logo-section .logo {
          max-height: 60px;
        }

        .company-details {
          flex: 1;
          padding: 0 20px;
        }

        .invoice-info {
          text-align: right;
        }

        .bill-section {
          margin-top: 30px;
        }

        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }

        .item-table th, .item-table td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
        }

        .item-table th {
          background-color: #333;
          color: #fff;
        }

        .summary-section {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
        }

        .summary-section table {
          width: 300px;
          border-collapse: collapse;
        }

        .summary-section td {
          padding: 8px;
          text-align: right;
        }

        .grand-total td {
          background: #f0f0f0;
          font-weight: bold;
        }

        .balance-due td {
          color: #d9534f;
          font-weight: bold;
        }

        .notes-section {
          margin-top: 30px;
        }
.paid-stamp {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
  font-size: 88px;
  font-weight: bold;
  color: rgba(255, 0, 0, 0.25);
  border: 8px solid rgba(255, 0, 0, 0.3);
  padding: 15px 30px;
  border-radius: 15px;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 9999;
}

        .invoice-footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-style: italic;
        }
      </style>
    </head>
    <body>
    ${paidStamp}
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