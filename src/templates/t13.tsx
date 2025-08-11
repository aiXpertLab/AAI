import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { formatDateForUI } from "@/src/utils/dateUtils";

export const t13 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>, oClient: Partial<ClientDB>,
    // oInv!.inv_items: Partial<ItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf"
) => {
    const bodyContent = `
  <header class="clearfix">
    <div id="logo">
      ${oBiz.be_logo ? `<img src="${oBiz.be_logo}">` : ""}
    </div>
    <div id="company">
      <h2 class="name">${oBiz.be_name || "Company Name"}</h2>
      <div>${oBiz.be_address || "455 Foggy Heights, AZ 85004, US"}</div>
      <div>${oBiz.be_phone || "(602) 519-0450"}</div>
      <div><a href="mailto:${oBiz.be_email || "company@example.com"}">${oBiz.be_email || "company@example.com"}</a></div>
    </div>
  </header>
  <main>
    <div id="details" class="clearfix">
      <div id="client">
        <div class="to">INVOICE TO:</div>
        <h2 class="name">${oClient?.client_company_name || "John Doe"}</h2>
        <div class="address">${oClient?.client_address || "796 Silver Harbour, TX 79273, US"}</div>
        <div class="email"><a href="mailto:${oInv.client_email || "john@example.com"}">${oInv.client_email || "john@example.com"}</a></div>
      </div>
      <div id="invoice">
        <h1>${oInv.inv_number || "INVOICE 3-2-1"}</h1>
        <div class="date">Date of Invoice: ${formatDateForUI(oInv.inv_date)}</div>
        <div class="date">Due Date: ${formatDateForUI(oInv.inv_due_date)}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th class="no">#</th>
          <th class="desc">DESCRIPTION</th>
          <th class="unit">UNIT PRICE</th>
          <th class="qty">QUANTITY</th>
          <th class="total">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${oInv!.inv_items
            .map(
                (item, i) => `
            <tr>
              <td class="no">${String(i + 1).padStart(2, "0")}</td>
              <td class="desc"><h3>${item.item_name || ""}</h3>${item.item_description || ""}</td>
              <td class="unit">$${Number(item.item_rate || 0).toFixed(2)}</td>
              <td class="qty">${item.item_quantity || 0}</td>
              <td class="total">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
            </tr>`
            )
            .join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">SUBTOTAL</td>
          <td>$${Number(oInv.inv_subtotal || 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">TAX</td>
          <td>$${Number(oInv.inv_tax_amount || 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">GRAND TOTAL</td>
          <td>$${Number(oInv.inv_total || 0).toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
    <div id="thanks">Thank you!</div>
    <div id="notices">
      <div>NOTICE:</div>
      <div class="notice">${oInv.inv_tnc || "A finance charge of 1.5% will be made on unpaid balances after 30 days."}</div>
    </div>
  </main>
  <footer>
    Invoice was created on a computer and is valid without the signature and seal.
  </footer>
  `;

    return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        body {
          position: relative;
          width: 21cm;
          height: 29.7cm;
          margin: 10 auto;
          color: #555555;
          background: #FFFFFF;
          font-family: SourceSansPro, Arial, sans-serif;
          font-size: 14px;
        }
        @font-face {
          font-family: SourceSansPro;
          src: url(SourceSansPro-Regular.ttf);
        }
        .clearfix:after { content: ""; display: table; clear: both; }
        a { color: #0087C3; text-decoration: none; }
        header {
          padding: 10px 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #AAAAAA;
        }
        #logo { float: left; margin-top: 8px; }
        #logo img { height: 70px; }
        #company { float: right; text-align: right; }
        #details { margin-bottom: 50px; }
        #client {
          padding-left: 6px;
          border-left: 6px solid #0087C3;
          float: left;
        }
        #client .to { color: #777777; }
        h2.name {
          font-size: 1.4em;
          font-weight: normal;
          margin: 0;
        }
        #invoice { float: right; text-align: right; }
        #invoice h1 {
          color: #0087C3;
          font-size: 2.4em;
          line-height: 1em;
          font-weight: normal;
          margin: 0 0 10px 0;
        }
        #invoice .date {
          font-size: 1.1em;
          color: #777777;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          margin-bottom: 20px;
        }
        table th, table td {
          padding: 20px;
          background: #EEEEEE;
          text-align: center;
          border-bottom: 1px solid #FFFFFF;
        }
        table th { white-space: nowrap; font-weight: normal; }
        table td { text-align: right; }
        table td h3 {
          color: #57B223;
          font-size: 1.2em;
          font-weight: normal;
          margin: 0 0 0.2em 0;
        }
        table .no { color: #FFFFFF; font-size: 1.6em; background: #57B223; }
        table .desc { text-align: left; }
        table .unit { background: #DDDDDD; }
        table .total { background: #57B223; color: #FFFFFF; }
        table td.unit, table td.qty, table td.total { font-size: 1.2em; }
        table tbody tr:last-child td { border: none; }
        table tfoot td {
          padding: 10px 20px;
          background: #FFFFFF;
          border-bottom: none;
          font-size: 1.2em;
          white-space: nowrap;
          border-top: 1px solid #AAAAAA;
        }
        table tfoot tr:first-child td { border-top: none; }
        table tfoot tr:last-child td {
          color: #57B223;
          font-size: 1.4em;
          border-top: 1px solid #57B223;
        }
        table tfoot tr td:first-child { border: none; }
        #thanks { font-size: 2em; margin-bottom: 50px; }
        #notices {
          padding-left: 6px;
          border-left: 6px solid #0087C3;
        }
        #notices .notice { font-size: 1.2em; }
        footer {
          color: #777777;
          width: 100%;
          height: 30px;
          position: absolute;
          bottom: 0;
          border-top: 1px solid #AAAAAA;
          padding: 8px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      ${previewMode === "pdf"
            ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
            : previewMode === "view"
                ? `<div style="transform: scale(0.42); transform-origin: top left; width: 100%;">${bodyContent}</div>`
                : `<div style="transform: scale(0.28); transform-origin: top left; width: 70%;">${bodyContent}</div>`
        }
    </body>
  </html>
  `;
};
