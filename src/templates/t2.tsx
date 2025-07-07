import { InvDB, InvItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export function t2(
    oInv: Partial<InvDB>,
    oInvItemList: Partial<InvItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf",
): string {
    const bodyContent = `
    <!-- Green background section -->
    <div class="header-bg">
      <div class="invoice-banner">
        <div class="company-info">
          <p><strong>${oInv.biz_name}</strong><br>
          ${oInv.biz_address?.replace(/\n/g, "<br>")}<br>
          ${oInv.biz_phone}<br>
          ${oInv.biz_email}<br>
          ${oInv.biz_biz_number}</p>
        </div>
        <div class="invoice-label">INVOICE</div>
      </div>
    </div>

    <!-- Divider (green line) -->
    <div class="green-divider"></div>

    <!-- White invoice content -->
    <div class="container">
      <div class="section" style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
          <strong>INVOICE TO</strong><br>
          ${oInv.client_company_name || 'Client Company Name'}<br>
          ${(oInv.client_address || 'Client Address').replace(/\n/g, "<br>")}<br>
        </div>
        <div style="width: 48%;">
          <strong>INVOICE #</strong>: ${oInv.inv_number || 'INV-Number'}<br>
          <strong>DATE</strong>: ${formatDateForUI(oInv.inv_date) || 'Issue Date'}<br>
          <strong>DUE DATE</strong>: ${formatDateForUI(oInv.inv_due_date) || 'Due Date'}<br>
          <strong>TERMS</strong>: Net ${oInv.inv_payment_term || '7'}<br>
        </div>
      </div>



        <table>
        <tr>
            <th style="width: 55%;">Description</th>
            <th style="width: 15%; text-align: right;">QTY</th>
            <th style="width: 15%; text-align: right;">RATE</th>
            <th style="width: 15%; text-align: right;">AMOUNT</th>
        </tr>
        ${oInvItemList.map(item => `
            <tr>
                <td style="word-wrap: break-word;">${item.item_name}</td>
                <td style="text-align: right;">${item.item_quantity}</td>
                <td style="text-align: right;">${Number(item.item_rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style="text-align: right;">$${(item.item_quantity! * item.item_rate!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
        `).join('')}
        </table>



      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;" />

      <div class="section" style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 30px;">
        <!-- Message Box on the Left -->
        <div style="width: 50%; padding-top: 0;">
          <div class="message-box">
            <strong style="margin-top: 0;">MESSAGE</strong><br>
            ${oInv.inv_notes?.replace(/\n/g, '<br>') || ''}
          </div>
        </div>

        <!-- Totals Table on the Right -->
        <div style="width: 35%; margin-top: 0; padding-top: 0;">
          <table style="margin-top: 0; border-collapse: collapse;">
            <tr class="totals" style="vertical-align: top;">
              <td colspan="2" class="right">SUBTOTAL</td>
              
              
              <td class="right">$${Number(oInv.inv_subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colspan="2" class="right">DISCOUNT</td>
              
              <td class="right">$${Number(oInv.inv_discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              
            </tr>
            <tr>
              <td colspan="2" class="right">TAX</td>
              
              <td class="right">$${Number(oInv.inv_tax_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            
            <tr class="totals">
                <td colspan="2" class="right">TOTAL</td>
                <td class="right">$${Number(oInv.inv_total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>

            ${oInv.inv_paid_total != null ? `
                <tr>
                    <td colspan="2" class="right">PAID TOTAL</td>
                    
                    <td class="right">$${Number(oInv.inv_paid_total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                ` : ""}

            <tr class="totals">
              <td colspan="2" class="right">BALANCE DUE</td>
              
              <td class="right">$${Number(oInv.inv_balance_due).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </table>
        </div>
      </div>
        <div class="footer">
            ${(oInv.inv_terms_conditions || 'Thank you for your business!').replace(/\n/g, "<br>")}
        </div>
    </div>
  `;

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
    
          body {
            margin: 0;
            padding: 0;
            background: #f9f9f9;
          }

          .header-bg {
            background-color: #d4e0c4;
            padding: 20px 40px 0 40px;
            width: 100vw;
            box-sizing: border-box;
          }

.preview-scale-container {
  position: relative;
}

.preview-scale-container .header-bg {
  width: 100%;
  box-sizing: border-box;
}
  
          .green-divider {
            height: 4px;
            background-color: #36b452;
            width: 100%;
          }

          .container {
            background: white;
            max-width: 750px;
            margin: 0 auto;
            padding: 16px;
          }

          .invoice-banner {
            display: flex;
            justify-content: space-between;
            padding: 0px 10px;
          }

          .company-info {
            font-size: 13px;
            line-height: 1.5;
          }

          .invoice-label {
            font-size: 48px;
            font-weight: bold;
            color: white;
            align-self: flex-start;
          }

          .section {
            margin-top: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          table th {
            background-color: #228b22;
            color: white;
            text-align: left;
            padding: 10px;
            border: none;
          }

          table td {
            padding: 10px;
            border: none;
          }

          .right {
            text-align: right;
          }

          .totals td {
            font-weight: bold;
            padding-top: 0; /* Remove padding from first row */
            vertical-align: top; /* Align to top */
          }


        table tr td {
        padding: 6px 0 !important;
        }

          .message-box {
            border: 1px solid #999;
            padding: 10px; /* Space above text */
            font-size: 12px;
            width: 100%;
            }

          .footer {
            margin-top: 40px;
            font-size: 14px;
            text-align: center;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${previewMode === "pdf"
            ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
            : previewMode === "view"
                ? `<div class="preview-scale-container" style="transform: scale(0.5); transform-origin: top left; width: 200%;">${bodyContent}</div>`
                : `<div class="preview-scale-container" style="transform: scale(0.25); transform-origin: top left; width: 400%;">${bodyContent}</div>`
        }
</body>
    </html>
  `;
};


