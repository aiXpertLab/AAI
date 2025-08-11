import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export const t15 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>, oClient: Partial<ClientDB>,
    // oInv!.inv_items: Partial<ItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const bodyContent = `
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-details" style="text-align: left;">
        <h1 style="margin: 0;">${oBiz.biz_name || "Company Name"}</h1>
        <p style="margin: 5px 0;">
          ${oBiz.biz_address || "455 Foggy Heights, AZ 85004, US"}<br/>
          ${oBiz.biz_phone || "1 (602) 519-0450.1"}<br/>
          ${oBiz.biz_email || "company@example.com"}
        </p>
      </div>
      <div class="invoice-info">
        <h2>INVOICE</h2>
        <p><strong>No:</strong> ${oInv.inv_number || "3-2-1"}</p>
        <p><strong>Date:</strong> ${formatDateForUI(oInv.inv_date || "01/06/2014")}</p>
        <p><strong>Due:</strong> ${formatDateForUI(oInv.inv_due_date || "30/06/2014")}</p>
      </div>
    </div>

    <div class="bill-section">
      <h3>INVOICE TO:</h3>
      <p>
        ${oClient?.client_company_name || "John Doe"}<br />
        ${oClient?.client_address || "796 Silver Harbour, TX 79273, US"}<br />
        ${oInv.client_email || "john@example.com"}
      </p>
    </div>

    <table class="item-table">
      <thead>
        <tr>
          <th>DESCRIPTION</th>
          <th>QUANTITY</th>
          <th>UNIT PRICE</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${oInv!.inv_items
            .map(
                (item) => `
          <tr>
            <td>${item.item_name || "Service Item"}</td>
            <td>${item.item_quantity || 0}</td>
            <td>$${Number(item.item_rate || 0).toFixed(2)}</td>
            <td>$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
          </tr>`
            )
            .join("")}
      </tbody>
    </table>

    <div class="summary-section">
      <table>
        <tr>
          <td>SUBTOTAL:</td>
          <td>$${Number(oInv.inv_subtotal || 5200).toFixed(2)}</td>
        </tr>
        <tr>
          <td>AX 25%:</td>
          <td>$${Number(oInv.inv_tax_amount || 1300).toFixed(2)}</td>
        </tr>
        <tr class="grand-total">
          <td><strong>GRAND TOTAL:</strong></td>
          <td><strong>$${Number(oInv.inv_total || 6500).toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="notes-section">
      <p>Thank you!</p>
      <p><strong>NOTICE:</strong><br/>
      A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
      <p>Invoice was created on a computer and is valid without the signature and seal.</p>
    </div>
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
          margin-bottom: 20px;
        }

        .company-details {
          flex: 1;
        }

        .invoice-info {
          text-align: right;
        }

        .bill-section {
          margin: 20px 0;
        }

        .bill-section h3 {
          margin-bottom: 5px;
        }

        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .item-table th, .item-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        .item-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .summary-section {
          margin-top: 20px;
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
          font-weight: bold;
          border-top: 2px solid #000;
        }

        .notes-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }

        .notes-section p {
          margin: 5px 0;
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