import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

// Template t12: Classic Styled Invoice (based on original HTML/CSS)
export const t12 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>,
    // oInv!.inv_items: Partial<ItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf"
) => {
    const bodyContent = `
  <div style="font-family: 'Open Sans', sans-serif; background: #fff; width: 8.5in; height: 11in; padding: 0.5in; box-shadow: 0 0 1in -0.25in rgba(0,0,0,0.5);">
    <header style="margin-bottom: 3em;">
      <h1 style="background: #000; color: #fff; padding: 0.5em 0; margin-bottom: 1em; text-align: center; letter-spacing: 0.5em;">Invoice</h1>
      <div style="display: flex; justify-content: space-between;">
        <address style="font-size: 75%; line-height: 1.25;">
          <p>${oBiz.biz_name || "Business Name"}</p>
          <p>${oBiz.biz_address || "Business Address"}</p>
          <p>${oBiz.biz_phone || "(000) 000-0000"}</p>
        </address>
        <div>
          <img src="${oBiz.biz_logo || "http://www.jonathantneal.com/examples/invoice/logo.png"}" style="max-width: 150px; max-height: 80px;" />
        </div>
      </div>
    </header>

    <article>
      <section style="margin-bottom: 3em;">
        <h2 style="font-size: 16px; font-weight: bold;">Bill To:</h2>
        <address style="font-size: 125%; font-weight: bold;">
          <p>${oInv.client_company_name || "Client Company"}</p>
          <p>${oInv.client_address || "Client Address"}</p>
        </address>
      </section>

      <table style="font-size: 75%; width: 100%; margin-bottom: 3em; border-collapse: separate; border-spacing: 2px;">
        <tr>
          <th style="background: #eee; border: 1px solid #bbb; padding: 0.5em;">Invoice #</th>
          <td style="border: 1px solid #ddd; padding: 0.5em;">${oInv.inv_number || "INV-XXXX"}</td>
        </tr>
        <tr>
          <th style="background: #eee; border: 1px solid #bbb; padding: 0.5em;">Date</th>
          <td style="border: 1px solid #ddd; padding: 0.5em;">${formatDateForUI(oInv.inv_date)}</td>
        </tr>
        <tr>
          <th style="background: #eee; border: 1px solid #bbb; padding: 0.5em;">Amount Due</th>
          <td style="border: 1px solid #ddd; padding: 0.5em;">$${Number(oInv.inv_total).toFixed(2)}</td>
        </tr>
      </table>

      <table style="font-size: 75%; width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #eee;">
            <th style="border: 1px solid #bbb; padding: 0.5em;">Item</th>
            <th style="border: 1px solid #bbb; padding: 0.5em;">Description</th>
            <th style="border: 1px solid #bbb; padding: 0.5em; text-align: right;">Rate</th>
            <th style="border: 1px solid #bbb; padding: 0.5em; text-align: right;">Quantity</th>
            <th style="border: 1px solid #bbb; padding: 0.5em; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${oInv!.inv_items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 0.5em;">${item.item_name || ""}</td>
              <td style="border: 1px solid #ddd; padding: 0.5em;">${item.item_description || ""}</td>
              <td style="border: 1px solid #ddd; padding: 0.5em; text-align: right;">$${Number(item.item_rate ?? 0).toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 0.5em; text-align: right;">${item.item_quantity ?? 0}</td>
              <td style="border: 1px solid #ddd; padding: 0.5em; text-align: right;">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <table style="font-size: 75%; width: 36%; float: right; border-collapse: collapse;">
        <tr>
          <th style="padding: 0.5em;">Subtotal</th>
          <td style="padding: 0.5em; text-align: right;">$${Number(oInv.inv_subtotal).toFixed(2)}</td>
        </tr>
        <tr>
          <th style="padding: 0.5em;">Discount</th>
          <td style="padding: 0.5em; text-align: right;">$${Number(oInv.inv_discount).toFixed(2)}</td>
        </tr>
        <tr>
          <th style="padding: 0.5em;">Tax</th>
          <td style="padding: 0.5em; text-align: right;">$${Number(oInv.inv_tax_amount).toFixed(2)}</td>
        </tr>
        <tr>
          <th style="padding: 0.5em;">Total</th>
          <td style="padding: 0.5em; text-align: right;"><strong>$${Number(oInv.inv_total).toFixed(2)}</strong></td>
        </tr>
      </table>
    </article>

    <aside style="margin-top: 3em;">
      <h2 style="font-size: 14px; margin-bottom: 0.5em;">Additional Notes</h2>
      <p>${oInv.inv_notes || "A finance charge of 1.5% will be made on unpaid balances after 30 days."}</p>
    </aside>
  </div>
  `;

    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
    body { margin: 0; padding: 0; background: #e1e1e1; }
    div, p, a, li, td { -webkit-text-size-adjust: none; }
    .ReadMsgBody, .ExternalClass { width: 100%; background-color: #ffffff; }
    html, body { width: 100%; height: 100%; background-color: #e1e1e1; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    p { padding: 0 !important; margin: 0 !important; }
    .visibleMobile { display: none; }
    .hiddenMobile { display: block; }
    @media only screen and (max-width: 600px) {
      body { width: auto !important; }
      table[class=fullTable] { width: 96% !important; clear: both; }
      table[class=fullPadding] { width: 85% !important; clear: both; }
      table[class=col] { width: 45% !important; }
      .erase { display: none; }
    }
    @media only screen and (max-width: 420px) {
      table[class=fullTable] { width: 100% !important; clear: both; }
      table[class=fullPadding] { width: 85% !important; clear: both; }
      table[class=col] { width: 100% !important; clear: both; }
      table[class=col] td { text-align: left !important; }
      .erase { display: none; font-size: 0; max-height: 0; line-height: 0; padding: 0; }
      .visibleMobile { display: block !important; }
      .hiddenMobile { display: none !important; }
    }
  </style>
      </head>
      <body style="margin: 0;">
        ${previewMode === "pdf"
            ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
            : previewMode === "view"
                ? `<div style="transform: scale(0.5); transform-origin: top left; width: 200%;">${bodyContent}</div>`
                : `<div style="transform: scale(0.19); transform-origin: top left; width: 350%;">${bodyContent}</div>`
        }
      </body>
    </html>`;
};
