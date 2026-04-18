import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Download,
  Printer,
  CreditCard,
  CalendarDays,
  FileText,
  LogOut,
  LayoutGrid,
  Truck,
  User,
  HelpCircle,
  Mail,
  Phone,
  Save,
  MapPin,
  Landmark,
  BadgeDollarSign,
  CircleDollarSign,
} from "lucide-react";
import { supabase } from "./lib/supabase";

const COMPANY = {
  name: "Logistive LLC",
  logo: "/logistive-logo.png",
  employeePortalTitle: "Employee Self Service",
  buildTag: "April 18 secure portal",
};

const PAY_DATA = {
  terridh9: {
    paySchedule: "Monthly",
    payMethod: "Direct Deposit",
    accountMask: "Account ending in 3581",
    nextPayDate: "2026-05-10",
    paystubs: [
      {
        id: "PS-2026-04-10",
        payDate: "2026-04-10",
        periodStart: "2026-03-10",
        periodEnd: "2026-04-09",
        grossPay: 4380.0,
        overtime: 0.0,
        bonus: 0.0,
        federalTax: 406.21,
        stateTax: 133.4,
        socialSecurity: 218.16,
        medicare: 51.02,
        otherDeductions: 0.38,
        netPay: 3570.83,
        pdfPath: "/paystubs/Terrianna_Howard_2026-04-10_paystub.pdf",
      },
    ],
  },
  georgequalls14: {
    paySchedule: "Biweekly",
    payMethod: "Direct Deposit",
    accountMask: "Account ending in 4412",
    nextPayDate: "2026-04-24",
    paystubs: [
      {
        id: "PS-2026-04-10",
        payDate: "2026-04-10",
        periodStart: "2026-03-27",
        periodEnd: "2026-04-09",
        grossPay: 4260,
        bonus: 60,
        overtime: 0.0,
        federalTax: 445.17,
        stateTax: 229.61,
        socialSecurity: 264.12,
        medicare: 61.77,
        otherDeductions: 0.39,
        netPay: 3258.94,
        pdfPath: "/paystubs/George_Qualls_2026-04-10_paystub.pdf",
      },
      {
        id: "PS-2026-03-13",
        payDate: "2026-03-13",
        periodStart: "2026-02-27",
        periodEnd: "2026-03-12",
        grossPay: 4515,
        bonus: 315,
        overtime: 0.0,
        federalTax: 492.14,
        stateTax: 243.36,
        socialSecurity: 279.93,
        medicare: 65.47,
        otherDeductions: 0.47,
        netPay: 3433.63,
        pdfPath: "/paystubs/George_Qualls_2026-03-13_paystub.pdf",
      },
      {
        id: "PS-2026-02-27",
        payDate: "2026-02-27",
        periodStart: "2026-02-13",
        periodEnd: "2026-02-26",
        grossPay: 4285,
        bonus: 85,
        overtime: 0.0,
        federalTax: 441.35,
        stateTax: 230.96,
        socialSecurity: 265.67,
        medicare: 62.13,
        otherDeductions: 0.41,
        netPay: 3284.48,
        pdfPath: "/paystubs/George_Qualls_2026-02-27_paystub.pdf",
      },
      {
        id: "PS-2026-02-13",
        payDate: "2026-02-13",
        periodStart: "2026-01-30",
        periodEnd: "2026-02-12",
        grossPay: 4420,
        bonus: 220,
        overtime: 0.0,
        federalTax: 472.94,
        stateTax: 238.24,
        socialSecurity: 274.04,
        medicare: 64.09,
        otherDeductions: 0.44,
        netPay: 3370.25,
        pdfPath: "/paystubs/George_Qualls_2026-02-13_paystub.pdf",
      },
      {
        id: "PS-2026-01-30",
        payDate: "2026-01-30",
        periodStart: "2026-01-16",
        periodEnd: "2026-01-29",
        grossPay: 4200,
        bonus: 0,
        overtime: 0.0,
        federalTax: 428.4,
        stateTax: 226.38,
        socialSecurity: 260.4,
        medicare: 60.9,
        otherDeductions: 0.38,
        netPay: 3223.54,
        pdfPath: "/paystubs/George_Qualls_2026-01-30_paystub.pdf",
      },
      {
        id: "PS-2026-01-16",
        payDate: "2026-01-16",
        periodStart: "2026-01-02",
        periodEnd: "2026-01-15",
        grossPay: 4345,
        bonus: 145,
        overtime: 0.0,
        federalTax: 451.88,
        stateTax: 234.2,
        socialSecurity: 269.39,
        medicare: 63.0,
        otherDeductions: 0.42,
        netPay: 3326.11,
        pdfPath: "/paystubs/George_Qualls_2026-01-16_paystub.pdf",
      },
    ],
  },
  emp101: {
    paySchedule: "Weekly",
    payMethod: "Paper Check",
    accountMask: "Example record only",
    nextPayDate: "2026-04-17",
    paystubs: [
      {
        id: "PS-2026-04-10",
        payDate: "2026-04-10",
        periodStart: "2026-04-04",
        periodEnd: "2026-04-10",
        grossPay: 2385.0,
        bonus: 0.0,
        overtime: 0.0,
        federalTax: 194.38,
        stateTax: 103.75,
        socialSecurity: 147.87,
        medicare: 34.58,
        otherDeductions: 26.75,
        netPay: 1877.67,
        pdfPath: "/paystubs/Employee_101_2026-04-10_example_paystub.pdf",
      },
      {
        id: "PS-2026-04-03",
        payDate: "2026-04-03",
        periodStart: "2026-03-28",
        periodEnd: "2026-04-03",
        grossPay: 2310.0,
        bonus: 0.0,
        overtime: 0.0,
        federalTax: 188.27,
        stateTax: 100.49,
        socialSecurity: 143.22,
        medicare: 33.5,
        otherDeductions: 22.5,
        netPay: 1822.02,
        pdfPath: "/paystubs/Employee_101_2026-04-03_example_paystub.pdf",
      },
    ],
  },
};

const DIRECT_DEPOSIT_DATA = {
  terridh9: {
    status: "Active",
    bankName: "Bank of America",
    accountType: "Checking",
    routingMask: "Routing ending in 0026",
    accountMask: "Account ending in 3581",
    effectiveDate: "2026-03-10",
  },
  georgequalls14: {
    status: "Active",
    bankName: "Wells Fargo",
    accountType: "Checking",
    routingMask: "Routing ending in 9110",
    accountMask: "Account ending in 4412",
    effectiveDate: "2026-01-02",
  },
  emp101: {
    status: "Not enrolled",
    bankName: "None on file",
    accountType: "Paper check",
    routingMask: "No routing number on file",
    accountMask: "No direct deposit account on file",
    effectiveDate: "2026-04-10",
  },
};

const W2_DATA = {
  terridh9: [],
  georgequalls14: [],
  emp101: [],
};

const TRACKING_DATA = {
  terridh9: [
    {
      id: "LGT2404017781",
      date: "2026-04-01",
      destination: "Charlotte, NC",
      status: "Delivered",
      recipient: "Terrianna Howard",
    },
    {
      id: "LGT2404058827",
      date: "2026-04-05",
      destination: "Jacksonville, FL",
      status: "In Transit",
      recipient: "Terrianna Howard",
    },
    {
      id: "LGT2404092055",
      date: "2026-04-09",
      destination: "Memphis, TN",
      status: "Processing",
      recipient: "Terrianna Howard",
    },
  ],
  georgequalls14: [
    {
      id: "LGT2404026601",
      date: "2026-04-02",
      destination: "Charlotte, NC",
      status: "Delivered",
      recipient: "George Qualls",
    },
    {
      id: "LGT2404121184",
      date: "2026-04-12",
      destination: "Memphis, TN",
      status: "Processing",
      recipient: "George Qualls",
    },
    {
      id: "LGT2404297108",
      date: "2026-04-29",
      destination: "Houston, TX",
      status: "In Transit",
      recipient: "George Qualls",
    },
  ],
  emp101: [
    {
      id: "LGT2404019001",
      date: "2026-04-01",
      destination: "Charlotte, NC",
      status: "Delivered",
      recipient: "Employee 101",
    },
    {
      id: "LGT2404113377",
      date: "2026-04-11",
      destination: "Memphis, TN",
      status: "Processing",
      recipient: "Employee 101",
    },
    {
      id: "LGT2404289943",
      date: "2026-04-28",
      destination: "Houston, TX",
      status: "In Transit",
      recipient: "Employee 101",
    },
  ],
};

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function formatDate(dateString) {
  if (!dateString) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parseLocalDate(dateString));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

function mapDirectoryEmployee(row) {
  return {
    username: row.username,
    name: row.full_name || row.username,
    employeeId: row.employee_id || "",
    department: row.department || "",
    position: row.position || "",
    location: row.location || "",
    email: row.auth_email || "",
    phone: "",
    address: "",
  };
}

function downloadPaystub(stub) {
  if (!stub.pdfPath) {
    alert("No uploaded PDF is attached to this paystub yet.");
    return;
  }

  const link = document.createElement("a");
  link.href = stub.pdfPath;
  link.download = stub.pdfPath.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printPaystubFromFile(stub) {
  if (!stub.pdfPath) {
    alert("No uploaded PDF is attached to this paystub yet.");
    return;
  }

  const printWindow = window.open(stub.pdfPath, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      try {
        printWindow.print();
      } catch (error) {
        console.error(error);
      }
    };
  }
}

function Footer() {
  return (
    <div className="text-center text-sm text-slate-500 py-8">
      © 2020 to 2026 Logistive LLC
    </div>
  );
}

function Sidebar({ page, setPage, logout }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { key: "pay", label: "Pay", icon: FileText },
    { key: "deposit", label: "Direct Deposit", icon: Landmark },
    { key: "taxes", label: "W2 Forms", icon: BadgeDollarSign },
    { key: "tracking", label: "Tracking", icon: Truck },
    { key: "profile", label: "Profile", icon: User },
    { key: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="w-full md:w-72 bg-slate-950 text-white rounded-[28px] p-5 shadow-2xl border border-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <img src={COMPANY.logo} alt="Company logo" className="h-14 w-auto" />
      </div>

      <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">
        Workspace
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = page === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                active
                  ? "bg-white text-slate-950 shadow-lg"
                  : "text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="mt-8 w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3"
      >
        <LogOut className="h-5 w-5" />
        <span>Log out</span>
      </button>
    </div>
  );
}

function Topbar({ employee }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div>
        <div className="text-sm text-slate-500">
          {COMPANY.employeePortalTitle} • {COMPANY.buildTag}
        </div>
        <h1 className="text-3xl font-bold text-slate-950">
          Welcome back, {employee.name?.split(" ")[0] || "Employee"}
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="text-xs text-slate-500">Employee ID</div>
        <div className="font-semibold text-slate-950">{employee.employeeId}</div>
      </div>
    </div>
  );
}

function DashboardPage({ employee }) {
  const payInfo = PAY_DATA[employee.username.toLowerCase()];
  const latestStub = payInfo?.paystubs?.[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Next pay date</div>
          <div className="text-3xl font-bold text-slate-950 mt-2">
            {payInfo ? formatDate(payInfo.nextPayDate) : "Not available"}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {payInfo?.paySchedule || "No schedule on file"}
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Last net pay</div>
          <div className="text-3xl font-bold text-slate-950 mt-2">
            {latestStub ? formatCurrency(latestStub.netPay) : "Not available"}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {latestStub ? `Paid on ${formatDate(latestStub.payDate)}` : "No paystub available"}
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Payment method</div>
          <div className="text-3xl font-bold text-slate-950 mt-2">
            {payInfo?.payMethod || "Not available"}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {payInfo?.accountMask || "No payment account on file"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
          <div className="text-sm text-slate-500">Payroll overview</div>
          <h2 className="text-2xl font-bold text-slate-950 mt-1">Current pay summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <div className="text-sm text-slate-500">Gross pay</div>
              <div className="text-2xl font-bold text-slate-950 mt-2">
                {latestStub ? formatCurrency(latestStub.grossPay) : "$0.00"}
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
              <div className="text-sm text-emerald-700">Net pay</div>
              <div className="text-2xl font-bold text-emerald-900 mt-2">
                {latestStub ? formatCurrency(latestStub.netPay) : "$0.00"}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
              <div className="text-sm text-amber-700">Bonus</div>
              <div className="text-2xl font-bold text-amber-900 mt-2">
                {latestStub ? formatCurrency(latestStub.bonus || 0) : "$0.00"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
          <div className="text-sm text-slate-500">Employee record</div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between gap-4">
              <span>Department</span>
              <span className="font-semibold text-slate-950">{employee.department}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Position</span>
              <span className="font-semibold text-slate-950">{employee.position}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Location</span>
              <span className="font-semibold text-slate-950">{employee.location}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Status</span>
              <span className="font-semibold text-emerald-700">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayPage({ employee }) {
  const employeeKey = employee.username.toLowerCase();
  const payInfo = PAY_DATA[employeeKey];
  const paystubs = payInfo?.paystubs || [];
  const [selectedStub, setSelectedStub] = useState(paystubs[0] || null);

  useEffect(() => {
    setSelectedStub(paystubs[0] || null);
  }, [employeeKey]);

  if (!payInfo || !selectedStub) {
    return (
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        No pay data found.
      </div>
    );
  }

  const totalDeductions =
    selectedStub.federalTax +
    selectedStub.stateTax +
    selectedStub.socialSecurity +
    selectedStub.medicare +
    selectedStub.otherDeductions;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.35fr] gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
          <div className="text-sm text-slate-500">Payment profile</div>
          <div className="text-2xl font-bold text-slate-950 mt-1">{employee.name}</div>

          <div className="grid grid-cols-1 gap-4 mt-5">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-slate-700 mt-1" />
              <div>
                <div className="text-sm text-slate-500">Payment method</div>
                <div className="font-semibold text-slate-950">{payInfo.payMethod}</div>
                <div className="text-sm text-slate-600 mt-1">{payInfo.accountMask}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-slate-700 mt-1" />
              <div>
                <div className="text-sm text-slate-500">Pay schedule</div>
                <div className="font-semibold text-slate-950">{payInfo.paySchedule}</div>
                <div className="text-sm text-slate-600 mt-1">
                  Next pay date: {formatDate(payInfo.nextPayDate)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
              <CircleDollarSign className="h-5 w-5 text-slate-700 mt-1" />
              <div>
                <div className="text-sm text-slate-500">Selected statement</div>
                <div className="font-semibold text-slate-950">{formatDate(selectedStub.payDate)}</div>
                <div className="text-sm text-slate-600 mt-1">
                  Bonus included: {formatCurrency(selectedStub.bonus || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
          <div className="text-sm text-slate-500">Available statements</div>
          <h2 className="text-2xl font-bold text-slate-950 mt-1">Paystub cards</h2>

          <div className="space-y-3 mt-5">
            {paystubs.map((stub) => (
              <button
                key={stub.id}
                onClick={() => setSelectedStub(stub)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  selectedStub.id === stub.id
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{formatDate(stub.payDate)}</div>
                    <div
                      className={`text-sm mt-1 ${
                        selectedStub.id === stub.id ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {formatDate(stub.periodStart)} to {formatDate(stub.periodEnd)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(stub.netPay)}</div>
                    <div
                      className={`text-sm mt-1 ${
                        selectedStub.id === stub.id ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Net pay
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-w-0 bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-950 text-white p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="text-sm text-slate-300">{COMPANY.name}</div>
            <div className="text-2xl font-bold mt-1">Earnings Statement</div>
            <div className="text-sm text-slate-300 mt-2">
              Pay date {formatDate(selectedStub.payDate)}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => downloadPaystub(selectedStub)}
              className="bg-white text-slate-950 px-4 py-3 rounded-2xl font-medium flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>

            <button
              onClick={() => printPaystubFromFile(selectedStub)}
              className="bg-slate-800 text-white px-4 py-3 rounded-2xl font-medium flex items-center gap-2 border border-slate-700"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6">
            <div className="min-w-0 rounded-2xl border border-slate-200 p-5">
              <div className="text-sm text-slate-500">Gross pay</div>
              <div className="text-2xl xl:text-3xl font-bold text-slate-950 mt-2 leading-tight break-words">
                {formatCurrency(selectedStub.grossPay)}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-200 p-5">
              <div className="text-sm text-slate-500">Bonus</div>
              <div className="text-2xl xl:text-3xl font-bold text-slate-950 mt-2 leading-tight break-words">
                {formatCurrency(selectedStub.bonus || 0)}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-200 p-5">
              <div className="text-sm text-slate-500">Taxes and deductions</div>
              <div className="text-2xl xl:text-3xl font-bold text-slate-950 mt-2 leading-tight break-words">
                {formatCurrency(totalDeductions)}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
              <div className="text-sm text-emerald-700">Net pay</div>
              <div className="text-2xl xl:text-3xl font-bold text-emerald-900 mt-2 leading-tight break-words">
                {formatCurrency(selectedStub.netPay)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <div className="text-sm text-slate-500 mb-3">Employee information</div>
              <div className="space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold text-slate-950">Name:</span> {employee.name}</div>
                <div><span className="font-semibold text-slate-950">Employee ID:</span> {employee.employeeId}</div>
                <div><span className="font-semibold text-slate-950">Department:</span> {employee.department}</div>
                <div><span className="font-semibold text-slate-950">Position:</span> {employee.position}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <div className="text-sm text-slate-500 mb-3">Statement details</div>
              <div className="space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold text-slate-950">Pay date:</span> {formatDate(selectedStub.payDate)}</div>
                <div><span className="font-semibold text-slate-950">Pay period:</span> {formatDate(selectedStub.periodStart)} to {formatDate(selectedStub.periodEnd)}</div>
                <div><span className="font-semibold text-slate-950">Payment method:</span> {payInfo.payMethod}</div>
                <div><span className="font-semibold text-slate-950">Delivery:</span> {payInfo.accountMask}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectDepositPage({ employee, depositInfo, onSaveDeposit }) {
  const [formData, setFormData] = useState(depositInfo);
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(
      depositInfo || {
        status: "Not enrolled",
        bankName: "",
        accountType: "Checking",
        routingMask: "",
        accountMask: "",
        effectiveDate: "",
      }
    );
  }, [depositInfo]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavedMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");

    const result = await onSaveDeposit(formData);

    setSaving(false);

    if (result?.success) {
      setSavedMessage(
        "Direct deposit updated successfully. Changes made after payroll has closed will take effect on the next pay cycle."
      );
    } else {
      setSavedMessage("Unable to update direct deposit.");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.3fr] gap-6">
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        <div className="text-sm text-slate-500">Payment elections</div>
        <h2 className="text-2xl font-bold text-slate-950 mt-1">Direct deposit</h2>
        <div className="text-sm text-slate-500 mt-1">
          Review and update your payroll deposit setup.
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Deposit status</div>
            <div className="font-semibold text-slate-950 mt-1">{formData?.status || "Not enrolled"}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Employee</div>
            <div className="font-semibold text-slate-950 mt-1">{employee.name}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Effective date</div>
            <div className="font-semibold text-slate-950 mt-1">
              {formData?.effectiveDate ? formatDate(formData.effectiveDate) : "Not set"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        <div className="text-sm text-slate-500">Deposit details</div>
        <h2 className="text-2xl font-bold text-slate-950 mt-1">Banking information</h2>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Direct deposit changes submitted after payroll has closed will take effect on the next pay cycle.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={formData?.status || "Not enrolled"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Not enrolled">Not enrolled</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Bank name</label>
            <input
              value={formData?.bankName || ""}
              onChange={(e) => handleChange("bankName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              placeholder="Bank name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Account type</label>
            <select
              value={formData?.accountType || "Checking"}
              onChange={(e) => handleChange("accountType", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
            >
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Paper check">Paper check</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Effective date</label>
            <input
              type="date"
              value={formData?.effectiveDate || ""}
              onChange={(e) => handleChange("effectiveDate", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Routing mask</label>
            <input
              value={formData?.routingMask || ""}
              onChange={(e) => handleChange("routingMask", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              placeholder="Routing ending in 1234"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Account mask</label>
            <input
              value={formData?.accountMask || ""}
              onChange={(e) => handleChange("accountMask", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              placeholder="Account ending in 5678"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-slate-950 text-white px-6 py-3 font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save direct deposit"}
          </button>

          {savedMessage && (
            <div
              className={`text-sm ${
                savedMessage.includes("successfully") ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {savedMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaxDocumentsPage({ employee }) {
  const docs = W2_DATA[employee.username.toLowerCase()] || [];

  return (
    <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8">
      <div className="text-sm text-slate-500">Year end tax documents</div>
      <h2 className="text-3xl font-bold text-slate-950 mt-1">W2 forms</h2>
      <div className="text-sm text-slate-500 mt-2">
        Download your available year end tax forms here.
      </div>

      {docs.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <BadgeDollarSign className="h-10 w-10 mx-auto text-slate-400" />
          <div className="text-xl font-semibold text-slate-950 mt-4">No W2 forms available yet</div>
          <div className="text-sm text-slate-500 mt-2">
            Tax documents will appear here after year end processing is complete.
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-semibold text-slate-950">{doc.label}</div>
                <div className="text-sm text-slate-500 mt-1">{doc.year}</div>
              </div>
              <button className="rounded-2xl bg-slate-950 text-white px-4 py-3 font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrackingPage({ employee }) {
  const packages = TRACKING_DATA[employee.username.toLowerCase()] || [];
  const [selectedPackage, setSelectedPackage] = useState(packages[0] || null);

  useEffect(() => {
    setSelectedPackage(packages[0] || null);
  }, [employee.username]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.35fr] gap-6">
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        <div className="text-sm text-slate-500">Shipment history</div>
        <h2 className="text-2xl font-bold text-slate-950 mt-1">Tracking</h2>
        <div className="text-sm text-slate-500 mt-1">
          Select a package to view shipment details.
        </div>

        <div className="space-y-3 mt-5">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`w-full text-left rounded-2xl border p-4 transition ${
                selectedPackage?.id === pkg.id
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{pkg.id}</div>
                  <div
                    className={`text-sm mt-1 ${
                      selectedPackage?.id === pkg.id ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {pkg.recipient}
                  </div>
                </div>
                <div
                  className={`text-sm rounded-full px-3 py-1 ${
                    selectedPackage?.id === pkg.id
                      ? "bg-white text-slate-950"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {pkg.status}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        {selectedPackage ? (
          <>
            <div className="text-sm text-slate-500">Shipment details</div>
            <h2 className="text-2xl font-bold text-slate-950 mt-1">{selectedPackage.id}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-sm text-slate-500 mb-3">Package information</div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-4">
                    <span>Recipient</span>
                    <span className="font-semibold text-slate-950">{selectedPackage.recipient}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Ship date</span>
                    <span className="font-semibold text-slate-950">{formatDate(selectedPackage.date)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Status</span>
                    <span className="font-semibold text-slate-950">{selectedPackage.status}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Destination</span>
                    <span className="font-semibold text-slate-950">{selectedPackage.destination}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-sm text-slate-500 mb-3">Tracking summary</div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-4">
                    <span>Carrier</span>
                    <span className="font-semibold text-slate-950">Logistive Ground</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Service level</span>
                    <span className="font-semibold text-slate-950">Standard Parcel</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Tracking number</span>
                    <span className="font-semibold text-slate-950">{selectedPackage.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>No tracking data found.</div>
        )}
      </div>
    </div>
  );
}

function ProfilePage({ employee, profile, onSaveProfile, onBack }) {
  const [formData, setFormData] = useState(profile);
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(
      profile || {
        email: employee.email || "",
        phone: "",
        address: "",
      }
    );
  }, [profile, employee]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavedMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");

    const result = await onSaveProfile(formData);

    setSaving(false);

    if (result?.success) {
      setSavedMessage("Profile updated successfully.");
    } else {
      setSavedMessage("Unable to update profile.");
    }
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
        <div>
          <div className="text-sm text-slate-500">Employee profile</div>
          <h2 className="text-3xl font-bold text-slate-950 mt-1">Profile settings</h2>
          <div className="text-sm text-slate-500 mt-2">
            Update your phone number, address, and email information.
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4">
            <div className="text-xs text-slate-500">Employee ID</div>
            <div className="font-semibold text-slate-950">{employee.employeeId}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[0.9fr_1.4fr] gap-8 mt-8">
        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <div className="text-sm text-slate-500 mb-3">Basic information</div>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <span>Name</span>
                <span className="font-semibold text-slate-950">{employee.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Department</span>
                <span className="font-semibold text-slate-950">{employee.department}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Position</span>
                <span className="font-semibold text-slate-950">{employee.position}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Work location</span>
                <span className="font-semibold text-slate-950">{employee.location}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <div className="text-sm text-slate-500 mb-3">Security notice</div>
            <div className="text-sm text-slate-700">
              Passwords are case sensitive. For security, this portal logs users out after 7 minutes of inactivity.
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input
                value={employee.name}
                disabled
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Employee ID</label>
              <input
                value={employee.employeeId}
                disabled
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-2 relative">
                <Mail className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={formData?.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-3 outline-none focus:border-slate-950"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Phone number</label>
              <div className="mt-2 relative">
                <Phone className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={formData?.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-3 outline-none focus:border-slate-950"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">Home address</label>
            <div className="mt-2 relative">
              <MapPin className="h-5 w-5 text-slate-400 absolute left-4 top-4" />
              <textarea
                value={formData?.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-3 outline-none focus:border-slate-950 resize-none"
                placeholder="Home address"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-slate-950 text-white px-6 py-3 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>

            {savedMessage && (
              <div
                className={`text-sm ${
                  savedMessage.includes("successfully") ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {savedMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpPage() {
  const [selectedHelp, setSelectedHelp] = useState("manager");

  const helpItems = [
    {
      key: "manager",
      title: "Manager Contact",
      description: "Direct supervisor contact for payroll and employee support.",
    },
    {
      key: "payroll",
      title: "Payroll Support",
      description: "Questions about deductions, direct deposit, tax forms, or paycheck timing.",
    },
    {
      key: "portal",
      title: "Portal Access",
      description: "Login issues, password help, and employee portal assistance.",
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.3fr] gap-6">
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        <div className="text-sm text-slate-500">Support center</div>
        <h2 className="text-2xl font-bold text-slate-950 mt-1">Help</h2>
        <div className="text-sm text-slate-500 mt-1">
          Select a support option to view details.
        </div>

        <div className="space-y-3 mt-5">
          {helpItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedHelp(item.key)}
              className={`w-full text-left rounded-2xl border p-4 transition ${
                selectedHelp === item.key
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="font-semibold">{item.title}</div>
              <div
                className={`text-sm mt-1 ${
                  selectedHelp === item.key ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {item.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        {selectedHelp === "manager" && (
          <>
            <div className="text-sm text-slate-500">Manager support</div>
            <h2 className="text-2xl font-bold text-slate-950 mt-1">Mark Moore</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-700 mt-1" />
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <div className="font-semibold text-slate-950">mark.moore@logistivellc.com</div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-700 mt-1" />
                <div>
                  <div className="text-sm text-slate-500">Phone</div>
                  <div className="font-semibold text-slate-950">(404) 555-0186</div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedHelp === "payroll" && (
          <>
            <div className="text-sm text-slate-500">Payroll assistance</div>
            <h2 className="text-2xl font-bold text-slate-950 mt-1">Payroll Support</h2>
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700">
              Contact your manager first for statement questions, deposit timing, and payroll record review.
            </div>
          </>
        )}

        {selectedHelp === "portal" && (
          <>
            <div className="text-sm text-slate-500">Portal assistance</div>
            <h2 className="text-2xl font-bold text-slate-950 mt-1">Portal Access</h2>
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700">
              For login or access issues, contact Mark Moore and request an employee portal reset.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        setError("Enter your email and password.");
        return;
      }

      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (signInError || !authData?.user) {
        console.error("Sign in error:", signInError);
        setError(signInError?.message || "Login failed.");
        return;
      }

      const { data: directoryRow, error: directoryError } = await supabase
        .from("employee_directory")
        .select("*")
        .eq("auth_email", normalizedEmail)
        .single();

      if (directoryError || !directoryRow) {
        console.error("Employee record load error:", directoryError);
        setError("Employee record not found.");
        await supabase.auth.signOut();
        return;
      }

      onLogin(mapDirectoryEmployee(directoryRow));
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError(loginError?.message || "Something went wrong while signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] w-full max-w-6xl bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-2xl">
          <div className="bg-slate-950 text-white p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_35%)]" />
            <div className="relative z-10">
              <img
                src={COMPANY.logo}
                alt="Company logo"
                className="h-24 lg:h-28 w-auto rounded-md"
              />

              <div className="mt-10 text-sm uppercase tracking-[0.25em] text-slate-300">
                Secure employee access
              </div>

              <h1 className="text-4xl font-bold mt-4 leading-tight">
                Access your Logistive employee portal.
              </h1>

              <p className="mt-4 text-slate-300 max-w-lg">
                Securely sign in to view your payroll, paystubs, shipment activity, profile details, direct deposit, and tax documents.
              </p>
            </div>
          </div>

          <div className="p-8 lg:p-14 flex items-center">
            <form onSubmit={submitLogin} className="w-full max-w-md mx-auto">
              <div className="text-sm text-slate-500">
                {COMPANY.employeePortalTitle} • {COMPANY.buildTag}
              </div>
              <h2 className="text-3xl font-bold text-slate-950 mt-1">Sign in</h2>
              <p className="text-sm text-slate-600 mt-2">
                Use your employee email and password to access your secure account.
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="mt-2 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-slate-950"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-slate-950 text-white px-4 py-3 font-medium disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in securely"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProtectedApp({ employee, logout }) {
  const [page, setPage] = useState("dashboard");
  const [employeeProfiles, setEmployeeProfiles] = useState({});
  const [profilesLoaded, setProfilesLoaded] = useState(false);
  const [depositRecords, setDepositRecords] = useState({});
  const [depositLoaded, setDepositLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfiles = async () => {
      const employeeKey = employee.username.toLowerCase();

      const { data, error } = await supabase
        .from("employee_profiles")
        .select("employee_username, email, phone, address")
        .eq("employee_username", employeeKey)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Profile load error:", error);
      }

      const fallbackProfile = {
        email: employee.email || "",
        phone: employee.phone || "",
        address: employee.address || "",
      };

      const mapped = {
        [employeeKey]: data
          ? {
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
            }
          : fallbackProfile,
      };

      setEmployeeProfiles(mapped);
      setProfilesLoaded(true);
    };

    loadProfiles();

    return () => {
      cancelled = true;
    };
  }, [employee]);

  useEffect(() => {
    let cancelled = false;

    const loadDeposits = async () => {
      const employeeKey = employee.username.toLowerCase();

      const { data, error } = await supabase
        .from("employee_direct_deposit")
        .select(
          "employee_username, status, bank_name, account_type, routing_mask, account_mask, effective_date"
        )
        .eq("employee_username", employeeKey)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Direct deposit load error:", error);
      }

      const fallbackDeposit = DIRECT_DEPOSIT_DATA[employeeKey] || {
        status: "Not enrolled",
        bankName: "",
        accountType: "Checking",
        routingMask: "",
        accountMask: "",
        effectiveDate: "",
      };

      const mapped = {
        [employeeKey]: data
          ? {
              status: data.status || "Not enrolled",
              bankName: data.bank_name || "",
              accountType: data.account_type || "Checking",
              routingMask: data.routing_mask || "",
              accountMask: data.account_mask || "",
              effectiveDate: data.effective_date || "",
            }
          : fallbackDeposit,
      };

      setDepositRecords(mapped);
      setDepositLoaded(true);
    };

    loadDeposits();

    return () => {
      cancelled = true;
    };
  }, [employee]);

  const activeProfile = employeeProfiles[employee.username.toLowerCase()] || {
    email: employee.email || "",
    phone: employee.phone || "",
    address: employee.address || "",
  };

  const handleSaveProfile = async (updatedProfile) => {
    const payload = {
      employee_username: employee.username.toLowerCase(),
      full_name: employee.name,
      employee_id: employee.employeeId,
      email: updatedProfile.email,
      phone: updatedProfile.phone,
      address: updatedProfile.address,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("employee_profiles")
      .upsert(payload, { onConflict: "employee_username" });

    if (error) {
      console.error("Profile update error:", error);
      return { success: false };
    }

    setEmployeeProfiles((prev) => ({
      ...prev,
      [employee.username.toLowerCase()]: {
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
      },
    }));

    return { success: true };
  };

  const activeDeposit = depositRecords[employee.username.toLowerCase()] || {
    status: "Not enrolled",
    bankName: "",
    accountType: "Checking",
    routingMask: "",
    accountMask: "",
    effectiveDate: "",
  };

  const handleSaveDeposit = async (updatedDeposit) => {
    const payload = {
      employee_username: employee.username.toLowerCase(),
      status: updatedDeposit.status,
      bank_name: updatedDeposit.bankName,
      account_type: updatedDeposit.accountType,
      routing_mask: updatedDeposit.routingMask,
      account_mask: updatedDeposit.accountMask,
      effective_date: updatedDeposit.effectiveDate || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("employee_direct_deposit")
      .upsert(payload, { onConflict: "employee_username" });

    if (error) {
      console.error("Direct deposit update error:", error);
      return { success: false };
    }

    setDepositRecords((prev) => ({
      ...prev,
      [employee.username.toLowerCase()]: {
        status: updatedDeposit.status,
        bankName: updatedDeposit.bankName,
        accountType: updatedDeposit.accountType,
        routingMask: updatedDeposit.routingMask,
        accountMask: updatedDeposit.accountMask,
        effectiveDate: updatedDeposit.effectiveDate,
      },
    }));

    return { success: true };
  };

  const pageContent = useMemo(() => {
    if (!profilesLoaded && page === "profile") {
      return (
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8">
          Loading profile...
        </div>
      );
    }

    if (page === "pay") return <PayPage employee={employee} />;

    if (!depositLoaded && page === "deposit") {
      return (
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8">
          Loading direct deposit...
        </div>
      );
    }

    if (page === "deposit") {
      return (
        <DirectDepositPage
          employee={employee}
          depositInfo={activeDeposit}
          onSaveDeposit={handleSaveDeposit}
        />
      );
    }

    if (page === "taxes") return <TaxDocumentsPage employee={employee} />;
    if (page === "tracking") return <TrackingPage employee={employee} />;
    if (page === "profile") {
      return (
        <ProfilePage
          employee={employee}
          profile={activeProfile}
          onSaveProfile={handleSaveProfile}
          onBack={() => setPage("dashboard")}
        />
      );
    }
    if (page === "help") return <HelpPage />;
    return <DashboardPage employee={employee} />;
  }, [page, employee, activeProfile, activeDeposit, profilesLoaded, depositLoaded]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          <Sidebar page={page} setPage={setPage} logout={logout} />

          <div className="min-w-0">
            <Topbar employee={employee} />
            {pageContent}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  const [authenticatedEmployee, setAuthenticatedEmployee] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrateEmployee = async (email) => {
      const normalizedEmail = email?.toLowerCase?.() || "";

      if (!normalizedEmail) return null;

      const { data: directoryRow, error } = await supabase
        .from("employee_directory")
        .select("*")
        .eq("auth_email", normalizedEmail)
        .single();

      if (error || !directoryRow) {
        console.error("Session employee load error:", error);
        return null;
      }

      return mapDirectoryEmployee(directoryRow);
    };

    const restoreSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user?.email) {
        const employee = await hydrateEmployee(session.user.email);
        if (mounted) {
          setAuthenticatedEmployee(employee);
        }
      } else {
        setAuthenticatedEmployee(null);
      }

      if (mounted) {
        setAuthChecked(true);
      }
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user?.email) {
        const employee = await hydrateEmployee(session.user.email);
        if (mounted) {
          setAuthenticatedEmployee(employee);
        }
      } else {
        setAuthenticatedEmployee(null);
      }

      if (mounted) {
        setAuthChecked(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authenticatedEmployee) return;

    let inactivityTimer;

    const logoutUser = async () => {
      alert("You were logged out due to 7 minutes of inactivity.");
      await supabase.auth.signOut();
      setAuthenticatedEmployee(null);
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutUser, 7 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [authenticatedEmployee]);

  const handleLogin = (employee) => {
    setAuthenticatedEmployee(employee);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticatedEmployee(null);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-700">
        Loading secure portal...
      </div>
    );
  }

  if (!authenticatedEmployee) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <ProtectedApp employee={authenticatedEmployee} logout={handleLogout} />;
}