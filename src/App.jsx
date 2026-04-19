import React, { useCallback, useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  LayoutGrid,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Printer,
  Shield,
  Truck,
  User,
} from "lucide-react";
import { supabase } from "./lib/supabase";

const LOGO_URL = "/logistive-logo.png";

const ADMIN_USERNAMES = ["admin", "hradmin", "payrolladmin"];
const SUPPORT_CONTACT = {
  name: "Mark Moore",
  email: "support@mylogistive.com",
  phone: "(404) 555 0119",
};

const EMPLOYEE_DIRECTORY_FALLBACK = {
  terridh9: {
    username: "terridh9",
    full_name: "Terrianna Howard",
    employee_id: "EMP-1001",
    department: "Operations",
    position: "Parcel Auditor",
    location: "Stone Mountain, GA",
    auth_email: "terridh9@mylogistive.com",
  },
  georgequalls14: {
    username: "georgequalls14",
    full_name: "George Qualls",
    employee_id: "EMP-1002",
    department: "Logistics",
    position: "Parcel Auditor",
    location: "Atlanta, GA",
    auth_email: "georgequalls14@mylogistive.com",
  },
  emp101: {
    username: "emp101",
    full_name: "Employee 101",
    employee_id: "EMP-1010",
    department: "Warehouse",
    position: "Parcel Auditor",
    location: "Decatur, GA",
    auth_email: "emp101@mylogistive.com",
  },
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount || 0));

const formatShortDate = (value) => {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPayRange = (start, end) => `${formatShortDate(start)} to ${formatShortDate(end)}`;

const maskAccountNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  const last4 = digits.slice(-4);
  return `••••${last4}`;
};

const maskRoutingNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  const last4 = digits.slice(-4);
  return `•••••${last4}`;
};

const getCurrentPeriodIndex = (paystubs) => {
  const today = new Date();
  const timed = paystubs.map((stub, index) => ({
    index,
    diff: Math.abs(new Date(`${stub.payDate}T12:00:00`) - today),
  }));
  timed.sort((a, b) => a.diff - b.diff);
  return timed[0]?.index ?? 0;
};

const createTrackingItems = (recipientName) => [
  {
    trackingNumber: "LGT042601",
    label: "Parcel Audit Return",
    recipient: recipientName,
    destination: "Atlanta, GA",
    status: "Delivered",
    date: "2026-04-02",
  },
  {
    trackingNumber: "LGT042602",
    label: "Warehouse Transfer",
    recipient: recipientName,
    destination: "Savannah, GA",
    status: "In Transit",
    date: "2026-04-03",
  },
  {
    trackingNumber: "LGT042603",
    label: "Priority Freight Review",
    recipient: recipientName,
    destination: "Macon, GA",
    status: "Delivered",
    date: "2026-04-04",
  },
  {
    trackingNumber: "LGT042604",
    label: "Regional Shipment",
    recipient: recipientName,
    destination: "Augusta, GA",
    status: "Awaiting Pickup",
    date: "2026-04-05",
  },
  {
    trackingNumber: "LGT042605",
    label: "Inventory Transfer",
    recipient: recipientName,
    destination: "Decatur, GA",
    status: "Delivered",
    date: "2026-04-06",
  },
  {
    trackingNumber: "LGT042606",
    label: "Claims Review Packet",
    recipient: recipientName,
    destination: "Athens, GA",
    status: "In Transit",
    date: "2026-04-07",
  },
  {
    trackingNumber: "LGT042607",
    label: "Route Audit Envelope",
    recipient: recipientName,
    destination: "Stone Mountain, GA",
    status: "Delivered",
    date: "2026-04-08",
  },
  {
    trackingNumber: "LGT042608",
    label: "Sorting Center File",
    recipient: recipientName,
    destination: "Atlanta, GA",
    status: "Delivered",
    date: "2026-04-09",
  },
  {
    trackingNumber: "LGT042609",
    label: "Operations Packet",
    recipient: recipientName,
    destination: "Marietta, GA",
    status: "Out for Delivery",
    date: "2026-04-10",
  },
  {
    trackingNumber: "LGT042610",
    label: "Facility Restock",
    recipient: recipientName,
    destination: "Roswell, GA",
    status: "Delivered",
    date: "2026-04-11",
  },
  {
    trackingNumber: "LGT042611",
    label: "Manifest Review",
    recipient: recipientName,
    destination: "Alpharetta, GA",
    status: "Delivered",
    date: "2026-04-12",
  },
  {
    trackingNumber: "LGT042612",
    label: "Dock Reconciliation",
    recipient: recipientName,
    destination: "College Park, GA",
    status: "Processing",
    date: "2026-04-13",
  },
];

const PAY_DATA = {
  terridh9: {
    scheduleLabel: "Biweekly",
    paystubs: [
      {
        id: "TERRI-2026-04-10",
        payDate: "2026-04-10",
        periodStart: "2026-03-10",
        periodEnd: "2026-04-10",
        regularHours: 160,
        hourlyRate: 26.25,
        grossPay: 4200,
        federalTax: 462,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 178.5,
        deductions: 0,
        bonus: 0,
        netPay: 3238.2,
        watermark: "",
      },
    ],
    deposit: {
      bankName: "Wells Fargo",
      accountType: "Checking",
      routingNumber: "111000025",
      accountNumber: "987654321234",
      lastUpdated: "2026-04-10",
    },
  },
  georgequalls14: {
    scheduleLabel: "Biweekly",
    paystubs: [
      {
        id: "GEORGE-2026-04-10",
        payDate: "2026-04-10",
        periodStart: "2026-03-10",
        periodEnd: "2026-04-10",
        regularHours: 160,
        hourlyRate: 26.25,
        grossPay: 4200,
        federalTax: 465,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 182.8,
        deductions: 0,
        bonus: 0,
        netPay: 3230.9,
        watermark: "",
      },
      {
        id: "GEORGE-2026-04-24",
        payDate: "2026-04-24",
        periodStart: "2026-04-11",
        periodEnd: "2026-04-24",
        regularHours: 80,
        hourlyRate: 52.5,
        grossPay: 4200,
        federalTax: 468,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 182.7,
        deductions: 0,
        bonus: 75,
        netPay: 3303,
        watermark: "",
      },
      {
        id: "GEORGE-2026-05-08",
        payDate: "2026-05-08",
        periodStart: "2026-04-25",
        periodEnd: "2026-05-08",
        regularHours: 80,
        hourlyRate: 52.5,
        grossPay: 4200,
        federalTax: 468,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 182.7,
        deductions: 0,
        bonus: 125,
        netPay: 3353,
        watermark: "",
      },
      {
        id: "GEORGE-2026-05-22",
        payDate: "2026-05-22",
        periodStart: "2026-05-09",
        periodEnd: "2026-05-22",
        regularHours: 80,
        hourlyRate: 52.5,
        grossPay: 4200,
        federalTax: 468,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 182.7,
        deductions: 0,
        bonus: 200,
        netPay: 3428,
        watermark: "",
      },
      {
        id: "GEORGE-2026-06-05",
        payDate: "2026-06-05",
        periodStart: "2026-05-23",
        periodEnd: "2026-06-05",
        regularHours: 80,
        hourlyRate: 52.5,
        grossPay: 4200,
        federalTax: 468,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 182.7,
        deductions: 0,
        bonus: 300,
        netPay: 3528,
        watermark: "",
      },
      {
        id: "GEORGE-2026-06-19",
        payDate: "2026-06-19",
        periodStart: "2026-06-06",
        periodEnd: "2026-06-19",
        regularHours: 80,
        hourlyRate: 52.5,
        grossPay: 4200,
        federalTax: 468,
        socialSecurity: 260.4,
        medicare: 60.9,
        gaTax: 182.7,
        deductions: 0,
        bonus: 400,
        netPay: 3628,
        watermark: "",
      },
    ],
    deposit: {
      bankName: "Bank of America",
      accountType: "Checking",
      routingNumber: "061000052",
      accountNumber: "254100778921",
      lastUpdated: "2026-04-10",
    },
  },
  emp101: {
    scheduleLabel: "Biweekly",
    paystubs: [
      {
        id: "EMP101-2026-04-10",
        payDate: "2026-04-10",
        periodStart: "2026-03-10",
        periodEnd: "2026-04-10",
        regularHours: 160,
        hourlyRate: 21.5,
        grossPay: 3440,
        federalTax: 344,
        socialSecurity: 213.28,
        medicare: 50.88,
        gaTax: 144.2,
        deductions: 0,
        bonus: 0,
        netPay: 2687.64,
        watermark: "THIS IS JUST AN EXAMPLE",
      },
      {
        id: "EMP101-2026-04-24",
        payDate: "2026-04-24",
        periodStart: "2026-04-11",
        periodEnd: "2026-04-24",
        regularHours: 80,
        hourlyRate: 43,
        grossPay: 3440,
        federalTax: 344,
        socialSecurity: 213.28,
        medicare: 50.88,
        gaTax: 144.2,
        deductions: 0,
        bonus: 0,
        netPay: 2687.64,
        watermark: "THIS IS JUST AN EXAMPLE",
      },
    ],
    deposit: {
      bankName: "Chase",
      accountType: "Savings",
      routingNumber: "021000021",
      accountNumber: "730012451100",
      lastUpdated: "2026-04-10",
    },
  },
};

function buildFutureTerriStubs(existingPaystubs) {
  const newest = existingPaystubs[existingPaystubs.length - 1];
  const future = [];
  let periodStart = new Date("2026-04-11T12:00:00");
  let payDate = new Date("2026-04-24T12:00:00");

  for (let i = 0; i < 4; i += 1) {
    const periodEnd = new Date(payDate);
    future.push({
      ...newest,
      id: `TERRI-FUTURE-${i + 1}`,
      payDate: payDate.toISOString().slice(0, 10),
      periodStart: periodStart.toISOString().slice(0, 10),
      periodEnd: periodEnd.toISOString().slice(0, 10),
    });
    periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() + 1);
    payDate = new Date(payDate);
    payDate.setDate(payDate.getDate() + 14);
  }

  return future;
}

function getEmployeeData(username) {
  const safeUsername = String(username || "").toLowerCase();
  const base = PAY_DATA[safeUsername];
  const directory = EMPLOYEE_DIRECTORY_FALLBACK[safeUsername];

  if (!base || !directory) return null;

  const paystubs =
    safeUsername === "terridh9"
      ? [...base.paystubs, ...buildFutureTerriStubs(base.paystubs)].map((stub, index) => ({
          ...stub,
          hiddenFromHistory: index > 0,
        }))
      : base.paystubs.map((stub) => ({ ...stub, hiddenFromHistory: false }));

  return {
    ...directory,
    ...base,
    paystubs,
    tracking: createTrackingItems(directory.full_name),
  };
}

function LoginScreen({
  loginForm,
  setLoginForm,
  onLogin,
  loginLoading,
  loginError,
  showPassword,
  setShowPassword,
  goToForgot,
}) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-10 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-10 flex items-center gap-4">
                  <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                    <img src={LOGO_URL} alt="Logistive LLC" className="h-28 w-28 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Logistive LLC</p>
                    <h1 className="text-3xl font-semibold">Employee Portal</h1>
                  </div>
                </div>

                <h2 className="max-w-lg text-4xl font-semibold leading-tight">
                  Secure payroll, profile, and shipment access in one employee workspace.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                  Sign in to view your pay history, update your direct deposit details,
                  review shipments, and manage your employee profile.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Shield, label: "Protected Access" },
                  { icon: CreditCard, label: "Payroll Details" },
                  { icon: Truck, label: "Shipment Tracking" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon className="mb-3 h-5 w-5" />
                    <p className="text-sm text-slate-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <img src={LOGO_URL} alt="Logistive LLC" className="h-20 w-20 object-contain" />
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Logistive LLC</p>
                  <h1 className="text-2xl font-semibold text-slate-900">Employee Portal</h1>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Use your employee username and password to continue.
                </p>
              </div>

              <form onSubmit={onLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, username: e.target.value.toLowerCase() }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                    placeholder="Enter username"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-slate-400"
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {loginError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {loginError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {loginLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button onClick={goToForgot} className="text-slate-600 transition hover:text-slate-900">
                  Forgot password?
                </button>
                <span className="text-slate-400">Secure employee access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ forgotEmail, setForgotEmail, onSubmit, loading, message, error, onBack }) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>

          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl bg-slate-100 p-3">
              <Lock className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Forgot password</h2>
              <p className="text-sm text-slate-500">
                Enter your employee email to receive a reset link.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Employee email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="name@mylogistive.com"
                autoComplete="email"
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
              {loading ? "Sending reset link..." : "Send reset link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordScreen({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  loading,
  message,
  error,
  onBack,
}) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">Create new password</h2>
            <p className="mt-2 text-sm text-slate-500">
              This page works with Supabase recovery links. Open the link from your email,
              then set your new password here.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, employeeName, onLogout, isAdmin }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { key: "pay", label: "Pay", icon: CreditCard },
    { key: "tracking", label: "Tracking", icon: Truck },
    { key: "profile", label: "Profile", icon: User },
    { key: "support", label: "Support", icon: HelpCircle },
  ];

  if (isAdmin) {
    items.push({ key: "admin", label: "Admin", icon: Shield });
  }

  return (
    <aside className="flex w-full flex-col rounded-3xl bg-slate-900 p-5 text-white lg:w-72">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-2.5">
          <img src={LOGO_URL} alt="Logistive LLC" className="h-10 w-10 object-contain" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Logistive LLC</p>
          <h2 className="text-lg font-semibold">Employee Portal</h2>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
        <p className="mt-2 font-medium text-white">{employeeName}</p>
      </div>

      <nav className="space-y-2">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                isActive ? "bg-white text-slate-900" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        <p className="mt-4 text-center text-xs text-slate-400">© 2020–2026 Logistive LLC</p>
      </div>
    </aside>
  );
}

function DashboardTab({ employee, onViewPay }) {
  const visiblePaystubs = employee.paystubs.filter((stub) => !stub.hiddenFromHistory);
  const latestVisible = visiblePaystubs[visiblePaystubs.length - 1];
  const currentIndex = getCurrentPeriodIndex(employee.paystubs);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{employee.full_name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Review your payroll activity, shipment updates, and employee details from your portal dashboard.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Current pay period</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatPayRange(
                employee.paystubs[currentIndex]?.periodStart,
                employee.paystubs[currentIndex]?.periodEnd
              )}
            </p>
            <p className="mt-1 text-sm text-slate-500">Schedule: {employee.scheduleLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Latest Net Pay",
            value: formatMoney(latestVisible?.netPay || 0),
            icon: CreditCard,
          },
          {
            label: "Next Pay Date",
            value: formatShortDate(employee.paystubs[Math.min(currentIndex + 1, employee.paystubs.length - 1)]?.payDate),
            icon: CalendarDays,
          },
          {
            label: "Position",
            value: employee.position,
            icon: Building2,
          },
          {
            label: "Employee ID",
            value: employee.employee_id,
            icon: FileText,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent pay activity</h2>
              <p className="mt-1 text-sm text-slate-500">Most recent available pay history in your account.</p>
            </div>
            <button
              onClick={onViewPay}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Open pay tab
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {visiblePaystubs.slice().reverse().map((stub) => (
              <div key={stub.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Pay date</p>
                    <p className="text-base font-semibold text-slate-900">{formatShortDate(stub.payDate)}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatPayRange(stub.periodStart, stub.periodEnd)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-slate-500">Net pay</p>
                    <p className="text-xl font-semibold text-slate-900">{formatMoney(stub.netPay)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Direct deposit summary</h2>
          <div className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">Bank</p>
              <p className="font-medium text-slate-900">{employee.deposit.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Routing</p>
              <p className="font-medium text-slate-900">{maskRoutingNumber(employee.deposit.routingNumber)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Account</p>
              <p className="font-medium text-slate-900">{maskAccountNumber(employee.deposit.accountNumber)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Last updated</p>
              <p className="font-medium text-slate-900">{formatShortDate(employee.deposit.lastUpdated)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaystubModal({ stub, employee, onClose, onDownload }) {
  if (!stub) return null;

  const totalTaxes = stub.federalTax + stub.socialSecurity + stub.medicare + stub.gaTax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Paystub detail</h3>
            <p className="text-sm text-slate-500">{employee.full_name} • {formatShortDate(stub.payDate)}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700">
            Close
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Employer</p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-900">Logistive LLC</h4>
                <p className="mt-1 text-sm text-slate-500">Payroll Statement</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:min-w-[360px]">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Employee</p>
                  <p className="mt-1 font-medium text-slate-900">{employee.full_name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Employee ID</p>
                  <p className="mt-1 font-medium text-slate-900">{employee.employee_id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pay period</p>
                  <p className="mt-1 font-medium text-slate-900">{formatPayRange(stub.periodStart, stub.periodEnd)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pay date</p>
                  <p className="mt-1 font-medium text-slate-900">{formatShortDate(stub.payDate)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-5">
                <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Earnings</h5>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Regular Hours</span>
                    <span>{stub.regularHours}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Rate</span>
                    <span>{formatMoney(stub.hourlyRate)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Bonus</span>
                    <span>{formatMoney(stub.bonus)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900">
                    <span>Gross Pay</span>
                    <span>{formatMoney(stub.grossPay + stub.bonus)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Taxes</h5>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Federal</span>
                    <span>{formatMoney(stub.federalTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Social Security</span>
                    <span>{formatMoney(stub.socialSecurity)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Medicare</span>
                    <span>{formatMoney(stub.medicare)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Georgia Tax</span>
                    <span>{formatMoney(stub.gaTax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900">
                    <span>Total Taxes</span>
                    <span>{formatMoney(totalTaxes)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Deposit</h5>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Bank</span>
                    <span>{employee.deposit.bankName}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Account Type</span>
                    <span>{employee.deposit.accountType}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Routing</span>
                    <span>{maskRoutingNumber(employee.deposit.routingNumber)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Account</span>
                    <span>{maskAccountNumber(employee.deposit.accountNumber)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-semibold text-slate-900">
                    <span>Net Pay</span>
                    <span>{formatMoney(stub.netPay)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onDownload(stub)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={() => {
                onDownload(stub);
                setTimeout(() => window.print(), 200);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayTab({ employee, depositForm, setDepositForm, onSaveDeposit, depositSaving, depositMessage, depositError, onViewStub, onDownloadStub }) {
  const visiblePaystubs = employee.paystubs.filter((stub) => !stub.hiddenFromHistory);
  const currentPeriodIndex = getCurrentPeriodIndex(employee.paystubs);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Pay</h1>
              <p className="mt-1 text-sm text-slate-500">
                Paystubs, pay schedule, and downloadable payroll statements.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {employee.scheduleLabel}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {visiblePaystubs.slice().reverse().map((stub) => (
              <div key={stub.id} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Pay date</p>
                    <p className="text-lg font-semibold text-slate-900">{formatShortDate(stub.payDate)}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatPayRange(stub.periodStart, stub.periodEnd)}
                    </p>
                  </div>
                  <div className="grid gap-2 text-left lg:text-right">
                    <div>
                      <p className="text-sm text-slate-500">Gross pay</p>
                      <p className="font-semibold text-slate-900">{formatMoney(stub.grossPay + stub.bonus)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Net pay</p>
                      <p className="text-xl font-semibold text-slate-900">{formatMoney(stub.netPay)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => onViewStub(stub)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <FileText className="h-4 w-4" />
                    View Stub
                  </button>
                  <button
                    onClick={() => onDownloadStub(stub)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Pay schedule</h2>
            <div className="mt-5 grid gap-3">
              {employee.paystubs.map((stub, index) => {
                const isActive = index === currentPeriodIndex;
                return (
                  <div
                    key={stub.id}
                    className={`rounded-2xl border p-4 ${
                      isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-sm ${isActive ? "text-slate-300" : "text-slate-500"}`}>Pay date</p>
                        <p className="font-semibold">{formatShortDate(stub.payDate)}</p>
                        <p className={`mt-1 text-sm ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                          {formatPayRange(stub.periodStart, stub.periodEnd)}
                        </p>
                      </div>
                      {isActive ? (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em]">
                          Current
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Direct deposit</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your full routing and account number. The portal stores a masked display version for the UI.
              </p>
            </div>

            <form onSubmit={onSaveDeposit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Bank name</label>
                <input
                  type="text"
                  value={depositForm.bankName}
                  onChange={(e) => setDepositForm((prev) => ({ ...prev, bankName: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Account type</label>
                <select
                  value={depositForm.accountType}
                  onChange={(e) => setDepositForm((prev) => ({ ...prev, accountType: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Routing number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={depositForm.routingNumber}
                  onChange={(e) =>
                    setDepositForm((prev) => ({
                      ...prev,
                      routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9),
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="9 digit routing number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Account number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={depositForm.accountNumber}
                  onChange={(e) =>
                    setDepositForm((prev) => ({
                      ...prev,
                      accountNumber: e.target.value.replace(/\D/g, "").slice(0, 17),
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Full account number"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p>Masked routing shown in portal: <span className="font-medium text-slate-900">{maskRoutingNumber(depositForm.routingNumber)}</span></p>
                <p className="mt-1">Masked account shown in portal: <span className="font-medium text-slate-900">{maskAccountNumber(depositForm.accountNumber)}</span></p>
              </div>

              {depositMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {depositMessage}
                </div>
              ) : null}

              {depositError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {depositError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={depositSaving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
              >
                {depositSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                {depositSaving ? "Saving deposit info..." : "Save direct deposit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingTab({ employee }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Tracking</h1>
        <p className="mt-1 text-sm text-slate-500">
          Recent package and shipment activity associated with your employee account.
        </p>
      </div>

      <div className="grid gap-4">
        {employee.tracking.map((item) => (
          <div key={item.trackingNumber} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{item.trackingNumber}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Recipient: {item.recipient} • Destination: {item.destination}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-700">
                  {item.status}
                </span>
                <p className="mt-2 text-sm text-slate-500">Updated {formatShortDate(item.date)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab({ profileForm, setProfileForm, onSaveProfile, profileSaving, profileMessage, employee }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="text-sm text-slate-500">Full name</p>
            <p className="font-medium text-slate-900">{employee.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Username</p>
            <p className="font-medium text-slate-900">{employee.username}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Department</p>
            <p className="font-medium text-slate-900">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Position</p>
            <p className="font-medium text-slate-900">{employee.position}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-medium text-slate-900">{employee.location}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Update profile</h2>
        <p className="mt-1 text-sm text-slate-500">
          Edit your phone number, address, and email here. Email remains hidden elsewhere in the portal.
        </p>

        <form onSubmit={onSaveProfile} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
            <input
              type="text"
              value={profileForm.address}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>

          {profileMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {profileMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={profileSaving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {profileSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <User className="h-5 w-5" />}
            {profileSaving ? "Saving profile..." : "Save profile changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SupportTab() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Support</h1>
      <p className="mt-1 text-sm text-slate-500">
        Contact support for payroll, access, or shipment assistance.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-5">
          <Phone className="mb-4 h-5 w-5 text-slate-700" />
          <p className="text-sm text-slate-500">Phone</p>
          <p className="mt-1 font-semibold text-slate-900">{SUPPORT_CONTACT.phone}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <Mail className="mb-4 h-5 w-5 text-slate-700" />
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-1 font-semibold text-slate-900">{SUPPORT_CONTACT.email}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <User className="mb-4 h-5 w-5 text-slate-700" />
          <p className="text-sm text-slate-500">Contact</p>
          <p className="mt-1 font-semibold text-slate-900">{SUPPORT_CONTACT.name}</p>
        </div>
      </div>
    </div>
  );
}

function AdminTab() {
  const employees = Object.values(EMPLOYEE_DIRECTORY_FALLBACK);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Admin</h1>
        <p className="mt-1 text-sm text-slate-500">
          Multi employee view for payroll and employee directory review.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-slate-500">
              <th className="px-4">Employee</th>
              <th className="px-4">Username</th>
              <th className="px-4">ID</th>
              <th className="px-4">Department</th>
              <th className="px-4">Position</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.username} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-900">{employee.full_name}</td>
                <td className="px-4 py-4">{employee.username}</td>
                <td className="px-4 py-4">{employee.employee_id}</td>
                <td className="px-4 py-4">{employee.department}</td>
                <td className="rounded-r-2xl px-4 py-4">{employee.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("login");
  const [session, setSession] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingSession, setLoadingSession] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const [resetPassword, setResetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const [depositForm, setDepositForm] = useState({
    bankName: "",
    accountType: "Checking",
    routingNumber: "",
    accountNumber: "",
  });
  const [depositSaving, setDepositSaving] = useState(false);
  const [depositMessage, setDepositMessage] = useState("");
  const [depositError, setDepositError] = useState("");

  const [profileForm, setProfileForm] = useState({
    phone: "(404) 555 0191",
    address: "Stone Mountain, GA",
    email: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [selectedStub, setSelectedStub] = useState(null);

  const isAdmin = useMemo(
    () => ADMIN_USERNAMES.includes(String(employee?.username || "").toLowerCase()),
    [employee]
  );

  const loadEmployeeFromUser = useCallback(async (user) => {
    if (!user) {
      setEmployee(null);
      return;
    }

    const email = String(user.email || "").toLowerCase();
    let username = "";

    try {
      const { data } = await supabase
        .from("employee_directory")
        .select("username, auth_email, full_name, employee_id, department, position, location")
        .eq("auth_email", email)
        .maybeSingle();

      if (data?.username) {
        username = String(data.username).toLowerCase();
      }
    } catch (error) {
      console.error("Employee directory fetch failed", error);
    }

    if (!username) {
      const fallbackMatch = Object.values(EMPLOYEE_DIRECTORY_FALLBACK).find(
        (entry) => String(entry.auth_email).toLowerCase() === email
      );
      username = fallbackMatch?.username || "";
    }

    const details = getEmployeeData(username);

    if (!details) {
      setEmployee(null);
      return;
    }

    setEmployee(details);
    setDepositForm({
      bankName: details.deposit.bankName,
      accountType: details.deposit.accountType,
      routingNumber: details.deposit.routingNumber,
      accountNumber: details.deposit.accountNumber,
    });
    setProfileForm((prev) => ({
      ...prev,
      address: details.location,
      email: details.auth_email,
    }));
  }, []);

  useEffect(() => {
    let mounted = true;

    const forceStopLoading = window.setTimeout(() => {
      if (mounted) {
        setLoadingSession(false);
        setView((prev) => (prev === "portal" || prev === "reset" || prev === "forgot" ? prev : "login"));
      }
    }, 4000);

    const bootstrapSession = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const type = hashParams.get("type");
        if (type === "recovery") {
          if (mounted) {
            setView("reset");
          }
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error(error);
        }

        if (!mounted) return;

        setSession(data?.session ?? null);
        if (data?.session?.user) {
          await loadEmployeeFromUser(data.session.user);
          if (mounted) {
            setView("portal");
          }
        } else if (mounted) {
          setView("login");
        }
      } catch (error) {
        console.error("Session bootstrap failed", error);
        if (mounted) {
          setSession(null);
          setEmployee(null);
          setView("login");
        }
      } finally {
        if (mounted) {
          setLoadingSession(false);
        }
      }
    };

    bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      try {
        setSession(newSession ?? null);

        if (event === "PASSWORD_RECOVERY") {
          setView("reset");
          return;
        }

        if (newSession?.user) {
          await loadEmployeeFromUser(newSession.user);
          if (mounted) {
            setView("portal");
          }
        } else if (view !== "forgot") {
          setEmployee(null);
          setView("login");
        }
      } catch (error) {
        console.error("Auth state change failed", error);
        if (mounted) {
          setEmployee(null);
          setView("login");
        }
      } finally {
        if (mounted) {
          setLoadingSession(false);
        }
      }
    });

    return () => {
      mounted = false;
      window.clearTimeout(forceStopLoading);
      subscription.unsubscribe();
    };
  }, [loadEmployeeFromUser, view]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const username = String(loginForm.username || "").trim().toLowerCase();
      const password = String(loginForm.password || "");

      if (!username || !password) {
        setLoginError("Enter your username and password.");
        return;
      }

      let email = EMPLOYEE_DIRECTORY_FALLBACK[username]?.auth_email || "";

      try {
        const { data } = await supabase
          .from("employee_directory")
          .select("auth_email")
          .eq("username", username)
          .maybeSingle();

        if (data?.auth_email) {
          email = data.auth_email;
        }
      } catch (error) {
        console.error("Directory email lookup failed", error);
      }

      if (!email) {
        setLoginError("That username was not found in the employee directory.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message || "Unable to sign in. Please try again.");
        return;
      }

      setLoginForm({ username: username.toLowerCase(), password: "" });
      setActiveTab("dashboard");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotLoading(true);

    try {
      if (!forgotEmail.trim()) {
        setForgotError("Enter your employee email address.");
        return;
      }

      const redirectTo = `${window.location.origin}`;
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo,
      });

      if (error) {
        setForgotError(error.message || "Unable to send reset link.");
        return;
      }

      setForgotMessage("Reset link sent. Check your email and open the recovery link.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      if (!resetPassword || !confirmPassword) {
        setResetError("Enter and confirm your new password.");
        return;
      }

      if (resetPassword.length < 8) {
        setResetError("Your new password must be at least 8 characters.");
        return;
      }

      if (resetPassword !== confirmPassword) {
        setResetError("Passwords do not match.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: resetPassword });
      if (error) {
        setResetError(error.message || "Unable to update password.");
        return;
      }

      setResetMessage("Password updated. You can now sign in with your new password.");
      setTimeout(() => {
        setView("login");
        setResetPassword("");
        setConfirmPassword("");
      }, 1200);
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setEmployee(null);
    setActiveTab("dashboard");
    setView("login");
  };

  const handleSaveDeposit = async (e) => {
    e.preventDefault();
    setDepositError("");
    setDepositMessage("");
    setDepositSaving(true);

    try {
      const routing = String(depositForm.routingNumber || "").replace(/\D/g, "");
      const account = String(depositForm.accountNumber || "").replace(/\D/g, "");

      if (!depositForm.bankName.trim()) {
        setDepositError("Enter a bank name.");
        return;
      }

      if (routing.length !== 9) {
        setDepositError("Routing number must be exactly 9 digits.");
        return;
      }

      if (account.length < 6) {
        setDepositError("Account number must be at least 6 digits.");
        return;
      }

      const updatedDeposit = {
        bankName: depositForm.bankName.trim(),
        accountType: depositForm.accountType,
        routingNumber: routing,
        accountNumber: account,
        maskedRouting: maskRoutingNumber(routing),
        maskedAccount: maskAccountNumber(account),
        lastUpdated: new Date().toISOString().slice(0, 10),
      };

      setEmployee((prev) =>
        prev
          ? {
              ...prev,
              deposit: updatedDeposit,
            }
          : prev
      );

      setDepositMessage(
        `Direct deposit updated successfully. Your account now displays as ${updatedDeposit.maskedAccount}.`
      );
    } finally {
      setDepositSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");

    setTimeout(() => {
      setEmployee((prev) =>
        prev
          ? {
              ...prev,
              location: profileForm.address || prev.location,
              auth_email: profileForm.email || prev.auth_email,
            }
          : prev
      );
      setProfileMessage("Profile updates saved.");
      setProfileSaving(false);
    }, 500);
  };

  const generatePaystubPdf = (stub) => {
    if (!employee || !stub) return;

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const totalTaxes = stub.federalTax + stub.socialSecurity + stub.medicare + stub.gaTax;
    const grossWithBonus = stub.grossPay + stub.bonus;

    doc.setFillColor(20, 29, 47);
    doc.rect(0, 0, 612, 92, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("LOGISTIVE LLC", 44, 48);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Payroll Statement", 44, 68);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Employee", 44, 122);
    doc.text("Pay Information", 320, 122);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Name: ${employee.full_name}`, 44, 144);
    doc.text(`Employee ID: ${employee.employee_id}`, 44, 162);
    doc.text(`Position: ${employee.position}`, 44, 180);
    doc.text(`Department: ${employee.department}`, 44, 198);

    doc.text(`Pay Date: ${formatShortDate(stub.payDate)}`, 320, 144);
    doc.text(`Pay Period: ${formatPayRange(stub.periodStart, stub.periodEnd)}`, 320, 162);
    doc.text(`Pay Schedule: ${employee.scheduleLabel}`, 320, 180);
    doc.text(`Deposit Account: ${maskAccountNumber(employee.deposit.accountNumber)}`, 320, 198);

    const tableY = 236;
    const columnX = [44, 236, 428];
    const cardWidth = 140;
    const cardHeight = 170;

    const drawCard = (title, rows, x) => {
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, tableY, cardWidth, cardHeight, 14, 14, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(title, x + 16, tableY + 24);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let rowY = tableY + 50;
      rows.forEach(([label, value], index) => {
        doc.text(label, x + 16, rowY);
        doc.text(value, x + cardWidth - 16, rowY, { align: "right" });
        if (index !== rows.length - 1) {
          doc.setDrawColor(226, 232, 240);
          doc.line(x + 16, rowY + 10, x + cardWidth - 16, rowY + 10);
        }
        rowY += 26;
      });
    };

    drawCard(
      "Earnings",
      [
        ["Regular Hours", String(stub.regularHours)],
        ["Hourly Rate", formatMoney(stub.hourlyRate)],
        ["Bonus", formatMoney(stub.bonus)],
        ["Gross Pay", formatMoney(grossWithBonus)],
      ],
      columnX[0]
    );

    drawCard(
      "Taxes",
      [
        ["Federal", formatMoney(stub.federalTax)],
        ["Social Security", formatMoney(stub.socialSecurity)],
        ["Medicare", formatMoney(stub.medicare)],
        ["Georgia Tax", formatMoney(stub.gaTax)],
      ],
      columnX[1]
    );

    drawCard(
      "Net Pay Summary",
      [
        ["Total Taxes", formatMoney(totalTaxes)],
        ["Deductions", formatMoney(stub.deductions)],
        ["Net Pay", formatMoney(stub.netPay)],
        ["Deposit", employee.deposit.accountType],
      ],
      columnX[2]
    );

    if (stub.watermark) {
      doc.saveGraphicsState();
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(28);
      doc.text(stub.watermark, 306, 520, {
        angle: 30,
        align: "center",
      });
      doc.restoreGraphicsState();
      doc.setTextColor(15, 23, 42);
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Confidential payroll information", 44, 742);
    doc.text("© 2020–2026 Logistive LLC", 568, 742, { align: "right" });

    doc.save(`paystub-${employee.username}-${stub.payDate}.pdf`);
  };

  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 rounded-3xl bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
          <span className="text-slate-700">Loading login page...</span>
        </div>
      </div>
    );
  }

  if (view === "forgot") {
    return (
      <ForgotPasswordScreen
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        onSubmit={handleForgotPassword}
        loading={forgotLoading}
        message={forgotMessage}
        error={forgotError}
        onBack={() => setView("login")}
      />
    );
  }

  if (view === "reset") {
    return (
      <ResetPasswordScreen
        password={resetPassword}
        setPassword={setResetPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={handleResetPassword}
        loading={resetLoading}
        message={resetMessage}
        error={resetError}
        onBack={() => setView("login")}
      />
    );
  }

  if (view !== "portal" || !session || !employee) {
    return (
      <LoginScreen
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        onLogin={handleLogin}
        loginLoading={loginLoading}
        loginError={loginError}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        goToForgot={() => {
          setForgotError("");
          setForgotMessage("");
          setView("forgot");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[288px_1fr]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          employeeName={employee.full_name}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />

        <main className="min-w-0">
          {activeTab === "dashboard" ? <DashboardTab employee={employee} onViewPay={() => setActiveTab("pay")} /> : null}
          {activeTab === "pay" ? (
            <PayTab
              employee={employee}
              depositForm={depositForm}
              setDepositForm={setDepositForm}
              onSaveDeposit={handleSaveDeposit}
              depositSaving={depositSaving}
              depositMessage={depositMessage}
              depositError={depositError}
              onViewStub={setSelectedStub}
              onDownloadStub={generatePaystubPdf}
            />
          ) : null}
          {activeTab === "tracking" ? <TrackingTab employee={employee} /> : null}
          {activeTab === "profile" ? (
            <ProfileTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onSaveProfile={handleSaveProfile}
              profileSaving={profileSaving}
              profileMessage={profileMessage}
              employee={employee}
            />
          ) : null}
          {activeTab === "support" ? <SupportTab /> : null}
          {activeTab === "admin" && isAdmin ? <AdminTab /> : null}
        </main>
      </div>

      {employee ? (
        <PaystubModal
          stub={selectedStub}
          employee={employee}
          onClose={() => setSelectedStub(null)}
          onDownload={generatePaystubPdf}
        />
      ) : null}
    </div>
  );
}
