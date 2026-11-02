"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkle, GoldButton, GhostButton, StatusPill } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import type { DBOrder, DBProduct, OrderStatus, Category } from "@/lib/db";
import { inr, whatsappOrderLink } from "@/lib/catalog";

interface AdminDashboardViewProps {
  initialOrders: DBOrder[];
  initialProducts: DBProduct[];
  adminName: string;
}

export default function AdminDashboardView({
  initialOrders,
  initialProducts,
  adminName,
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "manual" | "products">("orders");
  const [orders, setOrders] = useState<DBOrder[]>(initialOrders);
  const [products, setProducts] = useState<DBProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // Manual Order Form State
  const [manualTitle, setManualTitle] = useState("");
  const [manualCat, setManualCat] = useState<Category>("Pets");
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPrice, setManualPrice] = useState("1500");
  const [manualSize, setManualSize] = useState('5" · Bulky breeds');
  const [manualSource, setManualSource] = useState<"instagram" | "whatsapp" | "manual_admin">("instagram");
  const [manualCity, setManualCity] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [createdOrderLink, setCreatedOrderLink] = useState<string | null>(null);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const advanceCollected = orders.filter((o) => o.advancePaid).reduce((sum, o) => sum + (o.advanceAmount || 0), 0);
  const inProductionCount = orders.filter((o) => o.status === "in_production").length;
  const approvalWaitingCount = orders.filter((o) => o.status === "approval_shared").length;

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(search));
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Quick Status Update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.order) {
        setOrders(orders.map((o) => (o.id === orderId ? data.order : o)));
        setMessage(`Order #${orderId} moved to "${newStatus.replace("_", " ").toUpperCase()}"`);
      }
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setBusy(false);
    }
  };

  // Create Manual Order
  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualName) {
      alert("Please enter title and customer name");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle,
          category: manualCat,
          customerName: manualName,
          customerPhone: manualPhone,
          customerEmail: manualEmail,
          price: Number(manualPrice) || 1500,
          size: manualSize,
          city: manualCity,
          source: manualSource,
          description: manualNotes,
          photos: ["/images/hero-dog.webp"],
        }),
      });
      const data = await res.json();
      if (data.order) {
        setOrders([data.order, ...orders]);
        const shareLink = `${window.location.origin}/dashboard/orders/${data.order.id}?token=${data.order.trackingToken}`;
        setCreatedOrderLink(shareLink);
        setMessage(`Order #${data.order.id} logged successfully!`);
        setManualTitle("");
        setManualName("");
        setManualPhone("");
        setManualEmail("");
        setManualNotes("");
      }
    } catch (err) {
      alert("Failed to create manual order");
    } finally {
      setBusy(false);
    }
  };

  // Product price adjustment
  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, basePrice: newPrice }),
      });
      setProducts(products.map((p) => (p.id === productId ? { ...p, basePrice: newPrice } : p)));
      setMessage("Product price updated live!");
    } catch (err) {
      alert("Failed to update product");
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.24em] font-bold text-rosegold-dark flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-gold" /> DIKOR Studio Headquarters
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-1">Artisan Command Center</h1>
          <p className="text-xs text-charcoal-muted mt-1">Signed in as {adminName} &bull; Pan-India Production & Order Fulfillment</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-charcoal/15">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "orders" ? "bg-charcoal text-cream shadow-sm" : "text-charcoal-muted hover:text-charcoal"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "manual" ? "bg-charcoal text-cream shadow-sm" : "text-charcoal-muted hover:text-charcoal"
            }`}
          >
            + Manual DM / Call Order
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "products" ? "bg-charcoal text-cream shadow-sm" : "text-charcoal-muted hover:text-charcoal"
            }`}
          >
            Pricing & Catalog
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-sm font-semibold text-emerald-800">
          ✨ {message}
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white shadow-soft border border-charcoal/10">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Total Studio Orders</p>
          <p className="font-serif text-3xl font-bold text-charcoal mt-1">{orders.length}</p>
          <p className="text-[11px] text-rosegold-dark mt-1 font-medium">Web, WhatsApp & Instagram</p>
        </div>
        <div className="p-5 rounded-3xl bg-white shadow-soft border border-charcoal/10">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Advance Collected</p>
          <p className="font-serif text-3xl font-bold text-gold-dark mt-1">₹{advanceCollected.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-charcoal-muted mt-1">Gross: ₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-5 rounded-3xl bg-white shadow-soft border border-charcoal/10">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">In 3D Print & Paint</p>
          <p className="font-serif text-3xl font-bold text-amber-700 mt-1">{inProductionCount}</p>
          <p className="text-[11px] text-charcoal-muted mt-1">Active in Studio Booth</p>
        </div>
        <div className="p-5 rounded-3xl bg-white shadow-soft border border-charcoal/10">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Approval Video Ready</p>
          <p className="font-serif text-3xl font-bold text-rosegold-dark mt-1">{approvalWaitingCount}</p>
          <p className="text-[11px] text-charcoal-muted mt-1">Awaiting Client Greenlight</p>
        </div>
      </div>

      {/* TAB 1: ORDERS PIPELINE */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-3xl border border-charcoal/10">
            <input
              type="text"
              placeholder="Search by order ID, pet name, client name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-md px-4 py-2 text-xs rounded-xl border border-charcoal/20 focus:border-gold focus:outline-none"
            />
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {["all", "photos_received", "advance_paid", "in_production", "approval_shared", "balance_paid", "shipped", "delivered"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-rosegold text-cream"
                      : "bg-cream text-charcoal-soft hover:bg-cream-dark"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-3xl bg-white shadow-card border border-charcoal/10">
            <table className="w-full text-left text-xs min-w-[800px]">
              <thead className="bg-cream-dark/50 border-b border-charcoal/10 uppercase tracking-wider text-[10px] text-charcoal-muted">
                <tr>
                  <th className="px-5 py-3.5">Order & Subject</th>
                  <th className="px-5 py-3.5">Client & Source</th>
                  <th className="px-5 py-3.5">Pricing (Adv / Bal)</th>
                  <th className="px-5 py-3.5">Current Status</th>
                  <th className="px-5 py-3.5">Quick Actions</th>
                  <th className="px-5 py-3.5 text-right">Invoice & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40 transition">
                    <td className="px-5 py-4">
                      <p className="font-bold text-sm text-charcoal">{o.title}</p>
                      <p className="text-[11px] text-charcoal-muted">
                        #{o.id} &bull; {o.size} &bull; {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-charcoal">{o.customerName}</p>
                      <p className="text-[11px] text-charcoal-muted">{o.customerPhone || o.customerEmail || "Guest"}</p>
                      <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream border border-charcoal/10 text-charcoal-soft">
                        via {o.source || "web"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-serif text-sm font-bold text-charcoal">₹{o.totalPrice.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-charcoal-muted">
                        Adv: {o.advancePaid ? <span className="text-emerald-700 font-bold">Paid (₹{o.advanceAmount})</span> : <span className="text-red-700">Due (₹{o.advanceAmount})</span>}
                      </p>
                      <p className="text-[10px] text-charcoal-muted">
                        Bal: {o.balancePaid ? <span className="text-emerald-700 font-bold">Paid (₹{o.balanceAmount})</span> : <span>Due (₹{o.balanceAmount})</span>}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {o.status === "photos_received" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "advance_paid")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          >
                            Mark Adv Paid
                          </button>
                        )}
                        {o.status === "advance_paid" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "in_production")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
                          >
                            Start 3D Print
                          </button>
                        )}
                        {o.status === "in_production" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "approval_shared")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rosegold/20 text-rosegold-dark hover:bg-rosegold/30"
                          >
                            Share Video Proof
                          </button>
                        )}
                        {o.status === "approval_shared" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "approved")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Mark Approved
                          </button>
                        )}
                        {o.status === "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "balance_paid")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-gold/25 text-gold-dark hover:bg-gold/40"
                          >
                            Mark Balance Paid
                          </button>
                        )}
                        {o.status === "balance_paid" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "shipped")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {o.status === "shipped" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "delivered")}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-charcoal text-cream hover:bg-charcoal/80"
                          >
                            Mark Delivered & Send Invoice
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        href={`/invoice/${o.id}`}
                        target="_blank"
                        className="inline-block px-3 py-1 rounded-full border border-gold text-[10px] font-bold uppercase tracking-wider text-charcoal hover:bg-gold/20"
                      >
                        Invoice
                      </Link>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-block px-3 py-1 rounded-full bg-charcoal text-cream text-[10px] font-bold uppercase tracking-wider hover:bg-charcoal/80"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL ORDER ENTRY (INSTAGRAM / WHATSAPP) */}
      {activeTab === "manual" && (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gold/30 shadow-card max-w-3xl mx-auto">
          <div className="mb-6">
            <h3 className="font-serif text-2xl font-bold text-charcoal">Add Offline / Instagram / WhatsApp Order</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Manually record orders closed in Instagram DMs or WhatsApp calls. Automatically creates customer tracking token and shareable link.
            </p>
          </div>

          <form onSubmit={handleCreateManualOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Source Channel</label>
                <select
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value as any)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                >
                  <option value="instagram">Instagram DM (@dikor_in)</option>
                  <option value="whatsapp">WhatsApp Chat (+91 98780 70123)</option>
                  <option value="manual_admin">Studio Walk-in / Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Category</label>
                <select
                  value={manualCat}
                  onChange={(e) => setManualCat(e.target.value as any)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                >
                  <option value="Pets">Pets (Dog / Cat)</option>
                  <option value="Couples">Couples</option>
                  <option value="Kids">Kids</option>
                  <option value="Idols">Religious / Idols</option>
                  <option value="Decor">Custom Decor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Keepsake Title / Description</label>
              <input
                type="text"
                placeholder="e.g. Leo — Golden Retriever 5-inch Sitting Pose"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Customer WhatsApp / Phone</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Customer Email</label>
                <input
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Final Agreed Price (INR)</label>
                <input
                  type="number"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Scale / Size</label>
                <input
                  type="text"
                  value={manualSize}
                  onChange={(e) => setManualSize(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Destination City</label>
                <input
                  type="text"
                  placeholder="Mumbai, Maharashtra"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Notes & Specific Requests</label>
              <textarea
                placeholder="Name plaque engraving text, photo notes, special packaging requests..."
                rows={3}
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>

            <GoldButton type="submit" disabled={busy} className="w-full">
              {busy ? "Registering Order..." : "Create Order & Generate Customer Link"}
            </GoldButton>
          </form>

          {createdOrderLink && (
            <div className="mt-6 p-5 rounded-2xl bg-cream-dark/60 border border-gold/40">
              <p className="text-xs font-bold text-charcoal">Customer Live Tracking & Payment Link:</p>
              <input
                type="text"
                readOnly
                value={createdOrderLink}
                className="mt-2 w-full bg-white p-2 text-xs rounded-lg border border-charcoal/20 select-all font-mono"
              />
              <div className="mt-3 flex gap-2">
                <a
                  href={`https://wa.me/${manualPhone ? `91${manualPhone.replace(/\D/g, "")}` : ""}?text=${encodeURIComponent(
                    `Hi ${manualName}! Your DIKOR 3D order has been queued. You can track live progress & approve your 3D video here: ${createdOrderLink}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Send on WhatsApp
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(createdOrderLink)}
                  className="px-4 py-2 rounded-full border border-charcoal/20 text-xs font-semibold hover:bg-white"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRODUCT & PRICING MANAGEMENT */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-soft">
            <h3 className="font-serif text-2xl font-bold text-charcoal">Studio Catalog & Pricing Management</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Adjust base prices, advance percentages, and lead times. All changes reflect live immediately on dikor.in.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {products.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl border border-charcoal/15 bg-cream/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-charcoal">{p.title}</h4>
                      <p className="text-xs text-rosegold-dark">{p.category} &bull; {p.tagline}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-muted">Base Price (INR)</label>
                      <input
                        type="number"
                        defaultValue={p.basePrice}
                        onBlur={(e) => handleUpdateProductPrice(p.id, Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-muted">Advance %</label>
                      <input
                        type="number"
                        defaultValue={p.advancePct}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {p.sizes && p.sizes.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-charcoal mb-1">Configured Sizes:</p>
                      <div className="space-y-1">
                        {p.sizes.map((sz) => (
                          <div key={sz.id} className="flex justify-between text-xs py-1 px-2 rounded-lg bg-white/70 border border-charcoal/10">
                            <span>{sz.label}</span>
                            <span className="font-bold text-gold-dark">{sz.price ? inr(sz.price) : "WhatsApp"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
