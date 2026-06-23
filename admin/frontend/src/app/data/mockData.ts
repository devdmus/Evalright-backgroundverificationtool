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
