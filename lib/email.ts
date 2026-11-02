export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "DIKOR Studio <orders@dikor.in>";

  if (!apiKey || apiKey.trim() === "" || apiKey.startsWith("re_placeholder")) {
    console.log(`[Resend Mock Email Dispatch]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    return { success: true, id: `mock_email_${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to send email via Resend" };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error("Resend send error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Generate luxury DIKOR-branded HTML invoice email template
 */
export function generateInvoiceEmailHtml(params: {
  customerName: string;
  orderId: string;
  invoiceNumber: string;
  totalPrice: number;
  advancePaid: number;
  balancePaid: number;
  items: Array<{ title: string; size: string; price: number }>;
  invoiceUrl: string;
}): string {
  const { customerName, orderId, invoiceNumber, totalPrice, advancePaid, balancePaid, items, invoiceUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DIKOR Tax Invoice ${invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5EC; margin: 0; padding: 24px; color: #2A2320; }
    .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E5D7C3; overflow: hidden; box-shadow: 0 10px 30px rgba(42,35,32,0.06); }
    .header { background: #2A2320; padding: 36px 32px; text-align: center; color: #FAF5EC; }
    .logo-seal { display: inline-block; width: 50px; height: 50px; border-radius: 50%; border: 2px solid #C9A227; line-height: 48px; font-size: 24px; color: #C9A227; font-family: Georgia, serif; margin-bottom: 12px; }
    .title { font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0; color: #FAF5EC; }
    .subtitle { font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #B76E79; margin-top: 6px; }
    .body-content { padding: 32px; }
    .badge { display: inline-block; background: #E8F5E9; color: #2E7D32; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    .table th { text-align: left; padding: 12px 8px; border-bottom: 2px solid #2A2320; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #6E5D57; }
    .table td { padding: 14px 8px; border-bottom: 1px solid #F0E6D8; font-size: 14px; }
    .total-box { margin-top: 24px; background: #FAF5EC; border-radius: 12px; padding: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .total-row.bold { font-weight: 700; font-size: 16px; border-top: 1px solid #E5D7C3; margin-top: 8px; padding-top: 12px; }
    .cta-button { display: block; width: 100%; background: linear-gradient(135deg, #B76E79 0%, #C9A227 100%); color: #2A2320; text-align: center; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase; padding: 16px 20px; border-radius: 999px; margin-top: 28px; box-sizing: border-box; }
    .footer { text-align: center; padding: 24px; font-size: 12px; color: #8C7870; border-top: 1px solid #F0E6D8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-seal">D</div>
      <h1 class="title">DIKOR</h1>
      <p class="subtitle">Atelier &bull; Custom 3D Keepsakes &bull; Jalandhar, India</p>
    </div>
    <div class="body-content">
      <div class="badge">Order Delivered &bull; Paid in Full</div>
      <h2 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 22px;">Tax Invoice & Official Receipt</h2>
      <p style="margin: 0; color: #6E5D57; font-size: 14px;">Invoice #: <strong>${invoiceNumber}</strong> &bull; Order #: <strong>${orderId}</strong></p>
      <p style="color: #4A3E39; font-size: 14px; margin-top: 16px;">
        Dear <strong>${customerName}</strong>,<br>
        Thank you for choosing DIKOR. Your bespoke 3D keepsake has been handcrafted, hand-painted, and safely delivered. Below is your official tax receipt.
      </p>

      <table class="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Size / Specs</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (it) => `
          <tr>
            <td><strong>${it.title}</strong></td>
            <td>${it.size}</td>
            <td style="text-align: right;">₹${it.price.toLocaleString("en-IN")}</td>
          </tr>`
            )
            .join("")}
          <tr>
            <td><strong>Pan-India Express Shipping & Protective Wooden Crate</strong></td>
            <td>Complimentary</td>
            <td style="text-align: right; color: #2E7D32;">FREE</td>
          </tr>
        </tbody>
      </table>

      <div class="total-box">
        <div class="total-row"><span>Total Figurine Value:</span><span>₹${totalPrice.toLocaleString("en-IN")}</span></div>
        <div class="total-row" style="color: #2E7D32;"><span>Advance Paid (75%):</span><span>-₹${advancePaid.toLocaleString("en-IN")}</span></div>
        <div class="total-row" style="color: #2E7D32;"><span>Balance Cleared (25%):</span><span>-₹${balancePaid.toLocaleString("en-IN")}</span></div>
        <div class="total-row bold"><span>Total Balance Due:</span><span style="color: #2E7D32;">₹0.00 (PAID)</span></div>
      </div>

      <a href="${invoiceUrl}" class="cta-button" target="_blank">View / Print Full GST Invoice</a>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">DIKOR Studio &bull; Made with Precision &bull; WhatsApp: +91 98780 70123</p>
      <p style="margin: 0;">Instagram: @dikor_in &bull; dikor.in</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
