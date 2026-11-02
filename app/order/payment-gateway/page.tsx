"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import BrandLogo from "@/components/BrandLogo";
import { Sparkle, GoldButton, GhostButton } from "@/components/ui";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txnid = searchParams.get("txnid") || "EBZ-DEMO-TXN";
  const orderId = searchParams.get("orderId") || "";
  const type = searchParams.get("type") || "advance";
  const amount = searchParams.get("amount") || "1500";
  const name = searchParams.get("name") || "Customer";

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [completed, setCompleted] = useState(false);

  const isAdvance = type === "advance";

  const handleCompletePayment = async (status: "success" | "failed" = "success") => {
    if (!orderId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        setCompleted(true);
        setTimeout(() => {
          router.push(`/dashboard/orders/${orderId}?paid=1`);
        }, 1500);
      } else {
        alert("Payment simulation failed");
      }
    } catch (err) {
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream/70 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-card border border-gold/30 overflow-hidden">
        {/* Header */}
        <div className="bg-charcoal text-cream px-6 py-6 flex items-center justify-between">
          <BrandLogo size="sm" theme="dark" variant="compact" />
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-gold block">Secured by</span>
            <span className="text-sm font-semibold tracking-wide text-white">Easebuzz Gateway</span>
          </div>
        </div>

        {/* Order Brief */}
        <div className="p-6 bg-cream-dark/40 border-b border-charcoal/10 flex items-center justify-between">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rosegold-dark px-2.5 py-1 rounded-full bg-blush border border-rosegold/30 mb-1">
              {isAdvance ? "75% Advance Deposit" : "25% Final Balance"}
            </span>
            <h3 className="text-base font-semibold text-charcoal">Order #{orderId}</h3>
            <p className="text-xs text-charcoal-muted">Txn ID: {txnid}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-charcoal-muted">Payable Now</p>
            <p className="text-3xl font-display text-charcoal font-bold">₹{Number(amount).toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-6">
          <div className="flex border border-charcoal/15 rounded-2xl p-1 bg-cream/40">
            <button
              onClick={() => setMethod("upi")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                method === "upi" ? "bg-white text-charcoal shadow-sm" : "text-charcoal-muted hover:text-charcoal"
              }`}
            >
              UPI / QR
            </button>
            <button
              onClick={() => setMethod("card")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                method === "card" ? "bg-white text-charcoal shadow-sm" : "text-charcoal-muted hover:text-charcoal"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setMethod("netbanking")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                method === "netbanking" ? "bg-white text-charcoal shadow-sm" : "text-charcoal-muted hover:text-charcoal"
              }`}
            >
              NetBanking
            </button>
          </div>

          {method === "upi" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-charcoal/10 bg-cream/30 text-center">
                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-charcoal/10 flex items-center justify-center">
                  {/* Decorative QR code graphic */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-charcoal">
                    <rect width="30" height="30" fill="currentColor" rx="4" />
                    <rect x="70" width="30" height="30" fill="currentColor" rx="4" />
                    <rect y="70" width="30" height="30" fill="currentColor" rx="4" />
                    <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                    <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                    <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                    <rect x="45" y="15" width="10" height="15" fill="currentColor" />
                    <rect x="45" y="70" width="10" height="15" fill="currentColor" />
                    <rect x="15" y="45" width="15" height="10" fill="currentColor" />
                    <rect x="70" y="45" width="15" height="10" fill="currentColor" />
                  </svg>
                </div>
                <p className="mt-2 text-xs font-medium text-charcoal">Scan with GPay, PhonePe, Paytm, or BHIM</p>
                <p className="text-[11px] text-charcoal-muted">UPI ID: 9878070123@upi (DIKOR CREATIONS)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Or enter UPI VPA</label>
                <input
                  type="text"
                  placeholder="yourname@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-sm focus:border-rosegold focus:outline-none"
                />
              </div>
            </div>
          )}

          {method === "card" && (
            <div className="space-y-3 text-sm">
              <input
                type="text"
                placeholder="Card Number (4111 2222 3333 4444)"
                className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="rounded-xl border border-charcoal/20 px-3.5 py-2.5"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength={4}
                  className="rounded-xl border border-charcoal/20 px-3.5 py-2.5"
                />
              </div>
            </div>
          )}

          {method === "netbanking" && (
            <div className="grid grid-cols-3 gap-2">
              {["HDFC", "SBI", "ICICI", "Axis", "Kotak", "Other"].map((b) => (
                <button
                  key={b}
                  className="py-3 text-xs font-semibold rounded-xl border border-charcoal/15 hover:border-gold hover:bg-cream"
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <GoldButton
              className="w-full"
              disabled={loading || completed}
              onClick={() => handleCompletePayment("success")}
            >
              {loading ? "Authorizing via Easebuzz..." : completed ? "Payment Confirmed! Redirecting..." : `Pay ₹${Number(amount).toLocaleString("en-IN")}`}
            </GoldButton>

            <button
              onClick={() => router.back()}
              className="w-full text-center text-xs text-charcoal-muted hover:text-charcoal py-2"
            >
              Cancel and return to order
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-cream-dark/50 px-6 py-3 border-t border-charcoal/10 flex items-center justify-center gap-2 text-[11px] text-charcoal-soft">
          <Sparkle className="w-3.5 h-3.5 text-gold" />
          <span>256-Bit SSL Encrypted &bull; 100% Satisfaction Craft Approval Guarantee</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center">Loading gateway...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
