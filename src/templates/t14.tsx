import { InvDB, BE_DB, InvItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export const t14 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>,
    oInvItemList: Partial<InvItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf"
) => {
    const bodyContent = `
  <header class="clearfix">
<div id="logo" style="text-align: center;">
  ${oBiz.biz_logo64 ? `
    <div class="logo" style="margin-bottom: 10px;">
      <img src="${oBiz.biz_logo64}" alt="Logo" class="logo"
        style="width: 150px; height: 100px; object-fit: cover; display: block; margin: 0 auto;" />
    </div>` : ""
  }
</div>
    <h1>${oInv.inv_number || "INVOICE 3-2-1"}</h1>
    <div id="company" class="clearfix">
      <div>${oInv.biz_name || "Company Name"}</div>
      <div>${oInv.biz_address || "455 Foggy Heights, AZ 85004, US"}</div>
      <div>${oInv.biz_phone || "(602) 519-0450"}</div>
      <div><a href="mailto:${oInv.biz_email || "company@example.com"}">${oInv.biz_email || "company@example.com"}</a></div>
    </div>
    <div id="project">
      <div><span>PROJECT</span> ${oInv.inv_title || "Website development"}</div>
      <div><span>CLIENT</span> ${oInv.client_company_name || "John Doe"}</div>
      <div><span>ADDRESS</span> ${oInv.client_address || "796 Silver Harbour, TX 79273, US"}</div>
      <div><span>EMAIL</span> <a href="mailto:${oInv.client_email || "john@example.com"}">${oInv.client_email || "john@example.com"}</a></div>
      <div><span>DATE</span> ${formatDateForUI(oInv.inv_date)}</div>
      <div><span>DUE DATE</span> ${formatDateForUI(oInv.inv_due_date)}</div>
    </div>
  </header>
  <main>
    <table>
      <thead>
        <tr>
          <th class="service">SERVICE</th>
          <th class="desc">DESCRIPTION</th>
          <th>PRICE</th>
          <th>QTY</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${oInvItemList
            .map(
                (item) => `
          <tr>
            <td class="service">${item.item_name || ""}</td>
            <td class="desc">${item.item_description || ""}</td>
            <td class="unit">$${Number(item.item_rate || 0).toFixed(2)}</td>
            <td class="qty">${item.item_quantity || 0}</td>
            <td class="total">$${((item.item_rate ?? 0) * (item.item_quantity ?? 0)).toFixed(2)}</td>
          </tr>`
            )
            .join("")}
        <tr>
          <td colspan="4">SUBTOTAL</td>
          <td class="total">$${Number(oInv.inv_subtotal || 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="4">TAX ${oInv.inv_tax_rate || 25}%</td>
          <td class="total">$${Number(oInv.inv_tax || 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="4" class="grand total">GRAND TOTAL</td>
          <td class="grand total">$${Number(oInv.inv_total || 0).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    <div id="notices">
      <div>NOTICE:</div>
      <div class="notice">${oInv.inv_terms_conditions || "A finance charge of 1.5% will be made on unpaid balances after 30 days."}</div>
    </div>
  </main>
  <footer>
    Invoice was created on a computer and is valid without the signature and seal.
  </footer>`;

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      .clearfix:after { content: ""; display: table; clear: both; }
      a { color: #5D6975; text-decoration: underline; }
      body {
        position: relative;
        width: 21cm;
        height: 29.7cm;
        margin: 0 auto;
        color: #001028;
        background: #FFFFFF;
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      header {
        padding: 10px 0;
        margin-bottom: 30px;
      }
      
      #logo {
        text-align: center;
        margin-bottom: 10px;
      }
      #logo img { width: 200px; height: 60px; }

      h1 {
        border-top: 1px solid  #5D6975;
        border-bottom: 1px solid  #5D6975;
        color: #5D6975;
        font-size: 2.4em;
        line-height: 1.4em;
        font-weight: normal;
        text-align: center;
        margin: 0 0 20px 0;
        background: url('dimension.png');
      }
      #project { float: left; }
      #project span {
        color: #5D6975;
        text-align: right;
        width: 52px;
        margin-right: 10px;
        display: inline-block;
        font-size: 0.8em;
      }
      #company { float: right; text-align: right; }
      #project div, #company div { white-space: nowrap; }
      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 20px;
      }
      table tr:nth-child(2n-1) td { background: #F5F5F5; }
      table th, table td { text-align: center; }
      table th {
        padding: 5px 20px;
        color: #5D6975;
        border-bottom: 1px solid #C1CED9;
        white-space: nowrap;
        font-weight: normal;
      }
      table .service, table .desc { text-align: left; }
      table td {
        padding: 20px;
        text-align: right;
      }
      table td.service, table td.desc { vertical-align: top; }
      table td.unit, table td.qty, table td.total { font-size: 1.2em; }
      table td.grand { border-top: 1px solid #5D6975; }
      #notices .notice {
        color: #5D6975;
        font-size: 1.2em;
      }
      footer {
        color: #5D6975;
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0;
        border-top: 1px solid #C1CED9;
        padding: 8px 0;
        text-align: center;
      }
    </style>
  </head>
  <body>
    ${previewMode === "pdf"
            ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
            : previewMode === "view"
                ? `<div style="transform: scale(0.53); transform-origin: top left; width: 80%;">${bodyContent}</div>`
                : `<div style="transform: scale(0.36); transform-origin: top left; width: 50%;">${bodyContent}</div>`
        }
  </body>
  </html>`;
};
