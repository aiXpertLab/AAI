import { InvDB, BE_DB, ItemDB, ClientDB } from "@/src/types";
import { date2string } from "@/src/utils/dateUtils";

export const t11 = (
  oInv: Partial<InvDB>,
  oBiz: Partial<BE_DB>,
  previewMode: "pdf" | "picker" | "view" = "pdf"
) => {
  const paidStamp = (oInv.inv_payment_status === "Paid" || Number(oInv.inv_balance_due) === 0) && oBiz.be_show_paid_stamp
    ? `<div class="paid-stamp">PAID</div>`
    : "";

const bodyContent = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Order confirmation</title>
  <meta name="robots" content="noindex,nofollow" />
  <meta name="viewport" content="width=device-width; initial-scale=1.0;" />
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
    body { margin: 0; padding: 0; background: #e1e1e1; position: relative; }
    div, p, a, li, td { -webkit-text-size-adjust: none; }
    .ReadMsgBody, .ExternalClass { width: 100%; background-color: #ffffff; }
    html, body { width: 100%; height: 100%; background-color: #e1e1e1; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    p { padding: 0 !important; margin: 0 !important; }
    .visibleMobile { display: none; }
    .hiddenMobile { display: block; }
    
    /* PAID STAMP CSS */
    .paid-stamp {
      position: fixed;
      top: 50%;
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
<body>
  ${paidStamp}
  <!-- Header section here -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
    <tr><td height="20"></td></tr>
    <tr>
      <td>
        <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 10px 10px 0 0;">
          <tr><td height="40"></td></tr>
          <tr>
            <td>
              <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                <tr>
                  <td>
                    <table width="220" border="0" cellpadding="0" cellspacing="0" align="left" class="col">
                      <tr>
  <td align="left" style="display: flex; justify-content: space-between; align-items: center;">
            ${oBiz.be_logo ? `
          <div class="logo-section" style="margin-bottom: 10px;">
            <img src="${oBiz.be_logo}" alt="Logo" class="logo"
              style="width: 300px; height: 60px; object-fit: cover; display: block;" />
          </div>` : ""
        }

    <span style="font-size: 32px; font-weight: 800; color: #ff0000; font-family: 'Open Sans', sans-serif;">Invoice</span>
  </td>
</tr>
<tr>
                        <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; text-align: left;">
                          Hello, ${(oInv as any)?.client_company_name || "Client Name"}.<br />
                          Thank you for your order.
                        </td>
                      </tr>
                    </table>
                    <table width="220" border="0" cellpadding="0" cellspacing="0" align="right" class="col" style="text-align: right; vertical-align: top;">
  <tr><td height="20"></td></tr>
                      <tr><td height="20"></td></tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; text-align: right;">
                          <small>ORDER</small> #${oInv.inv_number || "INV-XXXX"}<br />
                          <small>${date2string(oInv.inv_date) || "DATE"}</small>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Order Items Section -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
    <tr>
      <td>
        <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
          <tr><td height="40"></td></tr>
          <tr>
            <td>
              <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                <tr>
                  <th align="left">Item</th>
                  <th align="left"><small>SKU</small></th>
                  <th align="center">Quantity</th>
                  <th align="right">Subtotal</th>
                </tr>
                <tr><td height="10" colspan="4"></td></tr>
                ${oInv!.inv_items!.map(item => `
                  <tr>
                    <td style="padding:10px 0;">${item.item_name || "Item"}</td>
                    <td><small>${item.item_sku || "SKU"}</small></td>
                    <td align="center">${item.item_quantity || 0}</td>
                    <td align="right">$${((item.item_quantity || 0) * (item.item_rate || 0)).toFixed(2)}</td>
                  </tr>
                  <tr><td colspan="4" style="border-bottom:1px solid #e4e4e4"></td></tr>
                `).join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Totals Section -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
    <tr>
      <td>
        <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
          <tr>
            <td>
              <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                <tr>
                  <td align="right">Subtotal</td>
                  <td align="right" width="80">$${Number(oInv.inv_subtotal).toFixed(2)}</td>
                </tr>
                <tr>
                  <td align="right">Discount</td>
                  <td align="right">$${Number(oInv.inv_discount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td align="right">Tax</td>
                  <td align="right">$${Number(oInv.inv_tax_amount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td align="right"><strong>Total</strong></td>
                  <td align="right"><strong>$${Number(oInv.inv_total).toFixed(2)}</strong></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Additional Information -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
    <tr><td>
      <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
        <tr><td height="40"></td></tr>
        <tr>
          <td>
            <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
              <tr>
                <td width="220" valign="top">
                  <strong>BILLING INFORMATION</strong><br /><br />
                  Philip Brooks<br />
                  Public Wales, Somewhere<br />
                  New York NY<br />
                  4468, United States<br />
                  T: 202-555-0133
                </td>
                <td width="220" valign="top" align="right">
                  <strong>PAYMENT METHOD</strong><br /><br />
                  Credit Card<br />
                  Credit Card Type: Visa<br />
                  Worldpay Transaction ID: <a href="#">4185939336</a><br />
                  <a href="#">Right of Withdrawal</a>
                </td>
              </tr>
              <tr><td colspan="2" height="30"></td></tr>
              <tr>
                <td width="220" valign="top">
                  <strong>SHIPPING INFORMATION</strong><br /><br />
                  Sup Inc<br />
                  Another Place, Somewhere<br />
                  New York NY<br />
                  4468, United States<br />
                  T: 202-555-0171
                </td>
                <td width="220" valign="top" align="right">
                  <strong>SHIPPING METHOD</strong><br /><br />
                  UPS: U.S. Shipping Services
                </td>
              </tr>
              <tr><td colspan="2" height="40"></td></tr>
              <tr>
                <td colspan="2" style="text-align: left; font-size: 12px; color: #5b5b5b;">Have a nice day.</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td height="40"></td></tr>
      </table>
    </td></tr>
  </table>

</body>
</html>
  `;

  return previewMode === "pdf"
    ? `<div style="transform: scale(1); transform-origin: top left; width: 100%;">${bodyContent}</div>`
    : previewMode === "view"
      ? `<div style="transform: scale(0.5); transform-origin: top left; width: 200%;">${bodyContent}</div>`
      : `<div style="transform: scale(0.29); transform-origin: top left; width: 350%;">${bodyContent}</div>`;
};