export interface ClientRecord {
  id: string;
  companyName: string;
  salesRep: string;
  created: string;
  status: "ACTIVE" | "INACTIVE" | "CLOSED";
  address?: string;
  cityStateZip?: string;
  country?: string;
  primaryUser?: string;
  email?: string;
  phone?: string;
  clientGroup?: string;
  taxExempt?: string;
  signupDate?: string;
  lastLogin?: string;
}

const BASE_CLIENTS: ClientRecord[] = [
  {
    id: "16510",
    companyName: "Caliber Management LLC",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    address: "123 Business Park Dr",
    cityStateZip: "Dallas, Texas 75201 USA",
    country: "USA",
    primaryUser: "Suresh Ramakoti",
    email: "suresh@calibermgmt.com",
    phone: "(984) 895-5782",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 9:12 AM (Suresh Ramakoti, IP: 14.195.61.176, Host: ams4-2.uber.com)",
  },
  {
    id: "16509",
    companyName: "Akash SoftSystems Inc",
    salesRep: "Raghavendra Polimera",
    created: "2026-06-16",
    status: "ACTIVE",
    address: "456 Tech Blvd",
    cityStateZip: "Austin, Texas 78701 USA",
    country: "USA",
    primaryUser: "Raghavendra P.",
    email: "raghav@akashsoft.com",
    phone: "(814) 735-5568",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 8:45 AM (Raghavendra P., IP: 14.195.61.176, Host: ams4-2.uber.com)",
  },
  {
    id: "16508",
    companyName: "Acaisoft Solutions",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@acaisoft.com",
    phone: "(555) 123-4567",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 7:30 AM",
  },
  {
    id: "16506",
    companyName: "Biafosys Inc",
    salesRep: "Raghavendra Polimera",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@biafosys.com",
    phone: "(555) 234-5678",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 6:15 AM",
  },
  {
    id: "16505",
    companyName: "Jeevan Technologies",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@jeevantech.com",
    phone: "(555) 345-6789",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 5:00 AM",
  },
  {
    id: "16504",
    companyName: "ValueVista Soft Solutions Inc",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@valuevista.com",
    phone: "(555) 456-7890",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 4:30 AM",
  },
  {
    id: "16503",
    companyName: "Red Maple Tech Inc",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@redmapletech.com",
    phone: "(555) 567-8901",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 3:45 AM",
  },
  {
    id: "16502",
    companyName: "Capital Tech Solutions, Inc.",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@capitaltech.com",
    phone: "(555) 678-9012",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 2:20 AM",
  },
  {
    id: "16501",
    companyName: "Orbit Tech Solutions LLC",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "ACTIVE",
    primaryUser: "Admin User",
    email: "admin@orbitech.com",
    phone: "(555) 789-0123",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/16/2026 1:10 AM",
  },
  {
    id: "16500",
    companyName: "Merlin Solutions LLC",
    salesRep: "Suresh Ramakoti",
    created: "2026-04-27",
    status: "ACTIVE",
    primaryUser: "Juuhi A.",
    email: "juuhi@merlin.com",
    phone: "(832) 229-6131",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "04/27/2026",
    lastLogin: "4/27/2026 10:00 AM",
  },
  {
    id: "16491",
    companyName: "Brinnae LLC",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-16",
    status: "CLOSED",
    primaryUser: "Admin User",
    email: "admin@brinnae.com",
    phone: "(555) 890-1234",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/16/2026",
    lastLogin: "6/10/2026 2:00 PM",
  },
  {
    id: "16480",
    companyName: "Us Royal Management LLC",
    salesRep: "Suresh Ramakoti",
    created: "2026-06-13",
    status: "CLOSED",
    primaryUser: "Admin User",
    email: "admin@usroyal.com",
    phone: "(555) 901-2345",
    clientGroup: "Evalright Group",
    taxExempt: "No",
    signupDate: "06/13/2026",
    lastLogin: "6/12/2026 11:00 AM",
  },
];

const COMPANY_SUFFIXES = ["LLC", "Inc", "Corp", "Solutions", "Technologies", "Systems", "Group", "Partners"];
const SALES_REPS = ["Suresh Ramakoti", "Raghavendra Polimera"];

function generateClientList(): ClientRecord[] {
  const generated: ClientRecord[] = [];
  const targetTotal = 681;
  const startId = 16479;

  for (let i = 0; generated.length < targetTotal - BASE_CLIENTS.length; i++) {
    const id = String(startId - i);
    const suffix = COMPANY_SUFFIXES[i % COMPANY_SUFFIXES.length];
    const rep = SALES_REPS[i % SALES_REPS.length];
    const month = String(Math.max(1, 6 - Math.floor(i / 60))).padStart(2, "0");
    const day = String(Math.max(1, 28 - (i % 28))).padStart(2, "0");

    generated.push({
      id,
      companyName: `Client Company ${id} ${suffix}`,
      salesRep: rep,
      created: `2026-${month}-${day}`,
      status: i % 17 === 0 ? "CLOSED" : "ACTIVE",
      primaryUser: "Admin User",
      email: `admin${id}@example.com`,
      phone: `(555) ${String(100 + (i % 900)).padStart(3, "0")}-${String(1000 + (i % 9000)).padStart(4, "0")}`,
      clientGroup: "Evalright Group",
      taxExempt: "No",
      signupDate: `${month}/${day}/2026`,
      lastLogin: `${month}/${day}/2026 9:00 AM`,
    });
  }

  return [...BASE_CLIENTS, ...generated];
}

export const CLIENT_LIST: ClientRecord[] = generateClientList();

export const DEMO_CLIENT: ClientRecord = {
  id: "2211",
  companyName: "Evalright Demo Account",
  salesRep: "Suresh Ramakoti",
  created: "2025-12-29",
  status: "ACTIVE",
  address: "127 Eden Carr Way",
  cityStateZip: "Cary, North Carolina 27513 USA",
  country: "USA",
  primaryUser: "Test AdminUser",
  email: "farooq@evalright.com",
  phone: "999-999-9999",
  clientGroup: "Evalright Group",
  taxExempt: "No",
  signupDate: "12/29/2025",
  lastLogin: "6/5/2026 3:07 AM (Test AdminUser, IP: 14.195.61.176, Host: ams4-2.uber.com)",
};

export const RECENT_CLIENTS = [
  { name: "Caliber Management LLC", date: "2026-06-16", contact: "Suresh Ramakoti", phone: "(984) 895-5782", sales: "$48.00" },
  { name: "Akash SoftSystems Inc", date: "2026-06-16", contact: "Raghavendra P.", phone: "(814) 735-5568", sales: "$279.50" },
  { name: "Acaisoft Solutions", date: "2026-06-16", contact: "Admin User", phone: "(555) 123-4567", sales: "$0.00" },
  { name: "Biafosys Inc", date: "2026-06-16", contact: "Admin User", phone: "(555) 234-5678", sales: "$0.00" },
  { name: "Jeevan Technologies", date: "2026-06-16", contact: "Admin User", phone: "(555) 345-6789", sales: "$0.00" },
  { name: "ValueVista Soft Solutions Inc", date: "2026-06-16", contact: "Admin User", phone: "(555) 456-7890", sales: "$0.00" },
];

export const NO_SALES_CLIENTS = [
  { name: "Acaisoft Solutions", date: "2026-06-16", contact: "Admin User", phone: "(555) 123-4567" },
  { name: "Biafosys Inc", date: "2026-06-16", contact: "Admin User", phone: "(555) 234-5678" },
  { name: "Jeevan Technologies", date: "2026-06-16", contact: "Admin User", phone: "(555) 345-6789" },
  { name: "Merlin Solutions LLC", date: "2026-04-27", contact: "Juuhi A.", phone: "(832) 229-6131" },
  { name: "Alephys LLC", date: "2026-04-15", contact: "Ravi M.", phone: "(713) 568-6585" },
  { name: "Episdata Inc", date: "2026-04-09", contact: "Sri C.", phone: "(412) 996-2307" },
];

export const SEARCH_PACKAGES = [
  "demo",
  "Demo 4",
  "Demo Account - 3",
  "Demo-1",
  "Package",
  "Package 1",
  "package 2",
  "Package 3",
  "SteelIQ",
];

export const LAST_EMAILS = [
  { date: "06/03/2026 01:42", subject: "Invoice Payment Confirmation" },
  { date: "06/03/2026 01:42", subject: "Invoice Payment Confirmation" },
  { date: "06/02/2026 08:35", subject: "Invoice Payment Reminder" },
  { date: "06/01/2026 10:20", subject: "Customer Invoice" },
  { date: "05/27/2026 12:18", subject: "Invoice Payment Reminder" },
];

export interface ClientTransaction {
  date: string;
  paymentMethod: string;
  description: string;
  amountIn: string;
  amountOut: string;
  fees: string;
}

export const CLIENT_TRANSACTIONS: ClientTransaction[] = [
  {
    date: "2026-06-03 00:00:00",
    paymentMethod: "-",
    description: "Invoice Payment (254772) - TX ID:",
    amountIn: "0.00",
    amountOut: "0.00",
    fees: "0.00",
  },
  {
    date: "2026-06-03 00:00:00",
    paymentMethod: "-",
    description: "Invoice Payment (240202) - TX ID:",
    amountIn: "0.00",
    amountOut: "0.00",
    fees: "0.00",
  },
];

export const AVAILABLE_SEARCHES = [
  "(AF) LabCorp - 10 Panel",
  "(AF) LabCorp - 10 Panel 6AM/ OXY",
  "(AF) LabCorp - 10 Panel ALCOHOL",
  "(AF) LabCorp - 10 Panel NO THC",
  "(AF) LabCorp - 12 Panel MDMA/ OXY",
  "(AF) LabCorp - 10 Panel OXY",
  "(AF) LabCorp - 5 Panel",
  "(AF) LabCorp - 5 Panel OXY",
  "(AF) LabCorp - 7 Panel",
  "(AF) LabCorp - 9 Panel",
  "(AF) LabCorp - 10 Panel Hair",
  "(AF) LabCorp - 12 Panel",
  "(AF) LabCorp - 12 Panel OXY",
  "(AF) LabCorp - 12 Panel ALCOHOL",
  "(AF) Quest - 10 Panel",
  "(AF) Quest - 5 Panel",
  "SSN Trace/Address History",
  "County Criminal",
  "Education Verification",
  "Employment Verification",
  "Driving History",
  "Drug Screen 5 Panel (Quest)",
  "Drug Screening 10 Panel Plus ALCH Blood Draw",
];

export const BILLING_INFO = {
  billingContact: "Suresh Ramakoti",
  phoneNumber: "3312692234",
  billingAddress1: "3831 McCoy Dr Unit 101 B, Aurora, IL 60504",
  billingAddress2: "",
  city: "Aurora",
  state: "IL",
  zip: "60504",
  salesTaxRate: "0",
  payType: "Open Account",
  accountLimit: "0",
  clientPaysFees: true,
  freeAliasSearches: false,
  autoApproveInvoices: true,
  guaranteeWithCreditCard: false,
  paymentTerms: "On Receipt",
  invoicePayMethod: "Check",
  invoiceType: "Detail",
  invoiceDeliveryMethod: "E-MAIL",
  emailAddress: "kpraveen@evalright.us",
  delinquentInvoiceLoginBlock: false,
  disableUrlsInInvoiceEmails: false,
  hideDueInvoicesOnHomePage: false,
  putAllBranchesOnSameInvoice: false,
  showRushOrderOption: true,
  autoLateInvoiceLoginDisable: true,
  sendFailedPaymentNotifications: true,
};

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

export const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

export const PROFILE_INFO = {
  companyName: "Evalright Demo Account",
  phoneNumber: "3312692234",
  address1: "3831 McCoy Dr Unit 101 B, Aurora, IL 60504",
  address2: "",
  city: "Aurora",
  zipCode: "60504",
  state: "Illinois",
  country: "United States of America",
  enablePackageBuilder: true,
  dontApplyLateFees: false,
  dontSendOverdueEmails: false,
  creditBalance: "0.00",
  accountStatus: "Active",
  primaryUser: "Suresh Ramakoti",
  ccReportsTo: "",
  drugScreenNotificationsTo: "",
  ssnMatchType: "partial" as "exact" | "partial" | "non",
  autoPopulateTimeFrame: "7 Years",
  crimeHistoryLimit: "7 Years",
  hideSsnAddresses: true,
  clientGroup: "New Sign-Ups EvalRight",
  salesPerson: "None",
  creditReportSubcode: "",
  creditReportPassword: "",
  orderSummaryReportEmail: "None",
  electronicSignatureDate: "2025-09-19 09:06:32",
  electronicSignatureBy: "Suresh Ramakoti",
  electronicTrace: "49.206.42.13.actcorp.in",
  requireMiddleName: true,
  requireApplicantEmail: false,
  unlimitedInvitationSearches: false,
  requiredOrderReference: false,
  automatedSearchesEnabled: false,
  applicantOrderInviteLimit: "0",
  adminNotes: "",
};

export interface ClientBranch {
  id: string;
  branchName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phoneNumber: string;
  searchRestrictions: string;
  packages: string;
}

export const CLIENT_BRANCHES: ClientBranch[] = [
  {
    id: "1",
    branchName: "Headquarters/All",
    address1: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    phoneNumber: "",
    searchRestrictions: "",
    packages: "",
  },
];

export interface ClientUser {
  id: string;
  username: string;
  name: string;
  email: string;
  enabled: boolean;
}

export const CLIENT_USERS: ClientUser[] = [
  {
    id: "25494",
    username: "EvalRight",
    name: "Suresh Ramakoti",
    email: "kpraveen@evalright.us",
    enabled: true,
  },
];

export interface ClientInvoice {
  id: string;
  branch: string;
  invoiceDate: string;
  dueDate: string;
  total: string;
  status: "PAID" | "DUE" | "CANCELLED";
  companyName: string;
  approvedBy: string;
  approvedOn: string;
  paidOn: string;
}

export const CLIENT_INVOICES: ClientInvoice[] = [
  {
    id: "254772",
    branch: "",
    invoiceDate: "2026-06-01",
    dueDate: "2026-06-01",
    total: "$0.00",
    status: "PAID",
    companyName: "Evalright Demo Account",
    approvedBy: "Automatic",
    approvedOn: "06-01-2026 01:19:25",
    paidOn: "06/03/2026 01:42",
  },
  {
    id: "240202",
    branch: "",
    invoiceDate: "2026-06-01",
    dueDate: "2026-06-01",
    total: "$0.00",
    status: "PAID",
    companyName: "Evalright Demo Account",
    approvedBy: "Automatic",
    approvedOn: "06-01-2026 01:19:25",
    paidOn: "06/03/2026 01:42",
  },
];

export const INVOICE_PAYMENTS = [
  {
    paymentDate: "2026-06-03 00:00:00",
    description: "Invoice Payment",
    payment: "0.00",
    enteredBy: "",
  },
];

export interface ClientEmailRecord {
  date: string;
  userEmail: string;
  subject: string;
}

export const CLIENT_EMAILS: ClientEmailRecord[] = [
  { date: "2026-06-03 01:42:13", userEmail: "kpraveen@evalright.us", subject: "Invoice Payment Confirmation" },
  { date: "2026-06-03 01:42:13", userEmail: "kpraveen@evalright.us", subject: "Invoice Payment Confirmation" },
  { date: "2026-06-02 08:35:22", userEmail: "kpraveen@evalright.us", subject: "Invoice Payment Reminder" },
  { date: "2026-06-01 10:20:45", userEmail: "kpraveen@evalright.us", subject: "Customer Invoice" },
  { date: "2026-05-27 12:18:30", userEmail: "kpraveen@evalright.us", subject: "Invoice Payment Reminder" },
  { date: "2026-04-20 07:30:15", userEmail: "kpraveen@evalright.us", subject: "Order #1791886 has been Completed" },
  { date: "2026-04-20 07:29:00", userEmail: "kpraveen@evalright.us", subject: "Customer Invoice" },
  { date: "2025-12-24 09:32:10", userEmail: "kpraveen@evalright.us", subject: "Invoice Payment Reminder" },
];

export interface ClientOrder {
  orderId: string;
  applicantName: string;
  orderDate: string;
  amount: string;
  status: "CANCELLED" | "CLOSED" | "PENDING";
  hasInvoice?: boolean;
}

export const CLIENT_ORDERS: ClientOrder[] = [
  { orderId: "1796058", applicantName: "Praveen Kumar", orderDate: "04/23/2026 09:19 AM", amount: "0.00", status: "CANCELLED" },
  { orderId: "1791886", applicantName: "Suprem hero", orderDate: "04/20/2026 07:29 AM", amount: "89.50", status: "CLOSED", hasInvoice: true },
  { orderId: "1694532", applicantName: "Direct Reference", orderDate: "12/24/2025 09:32 AM", amount: "129.50", status: "PENDING" },
  { orderId: "1694509", applicantName: "Dewayne Johnson", orderDate: "12/24/2025 08:45 AM", amount: "129.50", status: "CLOSED", hasInvoice: true },
  { orderId: "1693155", applicantName: "Srikanth Raj", orderDate: "12/22/2025 11:09 AM", amount: "129.50", status: "CLOSED", hasInvoice: true },
];

export const SALES_CHART_DATA = [
  { month: "Jul", sales: 0 },
  { month: "Aug", sales: 0 },
  { month: "Sep", sales: 0 },
  { month: "Oct", sales: 0 },
  { month: "Nov", sales: 0 },
  { month: "Dec", sales: 390 },
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
  { month: "Apr", sales: 90 },
  { month: "May", sales: 0 },
  { month: "Jun", sales: 0 },
];

export interface OrderLossRecord {
  clientId: string;
  companyName: string;
  orderId: string;
  orderDate: string;
  totalCharged: number;
  totalExpenses: number;
  loss: number;
}

export const ORDER_LOSS_REPORT_DATA: OrderLossRecord[] = [
  {
    clientId: "2211",
    companyName: "Evalright Demo Account",
    orderId: "1796058",
    orderDate: "2026/04/23",
    totalCharged: 0,
    totalExpenses: 35.33,
    loss: 35.33,
  },
];

export interface SalesPersonOption {
  id: string;
  label: string;
  displayName: string;
}

export const SALES_PERSONS: SalesPersonOption[] = [
  { id: "puneet", label: "P, Puneet", displayName: "Puneet P" },
  { id: "suresh", label: "R, Suresh Ramakoti", displayName: "Suresh Ramakoti" },
  { id: "raghav", label: "P, Raghavendra Polimera", displayName: "Raghavendra Polimera" },
];

export interface SalesReportRow {
  client: string;
  orderCount: number;
  totalSales: number;
  fees: number;
  grossProfit: number;
  grossProfitPct: number;
  netProfit: number;
  netProfitPct: number;
  salesCommission: number;
  managerCommission: number;
}

export const SALES_REPORT_BY_PERSON_DATA: SalesReportRow[] = [
  { client: "DPR Solutions Inc", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Encloud Services LLC", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Infodat International Inc", orderCount: 3, totalSales: 67.5, fees: 2.7, grossProfit: 64.8, grossProfitPct: 96, netProfit: 64.8, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Eclatpro Solutions", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Effinxt Inc", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Elajika LLC", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Elite Tech Info", orderCount: 3, totalSales: 67.5, fees: 2.7, grossProfit: 64.8, grossProfitPct: 96, netProfit: 64.8, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Enin Systems", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Epis Data Inc", orderCount: 5, totalSales: 112.5, fees: 4.5, grossProfit: 108.0, grossProfitPct: 96, netProfit: 108.0, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Etekit Solutions", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Evoke Systems", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Famous Techys", orderCount: 3, totalSales: 67.5, fees: 2.7, grossProfit: 64.8, grossProfitPct: 96, netProfit: 64.8, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Flexday AI", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Fortune Minds", orderCount: 9, totalSales: 351.97, fees: 82.9, grossProfit: 269.07, grossProfitPct: 76.45, netProfit: 269.07, netProfitPct: 76.45, salesCommission: 0, managerCommission: 0 },
  { client: "Fusion Life Solutions", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Global Staffing Partners", orderCount: 3, totalSales: 67.5, fees: 2.7, grossProfit: 64.8, grossProfitPct: 96, netProfit: 64.8, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "HR Flexday", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "IntelliSoft Inc", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Jeevan Technologies", orderCount: 4, totalSales: 90.0, fees: 3.6, grossProfit: 86.4, grossProfitPct: 96, netProfit: 86.4, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "KodeKloud Systems", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Luminous IT LLC", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Maverick Solutions", orderCount: 3, totalSales: 67.5, fees: 2.7, grossProfit: 64.8, grossProfitPct: 96, netProfit: 64.8, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "NexGen Staffing", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "OmniTech Corp", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Pentangle Tech Services", orderCount: 5, totalSales: 112.5, fees: 4.5, grossProfit: 108.0, grossProfitPct: 96, netProfit: 108.0, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Quantum HR Solutions", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Rapid Staffing Inc", orderCount: 3, totalSales: 67.5, fees: 2.7, grossProfit: 64.8, grossProfitPct: 96, netProfit: 64.8, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "Synergy Systems", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "TechBridge LLC", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "United Soft Inc", orderCount: 4, totalSales: 90.0, fees: 3.6, grossProfit: 86.4, grossProfitPct: 96, netProfit: 86.4, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "ValueVista Soft Solutions Inc", orderCount: 2, totalSales: 45.0, fees: 1.8, grossProfit: 43.2, grossProfitPct: 96, netProfit: 43.2, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
  { client: "ZScale LLC", orderCount: 1, totalSales: 22.5, fees: 0.9, grossProfit: 21.6, grossProfitPct: 96, netProfit: 21.6, netProfitPct: 96, salesCommission: 0, managerCommission: 0 },
];

export const RESEARCHERS = [
  "All Researchers",
  "A",
  "A & C Research",
  "A & M Attorney Services Inc",
  "Alameda Researchers",
  "Alpha Background Checks",
  "American Research Services",
  "B & B Research LLC",
  "California Court Researchers",
  "County Records Inc",
  "Delta Research Group",
  "Eagle Eye Research",
  "First Choice Researchers",
  "Global Research Partners",
];

export const CONFIGURATION_GROUPS = ["All Groups", "Evalright Group", "Standard Group", "Premium Group"];

export const SALES_REPORT_CLIENTS = [
  { id: "all", name: "All Clients" },
  { id: "16420", name: "3A Soft Inc" },
  { id: "16510", name: "Caliber Management LLC" },
  { id: "16509", name: "Akash SoftSystems Inc" },
  { id: "2211", name: "Evalright Demo Account" },
];

export interface SalesBySearchTypeRow {
  searchType: string;
  totalSearches: number;
  totalExpenses: number;
  totalSalePrice: number;
  profitLoss: number;
}

export const SALES_BY_SEARCH_TYPE_DATA: SalesBySearchTypeRow[] = [
  { searchType: "County Criminal", totalSearches: 2, totalExpenses: 12.3, totalSalePrice: 16.0, profitLoss: 61.6 },
  { searchType: "Employment Verification", totalSearches: 3, totalExpenses: 6.0, totalSalePrice: 45.0, profitLoss: 61.6 },
  { searchType: "Education Verification", totalSearches: 1, totalExpenses: 9.1, totalSalePrice: 15.0, profitLoss: 61.6 },
  { searchType: "Nationwide Federal Civil", totalSearches: 1, totalExpenses: 2.0, totalSalePrice: 15.0, profitLoss: 61.6 },
];

export interface SalesCountAllRow {
  clientId: string;
  clientName: string;
  totalSearches: number;
  totalExpenses: number;
  totalSalePrice: number;
  profitLoss: number;
}

export const SALES_COUNT_ALL_DATA: SalesCountAllRow[] = [
  { clientId: "16420", clientName: "3A Soft Inc", totalSearches: 4, totalExpenses: 29.4, totalSalePrice: 91.0, profitLoss: 61.6 },
];

export const GEOGRAPHIC_STATES = [
  "Select a State",
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  ...US_STATES.filter((s) => !["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia"].includes(s)),
];

export const COUNTIES_BY_STATE: Record<string, string[]> = {
  Alabama: ["Jefferson", "Madison", "Mobile", "Montgomery", "Shelby"],
  Alaska: ["Aleutians West", "Anchorage", "Fairbanks North Star", "Juneau", "Kenai Peninsula"],
  Arizona: ["Maricopa", "Pima", "Pinal", "Yavapai"],
  Arkansas: ["Benton", "Pulaski", "Washington"],
  California: ["Alameda", "Los Angeles", "Orange", "Sacramento", "San Diego", "San Francisco", "Santa Clara"],
  Colorado: ["Denver", "El Paso", "Jefferson"],
  Texas: ["Dallas", "Harris", "Tarrant", "Travis"],
  "New York": ["Kings", "New York", "Queens", "Suffolk"],
};

export const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Texas: "TX",
  "New York": "NY",
};

export interface GeographicSearchStat {
  title: string;
  avgTurnaround: string;
  recordsFoundPct: string;
  totalSearches: number;
}

export interface GeographicCriminalStats {
  county: string;
  state: string;
  sections: GeographicSearchStat[];
}

export const GEOGRAPHIC_CRIMINAL_STATS: Record<string, GeographicCriminalStats> = {
  "Alaska|Aleutians West": {
    county: "Aleutians West",
    state: "Alaska",
    sections: [
      {
        title: "Aleutians West - County Criminal Search",
        avgTurnaround: "N/A Hours",
        recordsFoundPct: "N/A%",
        totalSearches: 0,
      },
      {
        title: "AK - Statewide Criminal Search",
        avgTurnaround: "0.5 Hours",
        recordsFoundPct: "11.4%",
        totalSearches: 3401,
      },
    ],
  },
};

export const PACKAGE_ORDER_TREND_CLIENTS = [
  { id: "", name: "PLEASE SELECT A CLIENT" },
  { id: "16420", name: "3A Soft Inc" },
  { id: "16510", name: "Caliber Management LLC" },
  { id: "2211", name: "Evalright Demo Account" },
];

export interface IncomeHistoryPoint {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export const INCOME_HISTORY_1_YEAR: IncomeHistoryPoint[] = [
  { period: "6 - 2025", revenue: 12500, expenses: 8200, profit: 4300 },
  { period: "7 - 2025", revenue: 14200, expenses: 8800, profit: 5400 },
  { period: "8 - 2025", revenue: 15800, expenses: 9100, profit: 6700 },
  { period: "9 - 2025", revenue: 17600, expenses: 9800, profit: 7800 },
  { period: "10 - 2025", revenue: 21400, expenses: 11200, profit: 10200 },
  { period: "11 - 2025", revenue: 28900, expenses: 14500, profit: 14400 },
  { period: "12 - 2025", revenue: 39500, expenses: 17800, profit: 21700 },
  { period: "1 - 2026", revenue: 26800, expenses: 13200, profit: 13600 },
  { period: "2 - 2026", revenue: 22100, expenses: 11800, profit: 10300 },
  { period: "3 - 2026", revenue: 37200, expenses: 16500, profit: 20700 },
  { period: "4 - 2026", revenue: 25400, expenses: 12800, profit: 12600 },
  { period: "5 - 2026", revenue: 19800, expenses: 10500, profit: 9300 },
  { period: "6 - 2026", revenue: 16200, expenses: 9200, profit: 7000 },
];

export const INCOME_HISTORY_5_YEARS: IncomeHistoryPoint[] = [
  { period: "2022", revenue: 185000, expenses: 112000, profit: 73000 },
  { period: "2023", revenue: 224000, expenses: 128000, profit: 96000 },
  { period: "2024", revenue: 268000, expenses: 145000, profit: 123000 },
  { period: "2025", revenue: 312000, expenses: 168000, profit: 144000 },
  { period: "2026", revenue: 148000, expenses: 82000, profit: 66000 },
];

export const INCOME_HISTORY_ALL_TIME: IncomeHistoryPoint[] = [
  { period: "2018", revenue: 98000, expenses: 62000, profit: 36000 },
  { period: "2019", revenue: 124000, expenses: 78000, profit: 46000 },
  { period: "2020", revenue: 142000, expenses: 86000, profit: 56000 },
  { period: "2021", revenue: 168000, expenses: 98000, profit: 70000 },
  ...INCOME_HISTORY_5_YEARS,
];

export interface PackageOrderTrendRow {
  packageName: string;
  orderCount: number;
}

export const PACKAGE_ORDER_TREND_DATA: Record<string, PackageOrderTrendRow[]> = {
  "16420": [
    { packageName: "County", orderCount: 2 },
    { packageName: "Consolidated Basic", orderCount: 3 },
    { packageName: "Basic+OIG & Federal", orderCount: 1 },
    { packageName: "Appraisal Package", orderCount: 1 },
  ],
};

export interface ALaCarteFrequencyRow {
  clientName: string;
  totalOrders: number;
  packageOrders: number;
  percentage: string;
}

export const A_LA_CARTE_FREQUENCY_DATA: ALaCarteFrequencyRow[] = [
  { clientName: "ASOFT CONSULTING LLC", totalOrders: 1228, packageOrders: 148, percentage: "88 %" },
  { clientName: "Vsecurelabs Inc", totalOrders: 575, packageOrders: 60, percentage: "90 %" },
  { clientName: "Evalright Demo Account", totalOrders: 48, packageOrders: 7, percentage: "85 %" },
  { clientName: "abc", totalOrders: 6, packageOrders: 3, percentage: "50 %" },
  { clientName: "ijk", totalOrders: 3, packageOrders: 96, percentage: "N/A" },
  { clientName: "SSSoft", totalOrders: 3, packageOrders: 2, percentage: "33 %" },
  { clientName: "BSoft1", totalOrders: 3, packageOrders: 6, percentage: "N/A" },
  { clientName: "My3Tech", totalOrders: 1165, packageOrders: 395, percentage: "66 %" },
  { clientName: "Concept Software & Services Inc", totalOrders: 22, packageOrders: 6, percentage: "73 %" },
  { clientName: "Augusta Hitech Soft Solutions, LLC", totalOrders: 27, packageOrders: 2, percentage: "93 %" },
  { clientName: "Krasan Consulting Services Inc", totalOrders: 3537, packageOrders: 32, percentage: "99 %" },
  { clientName: "Ikonsys", totalOrders: 46, packageOrders: 1, percentage: "98 %" },
  { clientName: "Libsys, Inc.", totalOrders: 19, packageOrders: 11, percentage: "42 %" },
  { clientName: "Binary Tech Consulting Corp", totalOrders: 278, packageOrders: 3, percentage: "99 %" },
  { clientName: "Capitalize Ventures LLC", totalOrders: 10, packageOrders: 7, percentage: "30 %" },
  { clientName: "Vsion Technologies, Inc.", totalOrders: 170, packageOrders: 34, percentage: "80 %" },
];

export interface MonthlyRevenueRow {
  clientName: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MonthlyRevenueGroup {
  month: string;
  rows: MonthlyRevenueRow[];
}

export const MONTHLY_REVENUE_2026: MonthlyRevenueGroup[] = [
  {
    month: "January",
    rows: [
      { clientName: "4i Americas LLC", revenue: 1412.74, expenses: 557.58, profit: 855.16 },
      { clientName: "ACI Infotech Inc", revenue: 97.5, expenses: 3.4, profit: 94.1 },
      { clientName: "ACS Consultancy Services, Inc", revenue: 190.69, expenses: 138.69, profit: 52.0 },
      { clientName: "Akash SoftSystems Inc", revenue: 245.0, expenses: 112.3, profit: 132.7 },
      { clientName: "Caliber Management LLC", revenue: 520.25, expenses: 198.4, profit: 321.85 },
    ],
  },
  {
    month: "February",
    rows: [
      { clientName: "4i Americas LLC", revenue: 1288.5, expenses: 512.2, profit: 776.3 },
      { clientName: "Biafosys Inc", revenue: 156.0, expenses: 48.5, profit: 107.5 },
      { clientName: "Evalright Demo Account", revenue: 390.0, expenses: 145.0, profit: 245.0 },
    ],
  },
];

export interface MyInvoiceRecord {
  id: string;
  branch: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  status: "PAID" | "UNPAID" | "OVERDUE";
}

export const MY_INVOICES_LIST: MyInvoiceRecord[] = [
  { id: "255167", branch: "", invoiceDate: "2026-06-01", dueDate: "2026-06-01", total: 15635.27, status: "PAID" },
  { id: "251414", branch: "", invoiceDate: "2026-05-01", dueDate: "2026-05-01", total: 14280.5, status: "PAID" },
  { id: "247892", branch: "", invoiceDate: "2026-04-01", dueDate: "2026-04-01", total: 13892.15, status: "PAID" },
  { id: "244201", branch: "", invoiceDate: "2026-03-01", dueDate: "2026-03-01", total: 15120.0, status: "PAID" },
  { id: "240556", branch: "", invoiceDate: "2026-02-01", dueDate: "2026-02-01", total: 12945.75, status: "PAID" },
  { id: "236890", branch: "", invoiceDate: "2026-01-01", dueDate: "2026-01-01", total: 14780.3, status: "PAID" },
  { id: "233104", branch: "", invoiceDate: "2025-12-01", dueDate: "2025-12-01", total: 16250.0, status: "PAID" },
  { id: "229478", branch: "", invoiceDate: "2025-11-01", dueDate: "2025-11-01", total: 13105.6, status: "PAID" },
  { id: "225901", branch: "", invoiceDate: "2025-10-01", dueDate: "2025-10-01", total: 14420.85, status: "PAID" },
  { id: "222334", branch: "", invoiceDate: "2025-09-01", dueDate: "2025-09-01", total: 12750.4, status: "PAID" },
];

export interface InvoiceTransaction {
  transactionDate: string;
  gateway: string;
  transactionId: string;
  amount: number;
}

export interface InvoiceDetail {
  id: string;
  status: "PAID" | "UNPAID" | "OVERDUE";
  invoiceDate: string;
  dueDate: string;
  datePaid: string;
  subTotal: number;
  credit: number;
  total: number;
  balance?: number;
  transactions: InvoiceTransaction[];
}

export const INVOICE_DETAILS: Record<string, InvoiceDetail> = {
  "255167": {
    id: "255167",
    status: "PAID",
    invoiceDate: "06/01/2026",
    dueDate: "06/01/2026",
    datePaid: "06/16/2026 14:33",
    subTotal: 15635.27,
    credit: 0,
    total: 15635.27,
    transactions: [
      {
        transactionDate: "06/16/2026",
        gateway: "-",
        transactionId: "",
        amount: 15635.27,
      },
    ],
    balance: 0,
  },
};

export interface ClientConfigGroup {
  id: string;
  groupName: string;
  groupColor: string;
  discountPct: number;
  suspendTerminateExempt: boolean;
}

export const CLIENT_CONFIG_GROUPS: ClientConfigGroup[] = [
  { id: "1", groupName: "", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
  { id: "2", groupName: "", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
  { id: "3", groupName: "", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
  { id: "4", groupName: "", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
  { id: "5", groupName: "", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
  { id: "6", groupName: "New Sign-Ups EvalRight", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
  { id: "7", groupName: "SteelIQ", groupColor: "", discountPct: 0, suspendTerminateExempt: false },
];

export interface SignupPageRecord {
  id: string;
  pageName: string;
  isDefault: boolean;
  previewUrl: string;
}

export const SIGNUP_PAGES_LIST: SignupPageRecord[] = [
  { id: "1", pageName: "SteelIQ", isDefault: false, previewUrl: "#" },
  { id: "2", pageName: "EvalRight Default Sign-Up Link", isDefault: true, previewUrl: "#" },
  { id: "3", pageName: "EvalRight - No CC Required", isDefault: false, previewUrl: "#" },
];

export const CONFIG_GROUP_OPTIONS = [
  "New Sign-Ups EvalRight",
  "SteelIQ",
  "Evalright Group",
];

export const BILLING_AUTHORIZE_NET = {
  apiLoginId: "6H3ssL7wu",
  transactionKey: "977pn3SE2QZ2GrSm",
};

export interface SalesOperator {
  id: string;
  username: string;
  name: string;
  email: string;
  salesPct: number;
  managerPct: number;
}

export const SALES_OPERATORS: SalesOperator[] = [
  { id: "261", username: "sindhu", name: "Sindhuja Yedire", email: "Evalrightus", salesPct: 0, managerPct: 0 },
  { id: "203", username: "Puneet", name: "Puneet P", email: "sales@evalright.us", salesPct: 0, managerPct: 0 },
  { id: "202", username: "Ramesh", name: "Ramesh R", email: "Evalrightus", salesPct: 0, managerPct: 0 },
  { id: "94", username: "suresh", name: "Suresh Ramakoti", email: "suresh@evalright.us", salesPct: 0, managerPct: 0 },
];

export const SALES_MANAGER_OPTIONS = ["None", "Raghu Adaveni", "Puneet P", "Ramesh R", "Suresh Ramakoti"];

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  lastModified: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: "1", name: "Order Confirmation", subject: "Your EvalRight Order Confirmation", lastModified: "05/12/2026" },
  { id: "2", name: "Invoice Notification", subject: "Your EvalRight Invoice", lastModified: "04/28/2026" },
  { id: "3", name: "Password Reset", subject: "Reset Your EvalRight Password", lastModified: "03/15/2026" },
];

export const WELCOME_EMAIL_DEFAULT = {
  enabled: true,
  subject: "Welcome to EvalRight",
  body: "Dear {primary_user},\n\nWelcome to EvalRight! Your account for {company_name} has been created.\n\nYou can log in at: {login_url}\n\nThank you,\nEvalRight Support",
};
