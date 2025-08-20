import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { date2string } from "@/src/utils/dateUtils";

export const t6 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>, 
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {
    const paidStamp = (oInv.inv_payment_status === "Paid" || Number(oInv.inv_balance_due) === 0) && oBiz.be_show_paid_stamp
        ? `<div class="paid-stamp">PAID</div>`: "";

    const bodyContent = `
    <div style="font-family: 'Georgia', serif; padding: 30px; border: 1px solid #000; position: relative;">
        ${paidStamp}
        <h1 style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px;">Invoice</h1>
        <div style="display: flex; justify-content: space-between;">
            <div>
                <h3>${oBiz.be_name}</h3>
                <p>${oBiz.be_address || ""}<br/>${oBiz.be_phone || ""}<br/>${oBiz.be_email || ""}</p>
            </div>
            <div>
                <p><strong>Invoice #:</strong> ${oInv.inv_number || "INV-XXXX"}</p>
                <p><strong>Date:</strong> ${date2string((oInv as any)?.inv_date)}</p>
                <p><strong>Due:</strong> ${date2string((oInv as any)?.inv_due_date)}</p>
            </div>
        </div>

        <div style="margin-top: 20px;">
            <strong>Bill To:</strong><br/>
            <p>${(oInv as any)?.client_company_name || "Client Company"}<br/>${(oInv as any)?.client_address || "Client Address"}</p>
        </div>

        <table style="width: 100%; margin-top: 20px; border: 1px solid #000; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 6px;">Description</th>
                    <th style="border: 1px solid #000; padding: 6px;">Qty</th>
                    <th style="border: 1px solid #000; padding: 6px;">Rate</th>
                    <th style="border: 1px solid #000; padding: 6px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${oInv!.inv_items!!.map(item => `
                <tr>
                    <td style="border: 1px solid #000; padding: 6px;">${item.item_name}</td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: right;">${item.item_quantity}</td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: right;">$${Number(item.item_rate).toFixed(2)}</td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: right;">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
                </tr>
                `).join("")}
            </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
            <p><strong>Subtotal:</strong> $${Number(oInv.inv_subtotal).toFixed(2)}</p>
            <p><strong>Discount:</strong> $${Number(oInv.inv_discount).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${Number(oInv.inv_tax_amount).toFixed(2)}</p>
            <p style="font-size: 18px;"><strong>Total:</strong> $${Number(oInv.inv_total).toFixed(2)}</p>
        </div>
    </div>`;

    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                .paid-stamp {
                    position: absolute;
                    top: 40%;
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
    </html>`;
};