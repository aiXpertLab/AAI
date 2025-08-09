import { BE_DB, InvDB, ItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export const t3 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>,
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const bodyContent = `
  <div class="invoice-wrapper">
    <header class="invoice-header">
      <div class="header-left">
        <h1>${oBiz.be_name}</h1>
        <p>
          ${oBiz.be_address}<br />
          ${oBiz.be_phone}<br />
          ${oBiz.be_email}<br />
          ${oBiz.be_biz_number}
        </p>
      </div>
      <div class="header-right">
        <h2>INVOICE</h2>
        <p><strong>No:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
        <p><strong>Date:</strong> ${formatDateForUI(oInv.inv_date)}</p>
        <p><strong>Due:</strong> ${formatDateForUI(oInv.inv_due_date)}</p>
        <p><strong>Terms:</strong> Net ${oInv.inv_payment_term || 7}</p>
      </div>
    </header>

    <section class="bill-to">
      <h3>Bill To</h3>
      <p>
        ${oInv.client_company_name || "Client Company Name"}<br />
        ${oInv.client_address || "Client Address"}
      </p>
    </section>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${oInv!.inv_items
            .map(
                (item) => `
          <tr>
            <td>${item.item_name}</td>
            <td>${item.item_quantity}</td>
            <td>$${Number(item.item_rate).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                })}</td>
            <td>$${(
                        (item.item_quantity ?? 0) * (item.item_rate ?? 0)
                    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
        `
            )
            .join("")}
      </tbody>
    </table>

    <section class="totals">
      <div class="totals-right">
        <table>
          <tr>
            <td>Subtotal</td>
            <td>$${Number(oInv.inv_subtotal).toLocaleString(undefined, {
                minimumFractionDigits: 2,
            })}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td>$${Number(oInv.inv_discount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
            })}</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td>$${Number(oInv.inv_tax_amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
            })}</td>
          </tr>
          <tr class="grand-total">
            <td>Total</td>
            <td>$${Number(oInv.inv_total).toLocaleString(undefined, {
                minimumFractionDigits: 2,
            })}</td>
          </tr>
          ${oInv.inv_paid_total != null
            ? `
          <tr>
            <td>Paid</td>
            <td>$${Number(oInv.inv_paid_total).toLocaleString(undefined, {
                minimumFractionDigits: 2,
            })}</td>
          </tr>`
            : ""
        }
          <tr class="balance">
            <td>Balance Due</td>
            <td>$${Number(oInv.inv_balance_due).toLocaleString(undefined, {
            minimumFractionDigits: 2,
        })}</td>
          </tr>
        </table>
      </div>
    </section>

    <section class="notes">
      <h4>Notes</h4>
      <p>${oInv.inv_notes?.replace(/\n/g, "<br>") || ""}</p>
    </section>

    <footer class="footer">
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
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          margin: 10;
          padding: 0;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }

        .invoice-header h1 {
          margin: 0;
          color: #444;
        }

        .invoice-header h2 {
          margin: 0;
          color: #ff5e57;
        }

        .bill-to {
          margin-top: 30px;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }

        .invoice-table th {
          background: #ff5e57;
          color: #fff;
          padding: 10px;
        }

        .invoice-table td {
          border: 1px solid #ddd;
          padding: 10px;
        }

        .totals {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
        }

        .totals table td {
          padding: 8px 20px;
        }

        .totals .grand-total td {
          font-weight: bold;
          background: #f0f0f0;
        }

        .totals .balance td {
          font-weight: bold;
          color: #d9534f;
        }

        .notes {
          margin-top: 40px;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          font-style: italic;
          color: #888;
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
