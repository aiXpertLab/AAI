import { InvDB, BE_DB, ItemDB } from "@/src/types";
import { date2string } from "@/src/utils/dateUtils";

export const t4 = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BE_DB>, 
    previewMode: "pdf" | "picker" | "view" = "pdf",
) => {

    const paidStamp = (oInv.inv_payment_status === "Paid" || Number(oInv.inv_balance_due) === 0) && oBiz.be_show_paid_stamp
        ? `
            <div class="paid-stamp">PAID</div>
        `
    : "";



const bodyContent = `
<body>
	<header class="clearfix">
		<div class="container">
			<figure>
                  
                    ${oBiz.be_logo ? `
          <div class="logo-section" style="margin-bottom: 10px;">
            <img src="${oBiz.be_logo}" alt="Logo" class="logo"
              style="width: 150px; height: 100px; object-fit: cover; display: block;" />
          </div>` : ""
        }

			</figure>
			<div class="company-info">
				<h2 class="title">${oBiz.be_name}</h2>
				<span>${oBiz.be_address}</span>
				<span class="line"></span>
				<a class="phone" href="tel:602-519-0450">${oBiz.be_phone}</a>
				<span class="line"></span>
				<a class="email" href="mailto:company@example.com">${oBiz.be_email}</a>
			</div>
		</div>
	</header>

	<section>
		<div class="details clearfix">
			<div class="client left">
				<p>INVOICE TO:</p>
				<p class="name">${(oInv as any)?.client_company_name}</p>
				<p>${(oInv as any)?.client_address}
				</p>
				<a href="mailto:john@example.com">${(oInv as any)?.client_email}</a>
			</div>
			<div class="data right">
				<div class="title">${(oInv as any)?.inv_number}</div>
				<div class="date">
                    <p><strong>Invoice Date:</strong> ${date2string((oInv as any)?.inv_date)}</p>
                    <p><strong>Due Date:</strong> ${date2string((oInv as any)?.inv_due_date)}</p>
				</div>
			</div>
		</div>

		<div class="container">
			<div class="table-wrapper">
				<table>
					<tbody class="head">
						<tr>
							<th class="no"></th>
							<th class="desc"><div>Description</div></th>
							<th class="qty"><div>Quantity</div></th>
							<th class="unit"><div>Unit price</div></th>
							<th class="total"><div>Total</div></th>
						</tr>
					</tbody>

                    <tbody class="body">
                    ${oInv!.inv_items!!
                        .map(
                        (item, index) => `
                            <tr>
                            <td class="no">${String(index + 1).padStart(2, '0')}</td>
                            <td class="desc">${item.item_name}</td>
                            <td class="qty">${item.item_quantity}</td>
                            <td class="unit">$${Number(item.item_rate).toFixed(2)}</td>
                            <td class="total">$${((item.item_quantity ?? 0) * (item.item_rate ?? 0)).toFixed(2)}</td>
                            </tr>`
                        )
                        .join("")}
                    </tbody>
				</table>
			</div>
			<div class="no-break">
				<table class="grand-total">
					<tbody>
						<tr>
							<td class="no"></td>
							<td class="desc"></td>
							<td class="qty"></td>
							<td class="unit">SUBTOTAL</td>
							<td class="total">${oInv.inv_subtotal}</td>
						</tr>
						<tr>
							<td class="no"></td>
							<td class="desc"></td>
							<td class="qty"></td>
							<td class="unit">${oInv.inv_tax_label}</td>
							<td class="total">${oInv.inv_tax_amount}</td>
						</tr>
						<tr>
							<td class="grand-total" colspan="5"><div><span>GRAND TOTAL:</span>$${Number(oInv.inv_total).toFixed(2)}</div></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<footer>
		<div class="container">
			<div class="thanks">Thank you!</div>
			<div class="notice">
				<div>NOTICE:</div>
				<div>A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
			</div>
			<div class="end">Invoice was created on a computer and is valid without the signature and seal.</div>
		</div>
	</footer>



  `;

    return `
  <!DOCTYPE html>
  <html lang="en">
<head>
	<title>HTML to API - Invoice</title>
	<link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
	<!-- <link rel="stylesheet" href="sass/main.css" media="screen" charset="utf-8"/> -->
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<meta http-equiv="content-type" content="text-html; charset=utf-8">
	<style type="text/css">
		html, body, div, span, applet, object, iframe,
		h1, h2, h3, h4, h5, h6, p, blockquote, pre,
		a, abbr, acronym, address, big, cite, code,
		del, dfn, em, img, ins, kbd, q, s, samp,
		small, strike, strong, sub, sup, tt, var,
		b, u, i, center,
		dl, dt, dd, ol, ul, li,
		fieldset, form, label, legend,
		table, caption, tbody, tfoot, thead, tr, th, td,
		article, aside, canvas, details, embed,
		figure, figcaption, footer, header, hgroup,
		menu, nav, output, ruby, section, summary,
		time, mark, audio, video {
			margin: 0;
			padding: 0;
			border: 0;
			font: inherit;
			font-size: 100%;
			vertical-align: baseline;
		}

		html {
			line-height: 1;
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



        .logo {
  height: 160px; 
   width: auto;
  display: block;
}

		ol, ul {
			list-style: none;
		}

		table {
			border-collapse: collapse;
			border-spacing: 0;
		}

		caption, th, td {
			text-align: left;
			font-weight: normal;
			vertical-align: middle;
		}

		q, blockquote {
			quotes: none;
		}
		q:before, q:after, blockquote:before, blockquote:after {
			content: "";
			content: none;
		}

		a img {
			border: none;
		}

		article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {
			display: block;
		}

		body {
			font-family: 'Source Sans Pro', sans-serif;
			font-weight: 300;
			font-size: 12px;
			margin: 0;
            margin-top: 5px;
			padding: 0;
            background-color: #ffffff;            
		}
		body a {
			text-decoration: none;
			color: inherit;
		}
		body a:hover {
			color: inherit;
			opacity: 0.7;
		}
		body .container {
			min-width: 500px;
			margin: 0 auto;
			padding: 0 30px;
		}
		body .clearfix:after {
			content: "";
			display: table;
			clear: both;
		}
		body .left {
			float: left;
		}
		body .right {
			float: right;
		}
		body .helper {
			height: 100%;
		}

header .container {
  display: flex;
  align-items: center;
  gap: 1rem; /* Optional spacing between logo and text */
}
  
header figure {
  margin: 0;
  padding-right: 1rem;
  flex-shrink: 0;
}
  

header figure img {
			height: 40px;
		}
		header .company-info {
			color: #BDB9B9;
		}
		header .company-info .title {
			margin-bottom: 5px;
			color: #2A8EAC;
			font-weight: 600;
			font-size: 2em;
		}
		header .company-info .line {
			display: inline-block;
			height: 9px;
			margin: 0 4px;
			border-left: 1px solid #2A8EAC;
		}

		section .details {
			min-width: 500px;
			margin-bottom: 40px;
			padding: 10px 35px;
			background-color: #2A8EAC;
			color: #ffffff;
		}
		section .details .client {
			width: 50%;
			line-height: 16px;
		}
		section .details .client .name {
			font-weight: 600;
		}
		section .details .data {
			width: 50%;
			text-align: right;
		}
		section .details .title {
			margin-bottom: 15px;
			font-size: 3em;
			font-weight: 400;
			text-transform: uppercase;
		}
		section .table-wrapper {
			position: relative;
			overflow: hidden;
		}
		section .table-wrapper:before {
			content: "";
			display: block;
			position: absolute;
			top: 33px;
			left: 30px;
			width: 90%;
			height: 100%;
			border-top: 2px solid #BDB9B9;
			border-left: 2px solid #BDB9B9;
			z-index: -1;
		}
		section .no-break {
			page-break-inside: avoid;
		}
		section table {
			width: 100%;
			margin-bottom: -20px;
			table-layout: fixed;
			border-collapse: separate;
			border-spacing: 5px 20px;
		}
		section table .no {
			width: 50px;
		}
		section table .desc {
			width: 55%;
		}
		section table .qty, section table .unit, section table .total {
			width: 15%;
		}
		section table tbody.head {
			vertical-align: middle;
			border-color: inherit;
		}
		section table tbody.head th {
			text-align: center;
			color: white;
			font-weight: 600;
			text-transform: uppercase;
		}
		section table tbody.head th div {
			display: inline-block;
			padding: 7px 0;
			width: 100%;
			background: #BDB9B9;
		}
		section table tbody.head th.desc div {
			width: 115px;
			margin-left: -110px;
		}
		section table tbody.body td {
			padding: 10px 5px;
			background: #F3F3F3;
			text-align: center;
		}
		section table tbody.body h3 {
			margin-bottom: 5px;
			color: #2A8EAC;
			font-weight: 600;
		}
		section table tbody.body .no {
			padding: 0px;
			background-color: #2A8EAC;
			color: #ffffff;
			font-size: 1.66666666666667em;
			font-weight: 600;
			line-height: 50px;
		}
		section table tbody.body .desc {
			padding-top: 0;
			padding-bottom: 0;
			background-color: transparent;
			color: #777787;
			text-align: left;
		}
		section table tbody.body .total {
			color: #2A8EAC;
			font-weight: 600;
		}
		section table tbody.body tr.total td {
			padding: 5px 10px;
			background-color: transparent;
			border: none;
			color: #777777;
			text-align: right;
		}
		section table tbody.body tr.total .empty {
			background: white;
		}
		section table tbody.body tr.total .total {
			font-size: 1.18181818181818em;
			font-weight: 600;
			color: #2A8EAC;
		}
		section table.grand-total {
			margin-top: 40px;
			margin-bottom: 0;
			border-collapse: collapse;
			border-spacing: 0px 0px;
			margin-bottom: 40px;
		}
		section table.grand-total tbody td {
			padding: 0 10px 10px;
			background-color: #2A8EAC;
			color: #ffffff;
			font-weight: 400;
			text-align: right;
		}
		section table.grand-total tbody td.no, section table.grand-total tbody td.desc, section table.grand-total tbody td.qty {
			background-color: transparent;
		}
		section table.grand-total tbody td.total, section table.grand-total tbody td.grand-total {
			border-right: 5px solid #ffffff;
		}
		section table.grand-total tbody td.grand-total {
			padding: 0;
			font-size: 1.16666666666667em;
			font-weight: 600;
			background-color: transparent;
		}
		section table.grand-total tbody td.grand-total div {
			float: right;
			padding: 10px 5px;
			background-color: #21BCEA;
		}
		section table.grand-total tbody td.grand-total div span {
			margin-right: 5px;
		}
		section table.grand-total tbody tr:first-child td {
			padding-top: 10px;
		}

		footer {
			margin-bottom: 20px;
			padding: 0 5px;
		}
		footer .thanks {
			margin-bottom: 40px;
			color: #2A8EAC;
			font-size: 1.16666666666667em;
			font-weight: 600;
		}
		footer .notice {
			margin-bottom: 25px;
		}
		footer .end {
			padding-top: 5px;
			border-top: 2px solid #2A8EAC;
			text-align: center;
		}

        
	</style>
</head>

    <body>
  ${paidStamp}
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