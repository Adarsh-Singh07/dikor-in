"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BrandLogo, { DikorSeal } from "@/components/BrandLogo";
import { Sparkle, GoldButton, GhostButton } from "@/components/ui";

interface OrderData {
  id: string;
  trackingToken: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  title: string;
  category: string;
  subjectName?: string;
  tagText?: string;
  size: string;
  city: string;
  totalPrice: number;
  advanceAmount: number;
  balanceAmount: number;
  advancePaid: boolean;
  balancePaid: boolean;
  trackingNumber: string | null;
  courierPartner: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load order for invoice:", err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm font-semibold text-charcoal">Generating Branded DIKOR Invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal">Invoice Not Found</h2>
        <GhostButton className="mt-4" onClick={() => router.push("/")}>Return to Atelier</GhostButton>
      </div>
    );
  }

  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${order.id.replace(/\D/g, "").slice(-4) || "1001"}`;
  const issueDate = new Date(order.updatedAt || order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F4EFE6] py-10 px-4 print:p-0 print:bg-white text-charcoal">
      {/* Action Bar (hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted hover:text-charcoal"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <GhostButton onClick={() => window.print()} className="py-2 px-5 text-xs">
            🖨️ Print Invoice
          </GhostButton>
          <GoldButton onClick={() => window.print()} className="py-2 px-5 text-xs">
            Download PDF
          </GoldButton>
        </div>
      </div>

      {/* Luxury Printable Invoice Sheet */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gold/40 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 relative overflow-hidden">
        {/* Subtle Watermark Seal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <DikorSeal size={480} />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-gold/40 pb-8 gap-6">
          <div>
            <BrandLogo size="lg" theme="print" variant="full" href="" />
            <div className="mt-4 text-xs text-charcoal-soft space-y-0.5">
              <p className="font-semibold text-charcoal">DIKOR 3D Atelier &bull; Custom Keepsakes</p>
              <p>By Rajat Saini & Sheetal</p>
              <p>Studio: Jalandhar, Punjab, India &bull; PIN 144001</p>
              <p>Email: Dikorgifts@gmail.com &bull; WhatsApp: +91 98780 70123</p>
              <p className="text-[11px] text-charcoal-muted mt-1">GSTIN: 03AAACD1234F1Z5 (Composition Scheme)</p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">
              Paid in Full &bull; Tax Invoice
            </span>
            <h1 className="font-serif text-2xl font-bold text-charcoal">TAX INVOICE</h1>
            <p className="text-xs text-charcoal-soft">Invoice No: <strong className="text-charcoal">{invoiceNumber}</strong></p>
            <p className="text-xs text-charcoal-soft">Order ID: <strong>#{order.id}</strong></p>
            <p className="text-xs text-charcoal-soft">Date: <strong>{issueDate}</strong></p>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-cream/40 border border-charcoal/10">
            <h4 className="font-semibold text-charcoal uppercase tracking-wider text-[11px] mb-2 text-gold-dark">
              Billed To
            </h4>
            <p className="font-bold text-sm text-charcoal">{order.customerName}</p>
            {order.customerPhone && <p className="text-charcoal-soft">Phone: {order.customerPhone}</p>}
            {order.customerEmail && <p className="text-charcoal-soft">Email: {order.customerEmail}</p>}
            <p className="text-charcoal-soft">Destination: {order.city || "Pan-India"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-cream/40 border border-charcoal/10">
            <h4 className="font-semibold text-charcoal uppercase tracking-wider text-[11px] mb-2 text-gold-dark">
              Shipping & Courier Details
            </h4>
            <p className="font-bold text-sm text-charcoal">Pan-India Insured Express Delivery</p>
            <p className="text-charcoal-soft">Carrier: {order.courierPartner || "BlueDart Express"}</p>
            <p className="text-charcoal-soft">
              Tracking AWB: {order.trackingNumber ? <strong>{order.trackingNumber}</strong> : "Delivered / Handcrafted"}
            </p>
            <p className="text-charcoal-soft">Packaging: Shockproof Velvet Wooden Keepsake Box</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="my-8 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-charcoal/80 text-charcoal font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-2">Item Description</th>
                <th className="py-3 px-2">Scale / Size</th>
                <th className="py-3 px-2">Brass Plaque Engraving</th>
                <th className="py-3 px-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              <tr>
                <td className="py-4 px-2">
                  <p className="font-bold text-sm text-charcoal">{order.title}</p>
                  <p className="text-[11px] text-charcoal-muted">
                    Precision 3D SLA modeling, handcrafted acrylic detailing, and artisan UV protective coating.
                  </p>
                </td>
                <td className="py-4 px-2 font-medium">{order.size}</td>
                <td className="py-4 px-2 italic text-charcoal-soft">&ldquo;{order.tagText || order.subjectName || "DIKOR"}&rdquo;</td>
                <td className="py-4 px-2 text-right font-bold text-sm">₹{order.totalPrice.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-medium">Pan-India Express Shipping & Protective Wooden Crate</td>
                <td className="py-3 px-2">Insured Delivery</td>
                <td className="py-3 px-2">Complimentary</td>
                <td className="py-3 px-2 text-right font-bold text-emerald-700">FREE (₹0.00)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-charcoal/15">
          <div className="max-w-xs text-[11px] text-charcoal-soft space-y-1">
            <p className="font-semibold text-charcoal uppercase tracking-wider text-[10px]">Payment Terms & Guarantee</p>
            <p>1. Split payment model: 75% advance reservation deposit + 25% balance post 360° craft video approval.</p>
            <p>2. Handcrafted to order from client reference photos. Non-transferable original artwork.</p>
          </div>

          <div className="w-full sm:w-72 bg-cream-dark/30 p-4 rounded-2xl border border-charcoal/10 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal">
              <span>Gross Total:</span>
              <span className="font-semibold">₹{order.totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-emerald-800">
              <span>75% Advance Paid (Easebuzz):</span>
              <span className="font-semibold">-₹{order.advanceAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-emerald-800">
              <span>25% Balance Paid (Easebuzz):</span>
              <span className="font-semibold">-₹{order.balanceAmount.toLocaleString("en-IN")}</span>
            </div>
            <hr className="border-charcoal/15 my-2" />
            <div className="flex justify-between text-base font-bold text-charcoal">
              <span>Balance Due:</span>
              <span className="text-emerald-700">₹0.00 (PAID)</span>
            </div>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="mt-12 pt-8 border-t border-charcoal/15 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-charcoal-soft">
          <div className="flex items-center gap-3">
            <DikorSeal size={48} theme="print" />
            <div>
              <p className="font-bold text-charcoal">DIKOR ATELIER CERTIFIED</p>
              <p className="text-[10px] text-charcoal-muted">Verified Authentic 3D Handcrafted Artwork</p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-serif italic text-lg text-charcoal font-bold tracking-wider mb-1">
              Rajat Saini & Sheetal
            </div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal-muted">Authorized Signatory &bull; DIKOR</p>
          </div>
        </div>
      </div>
    </div>
  );
}
