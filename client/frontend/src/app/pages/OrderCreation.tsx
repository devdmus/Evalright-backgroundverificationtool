import { useState, useRef, useEffect } from "react";
import { RotateCcw, ArrowRight, Search, Save, ChevronLeft, ChevronRight, ChevronDown, X, Edit, Mail } from "lucide-react";
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";
import { ORDERS } from "../data/mockData";

interface OrderCreationProps {
  isInvitation?: boolean;
  showInvitationBanner?: boolean;
  isDarkMode?: boolean;
  onNavigate?: (page: any) => void;
  currentUser?: any;
}

interface AlaCarteSearchItem {
  id: string;
  name: string;
  hasTooltip?: boolean;
}

interface AlaCarteCategory {
  title: string;
  hasExpand?: boolean;
  items: AlaCarteSearchItem[];
}

const COL1_CATEGORIES: AlaCarteCategory[] = [
  {
    title: "Identity & Database Verifications",
    hasExpand: true,
    items: [
      { id: "personal-details", name: "Personal Details", hasTooltip: true },
      { id: "ssn-check", name: "SSN Check", hasTooltip: true },
      { id: "id-verification-aadhar", name: "ID Verification (Aadhar)", hasTooltip: true },
      { id: "id-verification-pan", name: "ID Verification (PAN)", hasTooltip: true },
      { id: "id-verification-dl", name: "ID Verification (DL)", hasTooltip: true },
      { id: "id-verification-voterid", name: "ID Verification (Voter ID)", hasTooltip: true },
      { id: "id-verification-passport", name: "ID Verification (Passport)", hasTooltip: true },
      { id: "uan-verification", name: "UAN Verification", hasTooltip: true },
      { id: "indian-database-check", name: "Indian Database Check", hasTooltip: true },
      { id: "global-database-check", name: "Global Database Check", hasTooltip: true },
      { id: "ofac-check", name: "OFAC Check", hasTooltip: true },
    ]
  },
  {
    title: "Criminal & Registry Searches",
    hasExpand: true,
    items: [
      { id: "criminal-record-check", name: "Criminal Record Check", hasTooltip: true },
      { id: "police-verification-check", name: "Police Verification Check", hasTooltip: true },
      { id: "nationwide-criminal-check", name: "Nationwide Criminal Check", hasTooltip: true },
      { id: "national-sex-offender-registry-check", name: "National Sex Offender Registry Check", hasTooltip: true },
    ]
  },
  {
    title: "Financial & Tax Checks",
    hasExpand: true,
    items: [
      { id: "credit-check", name: "Credit Check", hasTooltip: true },
      { id: "26as-check", name: "26AS Check", hasTooltip: true },
      { id: "form-16-check", name: "Form 16 Check", hasTooltip: true },
      { id: "itr-check", name: "ITR Check", hasTooltip: true },
    ]
  }
];

const COL2_CATEGORIES: AlaCarteCategory[] = [
  {
    title: "Professional & Education Verifications",
    hasExpand: true,
    items: [
      { id: "employment-verification", name: "Employment Verification", hasTooltip: true },
      { id: "education-verification", name: "Education Verification", hasTooltip: true },
      { id: "reference-check", name: "Reference Check", hasTooltip: true },
      { id: "freelancing-check", name: "Freelancing Check", hasTooltip: true },
      { id: "directorship-check", name: "Directorship Check", hasTooltip: true },
      { id: "cv-check", name: "Cv Check", hasTooltip: true },
      { id: "gap-analysis", name: "Gap Analysis", hasTooltip: true },
    ]
  },
  {
    title: "Address Verifications",
    hasExpand: true,
    items: [
      { id: "address-verification", name: "Address Verification", hasTooltip: true },
      { id: "supplier-address", name: "Supplier Address", hasTooltip: true },
    ]
  },
  {
    title: "Health & Other Checks",
    hasExpand: true,
    items: [
      { id: "drug-test", name: "Drug test", hasTooltip: true },
      { id: "medical-examination-test", name: "Medical Examination Test", hasTooltip: true },
      { id: "social-media-check", name: "Social Media Check", hasTooltip: true },
      { id: "right-to-work", name: "Right to Work", hasTooltip: true },
      { id: "emergency", name: "Emergency", hasTooltip: true },
      { id: "authorization", name: "Authorization", hasTooltip: true },
      { id: "exit", name: "Exit", hasTooltip: true },
    ]
  }
];

const TOOLTIP_MESSAGES: Record<string, string> = {
  "personal-details": "Verify basic personal details (gender, name, father's name, contact info, DOB, PAN, UAN).",
  "ssn-check": "Verify identity using Social Security Number (SSN) verification search.",
  "id-verification-aadhar": "Verify candidate identity information against the Aadhaar (UIDAI) records.",
  "id-verification-pan": "Verify candidate identity information against the Permanent Account Number (PAN) database.",
  "id-verification-dl": "Verify candidate identity information against their Driving License details.",
  "id-verification-voterid": "Verify candidate identity information against Voter ID records.",
  "id-verification-passport": "Verify candidate identity information against Passport records.",
  "uan-verification": "Verify candidate Universal Account Number (UAN) history for employment details.",
  "indian-database-check": "Cross-reference candidate details against Indian public and regulatory databases.",
  "global-database-check": "Cross-reference candidate details against international public and regulatory databases.",
  "ofac-check": "Check candidate details against the Office of Foreign Assets Control (OFAC) sanctions list.",
  "criminal-record-check": "Check for local criminal court records (misdemeanors/felonies) in relevant jurisdictions.",
  "police-verification-check": "Initiate background verification through local police station reports.",
  "nationwide-criminal-check": "Perform a nationwide criminal database search covering multiple jurisdictions.",
  "national-sex-offender-registry-check": "Verify candidate registration status against the national sex offender database.",
  "credit-check": "Perform a credit bureau search to check credit history and financial health.",
  "26as-check": "Verify employment and income history using candidate's Form 26AS tax statements.",
  "form-16-check": "Verify employment and tax deductions using candidate's Form 16 statements.",
  "itr-check": "Verify tax filing records using candidate's Income Tax Return (ITR) details.",
  "employment-verification": "Verify candidate's employment history, designations, and tenures directly with employers.",
  "education-verification": "Verify candidate's educational credentials, degrees, and graduation dates directly with institutions.",
  "reference-check": "Contact candidate references to verify character, work relationship, and performance details.",
  "freelancing-check": "Verify candidate freelancing/independent contract history and client relationships.",
  "directorship-check": "Verify candidate directorship listings and corporate registry involvement.",
  "cv-check": "Cross-check and verify details provided in the candidate's CV/Resume.",
  "gap-analysis": "Analyze and verify reasons for gaps in candidate's education or employment history.",
  "address-verification": "Verify candidate's residential address (current, permanent, or previous) via physical or digital means.",
  "supplier-address": "Verify the registered address and authenticity of suppliers/vendor entities.",
  "drug-test": "Perform screening for illicit substances or controlled drug panels.",
  "medical-examination-test": "Conduct health and medical exams as required for specific job roles.",
  "social-media-check": "Scan public social media profiles for professional and behavioral indicators.",
  "right-to-work": "Verify candidate's legal eligibility and work authorization in their employment country.",
  "emergency": "Verify emergency contact details and relationship information.",
  "authorization": "Ensure correct candidate consent and Authorization LOA is signed and filed.",
  "exit": "Verify candidate's previous exit procedures, reasons, and clearance status.",
};

const STATES_LIST = [
  "Select State",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];



const SERVICE_PRICES: Record<string, number> = {
  "personal-details": 300,
  "ssn-check": 300,
  "id-verification-aadhar": 300,
  "id-verification-pan": 300,
  "id-verification-dl": 300,
  "id-verification-voterid": 300,
  "id-verification-passport": 300,
  "uan-verification": 350,
  "indian-database-check": 600,
  "global-database-check": 600,
  "ofac-check": 600,
  "criminal-record-check": 600,
  "police-verification-check": 700,
  "nationwide-criminal-check": 600,
  "national-sex-offender-registry-check": 600,
  "credit-check": 700,
  "26as-check": 350,
  "form-16-check": 350,
  "itr-check": 350,
  "employment-verification": 600,
  "education-verification": 900,
  "reference-check": 450,
  "freelancing-check": 600,
  "directorship-check": 750,
  "cv-check": 200,
  "gap-analysis": 200,
  "address-verification": 650,
  "supplier-address": 650,
  "drug-test": 2500,
  "medical-examination-test": 600,
  "social-media-check": 675,
  "right-to-work": 550,
  "emergency": 200,
  "authorization": 200,
  "exit": 600,
  "cdlis": 300,
  "driving-history": 300,
  "labcorp-10-panel": 2500,
  "adhr-trace": 300,
  "adhr-validation": 300
};

const allSearchItems = [
  ...COL1_CATEGORIES.flatMap((cat) => cat.items),
  ...COL2_CATEGORIES.flatMap((cat) => cat.items),
];
const itemMap = new Map(allSearchItems.map((item) => [item.id, item]));

function calculateOrderAmounts(selectedIds: Set<string>, rushOrder: boolean) {
  let grossAmount = 0;
  selectedIds.forEach((id) => {
    grossAmount += SERVICE_PRICES[id] || 200;
  });
  if (rushOrder) grossAmount += 25;
  const deductions = 0;
  const netAmount = Math.max(grossAmount - deductions, 0);
  return { grossAmount, deductions, netAmount };
}

declare global {
  interface Window {
    Razorpay?: new (options: any) => { open: () => void; on: (event: string, cb: (response: any) => void) => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function maskAdhr(val: string) {
  if (!val) return "";
  if (val.includes("X") || val.includes("x") || val.includes("*")) return val;
  const clean = val.replace(/\D/g, "");
  if (clean.length >= 4) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  return val;
}

function getSearchDisplayName(itemId: string, name: string) {
  if (itemId === "adhr-trace-address") {
    return "ADHR Trace/Address History (ADHR Trace)";
  }
  return name;
}

export function OrderCreation({ isInvitation = false, showInvitationBanner = false, isDarkMode = false, onNavigate, currentUser }: OrderCreationProps) {
  const t = getPageTheme(isDarkMode);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bannerVisible, setBannerVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Step state: 1 = Searches Selection, 2 = Enter Applicant Info, 3 = Order Review, 4 = Success
  const [step, setStep] = useState(1);
  const [afterOrderAction, setAfterOrderAction] = useState("view-results");
  const [invitationTemplate, setInvitationTemplate] = useState("Select Template");

  const [availableTemplates, setAvailableTemplates] = useState<string[]>(["Select Template", "Standard Invitation Template"]);

  useEffect(() => {
    const saved = localStorage.getItem("evalright_templates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableTemplates(["Select Template", ...parsed.map((p: any) => p.name)]);
        }
      } catch (e) {}
    }
  }, []);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [middleNameDisabled, setMiddleNameDisabled] = useState(false);
  const [lastName, setLastName] = useState("");

  const [dob, setDob] = useState("");
  const [showMinorModal, setShowMinorModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [minorAgreementChecked, setMinorAgreementChecked] = useState(true);
  const [adhr, setAdhr] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [reference, setReference] = useState("");
  const [jobState, setJobState] = useState("Select State");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [emailReport, setEmailReport] = useState(false);
  const [rushOrder, setRushOrder] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastError, setIsToastError] = useState(false);

  function triggerToast(msg: string, isError = false) {
    setToastMessage(msg);
    setIsToastError(isError);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleCategoryCollapse(title: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  }

  function startOver() {
    setSelected(new Set());
    setSearchQuery("");
    setCollapsedCategories(new Set());
    setBannerVisible(true);
    setStep(1);

    // Reset Form fields
    setFirstName("");
    setMiddleName("");
    setMiddleNameDisabled(false);
    setLastName("");

    setDob("");
    setAdhr("");
    setStreetAddress("");
    setZipCode("");
    setReference("");
    setJobState("Select State");
    setApplicantEmail("");
    setEmailReport(false);
    setRushOrder(false);
    setAfterOrderAction("view-results");
    setShowSubmitModal(false);
    setInvitationTemplate("Select Template");
  }

  function handleStep1Next() {
    if (selected.size === 0) {
      triggerToast("Please select at least one search product.", true);
      return;
    }
    setStep(2);
  }

  function isMinor(dobString: string): boolean {
    if (!dobString) return false;
    const parts = dobString.split("/");
    if (parts.length !== 3) return false;
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return false;

    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }

  function handleStep2Next() {
    // Form Validation
    const isMiddleNameValid = middleNameDisabled || middleName.trim() !== "";
    if (
      !firstName.trim() ||
      !isMiddleNameValid ||
      !lastName.trim() ||
      !dob.trim() ||
      !adhr.trim() ||
      !streetAddress.trim() ||
      !zipCode.trim() ||
      jobState === "Select State" ||
      !applicantEmail.trim()
    ) {
      triggerToast("Please fill in all required fields (marked with *).", true);
      return;
    }
    
    setMinorAgreementChecked(true);
    setShowMinorModal(true);
  }

  async function handleSendInvitation() {
    const isMiddleNameValid = middleNameDisabled || middleName.trim() !== "";
    if (
      !firstName.trim() ||
      !isMiddleNameValid ||
      !lastName.trim() ||
      !applicantEmail.trim()
    ) {
      triggerToast("Please fill in all required fields (marked with *).", true);
      return;
    }

    // Format the email using the template
    let templateContent = "";
    let templateName = "";
    let templateSubject = "";
    let templateFromName = "";
    let templateReplyTo = "";
    let templateCopyTo = "";

    const savedTemplates = localStorage.getItem("evalright_templates");
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates);
        const matched = templates.find((t: any) => t.name === invitationTemplate);
        if (matched) {
          templateName = matched.name;
          templateSubject = matched.subject;
          templateContent = matched.content;
          templateFromName = matched.fromName;
          templateReplyTo = matched.replyTo;
          templateCopyTo = matched.copyTo;
        }
      } catch (e) {}
    }

    if (!templateContent) {
      templateContent = `
        <p>Hi [applicant_name],</p>
        <p style="margin-top: 16px;">Greetings from Evalright.</p>
        <p style="margin-top: 16px;">As the next step of the hiring process, your Background Verification needs to be initiated. We, Demo Client, are partnered with Evalright (BGV Agency) for this activity, and they will connect with you via email/phone to complete the process. You are requested to coordinate with the Evalright team and share the required information and documents through the Evalright Background Verification Portal.</p>
        <p style="margin-top: 16px;">Kindly follow the below steps to fill in the details and upload the documents:</p>
        <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc;">
          <li>Use the Portal URL, User ID, and Password mentioned at the bottom of this email to log in.</li>
          <li>Complete all the required verification sections on the portal.</li>
          <li>Please ensure that all required information is submitted within 48 hours of receiving this email.</li>
        </ul>
        <p style="margin-top: 16px;"><strong>Checks to be Completed</strong></p>
        <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc;">
          [CHECKS_TO_BE_COMPLETED]
        </ul>
        <p style="margin-top: 16px;"><strong>Important Notes</strong></p>
        <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc;">
          <li>After completing all the required details and uploading the requested documents, click the Final Submission button to receive an acknowledgment email.</li>
          <li>Please ensure that each uploaded document is less than 2 MB in size.</li>
        </ul>
        <p style="margin-top: 16px;">If you have any questions while filling out the information or experience any issues with the portal, please contact the Evalright Support Team at:</p>
        <p style="margin-top: 8px;"><a href="mailto:support@evalright.com" style="color: rgb(199, 0, 57);">support@evalright.com</a></p>
        <p style="margin-top: 16px;">You may also contact us at:</p>
        <p style="margin-top: 8px;">
          +91 XXXXXXXXXX<br/>
          <a href="mailto:testingit@gmail.com" style="color: rgb(199, 0, 57);">testingit@gmail.com</a>
        </p>
        <p style="margin-top: 16px;">To contact Demo Client, please write to:</p>
        <p style="margin-top: 8px;">Fetesh – <a href="mailto:fatesh@yopmail.com" style="color: rgb(199, 0, 57);">fatesh@yopmail.com</a></p>
        <p style="margin-top: 24px;">
          [INVITATION_URL]
        </p>
        <p style="margin-top: 24px;">Thanks & Regards,<br/>
        <strong>Evalright Background Verification Team</strong></p>
      `;
    }

    const fullName = `${firstName} ${middleNameDisabled ? "" : middleName + " "}${lastName}`.trim();
    const checksList = Array.from(selected)
      .map(id => {
        const item = itemMap.get(id);
        return item ? `<li>${item.name}</li>` : `<li>${id}</li>`;
      })
      .join('');

    let formattedBody = templateContent
      .replaceAll("[applicant_first_name]", firstName)
      .replaceAll("[applicant_last_name]", lastName)
      .replaceAll("[applicant_name]", fullName)
      .replaceAll("[company_name]", "EvalRight Client Corp")
      .replaceAll("[FCRA_URL]", "https://www.evalright.com/fcra")
      .replaceAll("[company_info]", "EvalRight Client Corp, 100 Main St, Chicago, IL")
      .replaceAll("[CHECKS_TO_BE_COMPLETED]", checksList);

    try {
      const response = await fetch("http://localhost:5000/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: applicantEmail,
          branchId: currentUser.branch_id,
          selectedProducts: Array.from(selected),
          orderedBy: currentUser.id,
          emailTemplateName: templateName,
          emailSubject: templateSubject || "Background Verification Process – Action Required",
          emailContent: templateContent,
          replyTo: templateReplyTo,
          fromName: templateFromName,
          copyTo: templateCopyTo
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create invitation in the database.");
      }

      const inviteId = data.inviteToken || "INV-" + Math.floor(100000 + Math.random() * 900000);
      const inviteUrl = `#invite-form?id=${inviteId}`;
      const linkHtml = `<div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
      </div>`;

      if (formattedBody.includes("[INVITATION_URL]")) {
        formattedBody = formattedBody.replaceAll("[INVITATION_URL]", linkHtml);
      } else {
        formattedBody += `<p style="margin-top: 24px;"><b>Please click the button below to fill out your background check authorization form:</b></p>${linkHtml}`;
      }

      const newEmail = {
        id: Math.floor(4000000 + Math.random() * 1000000),
        subject: templateSubject || "Background Verification Process – Action Required",
        recipient: applicantEmail,
        dateSent: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lastUpdate: "N/A",
        displayDateSent: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        body: formattedBody
      };

      const existingEmailsStr = localStorage.getItem("evalright_emails");
      let existingEmails = [];
      if (existingEmailsStr) {
        try {
          existingEmails = JSON.parse(existingEmailsStr);
        } catch (e) {}
      }
      localStorage.setItem("evalright_emails", JSON.stringify([newEmail, ...existingEmails]));

      const newInvite = {
        inviteId: inviteId,
        name: fullName,
        email: applicantEmail,
        dateCreated: new Date().toISOString().substring(0, 10),
        status: "Active",
        emailActivity: "Sent",
        selectedProducts: Array.from(selected),
      };

      const existingInvitesStr = localStorage.getItem("evalright_invitations");
      let existingInvites = [];
      if (existingInvitesStr) {
        try {
          existingInvites = JSON.parse(existingInvitesStr);
        } catch (e) {}
      }
      localStorage.setItem("evalright_invitations", JSON.stringify([newInvite, ...existingInvites]));

      // Also save a pending order in localStorage (evalright_orders)
      const existingOrdersStr = localStorage.getItem("evalright_orders");
      let existingOrders = [];
      if (existingOrdersStr) {
        try {
          existingOrders = JSON.parse(existingOrdersStr);
        } catch (e) {}
      } else {
        existingOrders = [...ORDERS];
      }

      const productNames = Array.from(selected).map((id: string) => {
        const knownNames: Record<string, string> = {
          "personal-details": "Personal Details",
          "ssn-check": "SSN Check",
          "id-verification-aadhar": "ID Verification (Aadhar)",
          "id-verification-pan": "ID Verification (PAN)",
          "id-verification-dl": "ID Verification (DL)",
          "id-verification-voterid": "ID Verification (Voter ID)",
          "id-verification-passport": "ID Verification (Passport)",
          "uan-verification": "UAN Verification",
          "indian-database-check": "Indian Database Check",
          "global-database-check": "Global Database Check",
          "ofac-check": "OFAC Check",
          "criminal-record-check": "Criminal Record Check",
          "police-verification-check": "Police Verification Check",
          "nationwide-criminal-check": "Nationwide Criminal Check",
          "national-sex-offender-registry-check": "National Sex Offender Registry Check",
          "credit-check": "Credit Check",
          "26as-check": "26AS Check",
          "form-16-check": "Form 16 Check",
          "itr-check": "ITR Check",
          "employment-verification": "Employment Verification",
          "education-verification": "Education Verification",
          "reference-check": "Reference Check",
          "freelancing-check": "Freelancing Check",
          "directorship-check": "Directorship Check",
          "cv-check": "Cv Check",
          "gap-analysis": "Gap Analysis",
          "address-verification": "Address Verification",
          "supplier-address": "Supplier Address",
          "drug-test": "Drug test",
          "medical-examination-test": "Medical Examination Test",
          "social-media-check": "Social Media Check",
          "right-to-work": "Right to Work",
          "emergency": "Emergency",
          "authorization": "Authorization",
          "exit": "Exit",
        };
        return knownNames[id] || id;
      });
      const verificationType = productNames.join(", ") || "Background Check";

      const pendingOrder = {
        searchId: "" + Math.floor(8000000 + Math.random() * 1000000),
        reportId: "RP-" + Math.floor(20000 + Math.random() * 10000),
        firstName,
        lastName,
        applicantName: fullName,
        verificationType,
        status: "PENDING" as const,
        orderedBy: currentUser.firstName && currentUser.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
          : currentUser.username,
        orderDate: new Date().toISOString().substring(0, 10),
        county: "Pending",
        state: "Pending",
        adhr: "Pending",
        dob: "Pending",
        applicantEmail: applicantEmail,
        criminalRecordsFound: "Pending",
        reference: reference || "",
        inviteId: inviteId,
      };
      localStorage.setItem("evalright_orders", JSON.stringify([pendingOrder, ...existingOrders]));

      setStep(4);
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "An error occurred while creating candidate invitation.", true);
    }
  }

  function handleSaveOrder() {
    triggerToast("Order draft saved successfully!");
  }

  const filterCategories = (categories: AlaCarteCategory[]) => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return {
          ...cat,
          items: filteredItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  };

  const filteredCol1 = filterCategories(COL1_CATEGORIES);
  const filteredCol2 = filterCategories(COL2_CATEGORIES);

  // Success view (Step 4)
  if (step === 4) {
    const successTitle = isInvitation ? "Invitation Sent Successfully!" : "Order Placed Successfully!";
    
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ flex: 1, padding: "40px 20px", background: t.contentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: t.cardBg, padding: "40px", borderRadius: "8px", boxShadow: t.cardShadow, border: t.cardBorder, textAlign: "center", maxWidth: "500px", width: "100%" }}>
            <div style={{ width: "64px", height: "64px", background: isDarkMode ? "rgba(5, 150, 105, 0.2)" : "#D1FAE5", color: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px auto" }}>
              ✓
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: t.text, marginBottom: "12px" }}>
              {successTitle}
            </h2>
            <p style={{ fontSize: "14px", color: t.textMuted, marginBottom: "30px", lineHeight: "1.5" }}>
              {isInvitation ? (
                <>
                  The invitation for <strong>{firstName} {lastName}</strong> has been sent. We have sent the invitation email to <strong>{applicantEmail}</strong>.
                </>
              ) : (
                <>
                  The order for <strong>{firstName} {lastName}</strong> has been submitted. We have sent a confirmation email to <strong>{applicantEmail}</strong>.
                </>
              )}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {isInvitation ? (
                <>
                  <button
                    onClick={() => {
                      // Reset applicant fields but keep selected searches
                      setFirstName("");
                      setMiddleName("");
                      setMiddleNameDisabled(false);
                      setLastName("");

                      setDob("");
                      setAdhr("");
                      setStreetAddress("");
                      setZipCode("");
                      setReference("");
                      setJobState("Select State");
                      setApplicantEmail("");
                      setEmailReport(false);
                      setRushOrder(false);
                      setStep(3); // Go to simplified applicant details directly
                    }}
                    style={{ width: "100%", height: "40px", background: "#C70039", color: "#FFFFFF", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Create Another Invitation
                  </button>
                  <button
                    onClick={startOver}
                    style={{ width: "100%", height: "40px", background: "#2E1B85", color: "#FFFFFF", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Go to Order Menu
                  </button>
                </>
              ) : (
                <>
                  {afterOrderAction === "view-results" && (
                    <button
                      onClick={() => onNavigate?.("reports-all-order-details")}
                      style={{ width: "100%", height: "40px", background: "#C70039", color: "#FFFFFF", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                    >
                      View Results
                    </button>
                  )}
                  {afterOrderAction === "order-same-new" && (
                    <button
                      onClick={() => {
                        // Reset applicant fields but keep selected searches
                        setFirstName("");
                        setMiddleName("");
                        setMiddleNameDisabled(false);
                        setLastName("");

                        setDob("");
                        setAdhr("");
                        setStreetAddress("");
                        setZipCode("");
                        setReference("");
                        setJobState("Select State");
                        setApplicantEmail("");
                        setEmailReport(false);
                        setRushOrder(false);
                        setStep(2);
                      }}
                      style={{ width: "100%", height: "40px", background: "#C70039", color: "#FFFFFF", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                    >
                      Order Same Searches on New Individual
                    </button>
                  )}
                  <button
                    onClick={startOver}
                    style={{ width: "100%", height: "40px", background: "#2E1B85", color: "#FFFFFF", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Go to Order Menu
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: t.contentBg,
        }}
      >
        <h4
          className="page-title text-primary"
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#B7042C",
            fontFamily: "'Wix Madefor Display', sans-serif",
            marginBottom: "24px",
          }}
        >
          {isInvitation ? (step === 3 ? "Invite Applicant" : "Order /w Invitation") : "Order"}
        </h4>

        {/* Invitation banner */}
        {showInvitationBanner && bannerVisible && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "4px",
              padding: "10px 40px",
              marginBottom: "25px",
              fontSize: "13px",
              color: "#1D4ED8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>ⓘ</span>
              <span>This is an applicant invitation order.</span>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#93C5FD",
                fontSize: "18px",
                lineHeight: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Searches Selection */
          <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {/* Header Bar */}
            <div
              style={{
                height: "44px",
                background: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#4B5563",
                borderRadius: "4px 4px 0 0",
                letterSpacing: "0.5px",
              }}
            >
              A LA CARTE SEARCHES
            </div>

            {/* Search Bar */}
            <div
              style={{
                padding: "16px 20px",
                background: "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div style={{ position: "relative", width: "100%" }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6D28D9",
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products & services..."
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 16px 0 44px",
                    fontSize: "14px",
                    color: "#1F2937",
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* 2-Column Grid of Categories */}
            <div
              style={{
                padding: "24px 20px",
                background: "#FFFFFF",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                alignItems: "start",
                borderRadius: "0 0 4px 4px",
              }}
            >
              {/* Column 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {filteredCol1.map((cat) => {
                  const isCollapsed = collapsedCategories.has(cat.title) && searchQuery === "";
                  return (
                    <div key={cat.title} style={{ display: "flex", flexDirection: "column" }}>
                      {/* Category Header */}
                      <div
                        style={{
                          height: "38px",
                          background: "#ECC2C9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0 12px",
                          borderRadius: "2px",
                        }}
                      >
                        <span
                          style={{
                            color: "#C70039",
                            fontSize: "15px",
                            fontWeight: 600,
                          }}
                        >
                          {cat.title}
                        </span>
                        {cat.hasExpand && (
                          <span
                            onClick={() => toggleCategoryCollapse(cat.title)}
                            style={{
                              color: "#C70039",
                              fontSize: "13px",
                              fontWeight: 600,
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                          >
                            {isCollapsed ? "Expand List +" : "Collapse List -"}
                          </span>
                        )}
                      </div>

                      {/* Category Items */}
                      {!isCollapsed && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            padding: "12px 6px 4px 6px",
                          }}
                        >
                          {cat.items.map((item) => (
                            <label
                              key={item.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#4B5563",
                                userSelect: "none",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selected.has(item.id)}
                                onChange={() => toggleItem(item.id)}
                                style={{
                                  accentColor: "#C70039",
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />
                              <span>{item.name}</span>
                              {item.hasTooltip && (
                                <span
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                  }}
                                >
                                  <span
                                    onMouseEnter={() => setHoveredItemId(item.id)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      color: "#3B82F6",
                                      background: "#DBEAFE",
                                      borderRadius: "4px",
                                      padding: "2px 6px",
                                      marginLeft: "4px",
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      lineHeight: 1,
                                      userSelect: "none",
                                    }}
                                  >
                                    ?
                                  </span>
                                  {hoveredItemId === item.id && TOOLTIP_MESSAGES[item.id] && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        bottom: "135%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#4B5563",
                                        color: "#FFFFFF",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        width: "260px",
                                        whiteSpace: "normal",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                        zIndex: 1000,
                                        pointerEvents: "none",
                                        lineHeight: "1.4",
                                        textAlign: "left",
                                      }}
                                    >
                                      {TOOLTIP_MESSAGES[item.id]}
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "100%",
                                          left: "50%",
                                          transform: "translateX(-50%)",
                                          width: 0,
                                          height: 0,
                                          borderLeft: "6px solid transparent",
                                          borderRight: "6px solid transparent",
                                          borderTop: "6px solid #4B5563",
                                        }}
                                      />
                                    </div>
                                  )}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Column 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {filteredCol2.map((cat) => {
                  const isCollapsed = collapsedCategories.has(cat.title) && searchQuery === "";
                  return (
                    <div key={cat.title} style={{ display: "flex", flexDirection: "column" }}>
                      {/* Category Header */}
                      <div
                        style={{
                          height: "38px",
                          background: "#ECC2C9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0 12px",
                          borderRadius: "2px",
                        }}
                      >
                        <span
                          style={{
                            color: "#C70039",
                            fontSize: "15px",
                            fontWeight: 600,
                          }}
                        >
                          {cat.title}
                        </span>
                        {cat.hasExpand && (
                          <span
                            onClick={() => toggleCategoryCollapse(cat.title)}
                            style={{
                              color: "#C70039",
                              fontSize: "13px",
                              fontWeight: 600,
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                          >
                            {isCollapsed ? "Expand List +" : "Collapse List -"}
                          </span>
                        )}
                      </div>

                      {/* Category Items */}
                      {!isCollapsed && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            padding: "12px 6px 4px 6px",
                          }}
                        >
                          {cat.items.map((item) => (
                            <label
                              key={item.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#4B5563",
                                userSelect: "none",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selected.has(item.id)}
                                onChange={() => toggleItem(item.id)}
                                style={{
                                  accentColor: "#C70039",
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />
                              <span>{item.name}</span>
                              {item.hasTooltip && (
                                <span
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                  }}
                                >
                                  <span
                                    onMouseEnter={() => setHoveredItemId(item.id)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      color: "#3B82F6",
                                      background: "#DBEAFE",
                                      borderRadius: "4px",
                                      padding: "2px 6px",
                                      marginLeft: "4px",
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      lineHeight: 1,
                                      userSelect: "none",
                                    }}
                                  >
                                    ?
                                  </span>
                                  {hoveredItemId === item.id && TOOLTIP_MESSAGES[item.id] && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        bottom: "135%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#4B5563",
                                        color: "#FFFFFF",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        width: "260px",
                                        whiteSpace: "normal",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                        zIndex: 1000,
                                        pointerEvents: "none",
                                        lineHeight: "1.4",
                                        textAlign: "left",
                                      }}
                                    >
                                      {TOOLTIP_MESSAGES[item.id]}
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "100%",
                                          left: "50%",
                                          transform: "translateX(-50%)",
                                          width: 0,
                                          height: 0,
                                          borderLeft: "6px solid transparent",
                                          borderRight: "6px solid transparent",
                                          borderTop: "6px solid #4B5563",
                                        }}
                                      />
                                    </div>
                                  )}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          isInvitation ? (
            /* Step 2 (Invitation): APPLICANT INVITATION PRODUCT ORDER REVIEW */
            <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
              <div
                style={{
                  height: "44px",
                  background: "#E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#4B5563",
                  borderRadius: "4px 4px 0 0",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                APPLICANT INVITATION PRODUCT ORDER REVIEW
              </div>
              
              <div style={{ padding: "24px 20px" }}>
                <div style={{ color: "#C70039", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
                  A La Carte Searches:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#374151" }}>
                  {Array.from(selected).map((itemId) => {
                    const item = itemMap.get(itemId);
                    const name = item ? item.name : itemId;
                    return (
                      <div key={itemId} style={{ fontWeight: 500 }}>
                        {getSearchDisplayName(itemId, name)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Step 2 (Standard): Enter Applicant Information */
            <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {/* Enter Applicant Information Header Banner */}
            <div
              style={{
                height: "44px",
                background: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#4B5563",
                borderRadius: "4px 4px 0 0",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              ENTER APPLICANT INFORMATION
            </div>

            {/* Form grid */}
            <div
              style={{
                padding: "24px 20px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Row 1 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.3fr 1.2fr",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <FloatingInput label="First Name" value={firstName} onChange={setFirstName} required />
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FloatingInput
                    label="Middle Name"
                    value={middleNameDisabled ? "" : middleName}
                    onChange={setMiddleName}
                    required={!middleNameDisabled}
                    disabled={middleNameDisabled}
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                      color: "#4B5563",
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={middleNameDisabled}
                      onChange={(e) => {
                        setMiddleNameDisabled(e.target.checked);
                        if (e.target.checked) {
                          setMiddleName("");
                        }
                      }}
                      style={{ width: "16px", height: "16px", accentColor: "#C70039", cursor: "pointer" }}
                    />
                    None
                  </label>
                </div>
                <FloatingInput label="Last Name" value={lastName} onChange={setLastName} required />
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
                <FloatingDatePicker label="Date of Birth" value={dob} onChange={setDob} required />
                <FloatingInput label="Aadhaar Number (ADHR)" value={adhr} onChange={setAdhr} required placeholder="XXXX-XXXX-XXXX" />
                <FloatingInput label="Street Address" value={streetAddress} onChange={setStreetAddress} required />
                <FloatingInput label="Zip Code" value={zipCode} onChange={setZipCode} required />
              </div>

              {/* Row 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
                <FloatingInput label="Reference" value={reference} onChange={setReference} />
                <FloatingSelect
                  label="Job Position State"
                  value={jobState}
                  options={STATES_LIST}
                  onChange={setJobState}
                  required
                />
              </div>
            </div>

            {/* Additional Header Banner */}
            <div
              style={{
                height: "44px",
                background: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#4B5563",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              ADDITIONAL
            </div>

            {/* Additional Options Container */}
            <div style={{ padding: "24px 20px", background: "#FFFFFF", borderRadius: "0 0 4px 4px" }}>
              {/* Email row */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "300px" }}>
                  <FloatingInput
                    label="Applicant Email"
                    value={applicantEmail}
                    onChange={setApplicantEmail}
                    required
                  />
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#4B5563",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={emailReport}
                    onChange={(e) => setEmailReport(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#C70039", cursor: "pointer" }}
                  />
                  Check to email applicant report when completed
                </label>
              </div>

              {/* Rush Order Option */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "24px" }}>
                <input
                  type="checkbox"
                  id="rush-order"
                  checked={rushOrder}
                  onChange={(e) => setRushOrder(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#C70039",
                    marginTop: "3px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="rush-order"
                  style={{
                    fontSize: "13px",
                    color: "#555555",
                    lineHeight: "1.5",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span style={{ color: "#B7042C", fontWeight: "bold" }}>Rush this order for ₹25</span>
                  <span>
                    {" "}
                    - Selecting this option means that your order will jump to the top of the queue so that we process
                    it before any other orders. Once the order leaves our system, we will do our best to accelerate
                    the turnaround but some courts, employers and education institutions may not fully cooperate.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )
      ) : (
          isInvitation ? (
            /* Step 3 (Invitation): Enter Applicant Information */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Card 1: Draft Order Info */}
              <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
                <div
                  style={{
                    height: "44px",
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "20px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#4B5563",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  Draft Order #2062663
                </div>
                <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#4B5563", lineHeight: "1.6" }}>
                  <div>
                    Thank you for choosing the 2 Step Checks process.
                  </div>
                  <div>
                    Select your invitation template, enter your applicant's name and email address, and click "Send Invitation".
                  </div>
                  <div>
                    Your applicant will open the email, click the link to review their FCRA Summary of Rights, read the instructions, and then click another link that takes them to a screen where they can enter all required information for the background check. They will electronically sign the Disclosure & Authorization form, the searches will be processed, and the final report will be emailed to you.
                  </div>
                  <div>
                    Questions? Call <a href="tel:1-800-935-9025" style={{ color: "#2563EB", textDecoration: "none" }}>1-800-935-9025</a>.
                  </div>
                  
                  {/* STOP AND READ SECTION */}
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ background: "#FEF3C7", color: "#92400E", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", width: "fit-content" }}>
                      STOP AND READ!
                    </div>
                    <div style={{ color: "#DC2626", fontSize: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        Please make sure you enter your applicant's legal first, middle, and last name. Do not use a nickname. If you need to verify your applicant's legal name, please contact the applicant before sending this invitation.
                      </div>
                      <div>
                        Entering any name other than the applicant's legal name may result in processing delays and/or inaccurate results.
                      </div>
                      <div>
                        If you have not verified the applicant's legal name before sending this invitation, we cannot guarantee the highest possible accuracy, and no refunds will be issued if the legal name was not entered here.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Form Fields */}
              <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px 20px" }}>
                {/* Email Template Select */}
                <div style={{ marginBottom: "20px", maxWidth: "480px" }}>
                  <FloatingSelect
                    label="Invitation Email Template"
                    value={invitationTemplate}
                    options={availableTemplates}
                    onChange={setInvitationTemplate}
                  />
                </div>

                {/* Name Inputs Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.3fr 1.2fr", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                  <FloatingInput label="First Name" value={firstName} onChange={setFirstName} required />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FloatingInput
                      label="Middle Name"
                      value={middleNameDisabled ? "" : middleName}
                      onChange={setMiddleName}
                      required={!middleNameDisabled}
                      disabled={middleNameDisabled}
                    />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "13px",
                        color: "#4B5563",
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={middleNameDisabled}
                        onChange={(e) => {
                          setMiddleNameDisabled(e.target.checked);
                          if (e.target.checked) {
                            setMiddleName("");
                          }
                        }}
                        style={{ width: "16px", height: "16px", accentColor: "#C70039", cursor: "pointer" }}
                      />
                      None
                    </label>
                  </div>
                  <FloatingInput label="Last Name" value={lastName} onChange={setLastName} required />
                </div>

                {/* Email & Reference Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#4B5563", marginBottom: "6px" }}>Send to Email:</div>
                    <FloatingInput
                      label="Applicant's Email Address"
                      value={applicantEmail}
                      onChange={setApplicantEmail}
                      required
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#4B5563", marginBottom: "6px" }}>Reference:</div>
                    <FloatingInput
                      label="Reference Code"
                      value={reference}
                      onChange={setReference}
                    />
                  </div>
                </div>

                {/* Additional Section */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#4B5563", marginBottom: "16px" }}>Additional</div>
                  
                  {/* Rush Order */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px" }}>
                    <input
                      type="checkbox"
                      id="rush-order-invite"
                      checked={rushOrder}
                      onChange={(e) => setRushOrder(e.target.checked)}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "#C70039",
                        marginTop: "4px",
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                    />
                    <label
                      htmlFor="rush-order-invite"
                      style={{
                        fontSize: "13px",
                        color: "#555555",
                        lineHeight: "1.5",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <span style={{ color: "#B7042C", fontWeight: "bold" }}>Rush this order for ₹25</span>
                      <span>
                        {" "}
                        - Selecting this option means that your order will jump to the top of the queue so that we process
                        it before any other orders. Once the order leaves our system, we will do our best to accelerate
                        the turnaround but some courts, employers and education institutions may not fully cooperate.
                      </span>
                    </label>
                  </div>

                  {/* IP Logging Warning */}
                  <div style={{ fontSize: "14px", color: "#D97706", fontWeight: "500", marginTop: "16px", fontStyle: "normal" }}>
                    * For your protection, we have logged your IP Address. Your IP: 183.82.116.22 *
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Step 3 (Standard): Order Review */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Card 1: Applicant Information */}
            <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
              <div
                style={{
                  height: "44px",
                  background: "#E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 20px",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#4B5563", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  Applicant Information
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    height: "30px",
                    padding: "0 12px",
                    background: "#C70039",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Edit size={12} />
                  Edit
                </button>
              </div>
              
              <div style={{ padding: "24px 20px" }}>
                <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#6B7280" }}>
                  Please review applicant information below thoroughly.
                </p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Applicant's Full Name:
                    </div>
                    <div style={{ fontSize: "15px", color: "#1F2937", marginTop: "6px", fontWeight: 500 }}>
                      {firstName} {middleNameDisabled ? "" : middleName} {lastName}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Applicant's Aadhaar:
                    </div>
                    <div style={{ fontSize: "15px", color: "#1F2937", marginTop: "6px", fontWeight: 500 }}>
                      {maskAdhr(adhr)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Applicant's DOB:
                    </div>
                    <div style={{ fontSize: "15px", color: "#1F2937", marginTop: "6px", fontWeight: 500 }}>
                      {dob}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Order Review Table */}
            <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
              <div
                style={{
                  height: "44px",
                  background: "#E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#4B5563",
                  borderRadius: "4px 4px 0 0",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Order Review
              </div>
              
              <div style={{ padding: "0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>Product Name</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>Location</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>Edit</th>
                      <th style={{ textAlign: "right", padding: "12px 20px", fontSize: "13px", fontWeight: 600, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                      <th style={{ width: "60px", padding: "12px 20px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let orderSubtotal = 0;
                      return (
                        <>
                          {Array.from(selected).map((itemId) => {
                            const item = itemMap.get(itemId);
                            const productName = item ? item.name : itemId;
                            const editLabel = itemId === "adhr-trace-address" ? "Show ADHR Report" : "Show Report";
                            const price = SERVICE_PRICES[itemId] || 200;
                            orderSubtotal += price;
                            
                            return (
                              <tr key={itemId} style={{ borderBottom: "1px solid #E5E7EB" }}>
                                <td style={{ padding: "16px 20px", fontSize: "14px", color: "#374151", fontWeight: 500 }}>{productName}</td>
                                <td style={{ padding: "16px 20px", fontSize: "14px", color: "#374151" }}></td>
                                <td style={{ padding: "16px 20px", fontSize: "14px" }}>
                                  <span 
                                    style={{ color: "#2563EB", cursor: "pointer", fontWeight: 500 }}
                                    onClick={() => setStep(1)}
                                  >
                                    {editLabel}
                                  </span>
                                </td>
                                <td style={{ padding: "16px 20px", fontSize: "14px", color: "#374151", textAlign: "right", fontWeight: 500 }}>₹{price.toFixed(2)}</td>
                                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px", background: "#C70039", borderRadius: "4px", color: "#FFFFFF", fontSize: "11px", fontWeight: "bold" }}>
                                    ✓
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          
                          {rushOrder && (
                            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                              <td style={{ padding: "16px 20px", fontSize: "14px", color: "#374151", fontWeight: 500 }}>Rush Order Fee</td>
                              <td style={{ padding: "16px 20px", fontSize: "14px", color: "#374151" }}></td>
                              <td style={{ padding: "16px 20px", fontSize: "14px" }}></td>
                              <td style={{ padding: "16px 20px", fontSize: "14px", color: "#374151", textAlign: "right", fontWeight: 500 }}>₹25.00</td>
                              <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px", background: "#C70039", borderRadius: "4px", color: "#FFFFFF", fontSize: "11px", fontWeight: "bold" }}>
                                  ✓
                                </div>
                              </td>
                            </tr>
                          )}
                          
                          {/* Total Row */}
                          <tr style={{ background: "#F9FAFB" }}>
                            <td style={{ padding: "16px 20px", fontSize: "15px", color: "#1F2937", fontWeight: "bold" }}>Total</td>
                            <td style={{ padding: "16px 20px" }}></td>
                            <td style={{ padding: "16px 20px" }}></td>
                            <td style={{ padding: "16px 20px", fontSize: "15px", color: "#1F2937", textAlign: "right", fontWeight: "bold" }}>
                              ₹{(orderSubtotal + (rushOrder ? 25 : 0)).toFixed(2)}
                            </td>
                            <td style={{ padding: "16px 20px" }}></td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 3: After ordering this report */}
            <div style={{ background: "#FFFFFF", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
              <div
                style={{
                  height: "44px",
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#4B5563",
                  borderRadius: "4px 4px 0 0",
                  letterSpacing: "0.5px",
                }}
              >
                After ordering this report:
              </div>
              
              <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="radio"
                    name="afterOrderAction"
                    value="view-results"
                    checked={afterOrderAction === "view-results"}
                    onChange={(e) => setAfterOrderAction(e.target.value)}
                    style={{ width: "18px", height: "18px", accentColor: "#C70039", cursor: "pointer" }}
                  />
                  <span>View Results</span>
                </label>
                
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="radio"
                    name="afterOrderAction"
                    value="order-menu"
                    checked={afterOrderAction === "order-menu"}
                    onChange={(e) => setAfterOrderAction(e.target.value)}
                    style={{ width: "18px", height: "18px", accentColor: "#C70039", cursor: "pointer" }}
                  />
                  <span>Go to Order Menu</span>
                </label>
                
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="radio"
                    name="afterOrderAction"
                    value="order-same-new"
                    checked={afterOrderAction === "order-same-new"}
                    onChange={(e) => setAfterOrderAction(e.target.value)}
                    style={{ width: "18px", height: "18px", accentColor: "#C70039", cursor: "pointer" }}
                  />
                  <span>Order same searches on new individual</span>
                </label>
              </div>
            </div>

          </div>
        )
      )}
      </div>

      {/* Action buttons */}
      {step === 1 ? (
          /* Step 1 Footer Buttons */
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "40px 0",
              background: "#F5F5F5",
            }}
          >
            {/* Start Over */}
            <button
              onClick={startOver}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "40px",
                padding: "0 20px",
                background: "#E5E7EB",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#374151",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <RotateCcw size={16} />
              Start Over
            </button>

            {/* Next */}
            <button
              onClick={handleStep1Next}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "40px",
                padding: "0 24px",
                background: "#C70039",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#FFFFFF",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        ) : step === 2 ? (
          isInvitation ? (
            /* Step 2 (Invitation): APPLICANT INVITATION PRODUCT ORDER REVIEW Buttons */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "40px 0",
                background: "#F5F5F5",
              }}
            >
              <button
                onClick={startOver}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  background: "#C70039",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Start Over
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  background: "#C70039",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Continue
              </button>
            </div>
          ) : (
            /* Step 2 (Standard) Footer Buttons */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "40px 0",
                background: "#F5F5F5",
              }}
            >
              {/* Start Over */}
              <button
                onClick={startOver}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 20px",
                  background: "#2E1B85",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <RotateCcw size={16} />
                Start Over
              </button>

              {/* Save Order */}
              <button
                onClick={handleSaveOrder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 20px",
                  background: "#2E1B85",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <Save size={16} />
                Save Order
              </button>

              {/* Next */}
              <button
                onClick={handleStep2Next}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 24px",
                  background: "#C70039",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          )
        ) : (
          isInvitation ? (
            /* Step 3 (Invitation) Footer Buttons */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "40px 0",
                background: "#F5F5F5",
              }}
            >
              {/* Cancel */}
              <button
                onClick={startOver}
                style={{
                  height: "40px",
                  padding: "0 32px",
                  background: "#2E1B85",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              {/* Send Invitation */}
              <button
                onClick={handleSendInvitation}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 24px",
                  background: "#C70039",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Send Invitation
                <Mail size={16} />
              </button>
            </div>
          ) : (
            /* Step 3 (Standard) Footer Buttons */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "40px 0",
                background: "#F5F5F5",
              }}
            >
              {/* Start Over */}
              <button
                onClick={startOver}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 20px",
                  background: "#2E1B85",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <RotateCcw size={16} />
                Start Over
              </button>

              {/* Save Order */}
              <button
                onClick={handleSaveOrder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 20px",
                  background: "#2E1B85",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <Save size={16} />
                Save Order
              </button>

              {/* Add Another Search */}
              <button
                onClick={() => setStep(1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 24px",
                  background: "#C70039",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Add Another Search
              </button>

              {/* Pay Now */}
              <button
                onClick={() => setShowSubmitModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 24px",
                  background: "#C70039",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Pay Now
              </button>
            </div>
          )
        )}

      {/* Minor Applicant Authorization Modal */}
      {showMinorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "720px",
              maxWidth: "90%",
              background: "#FFFFFF",
              borderRadius: "4px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "#C70039",
                color: "#FFFFFF",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                {isMinor(dob) ? "Minor Applicant Authorization" : "Applicant Authorization"}
              </span>
              <button
                type="button"
                onClick={() => setShowMinorModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#4B5563", lineHeight: "1.6" }}>
                {isMinor(dob)
                  ? "Employer certifies that it has obtained and maintains a signed authorization from the parent or legal guardian of the minor applicant/employee, permitting the procurement of a background check for employment purposes."
                  : "Employer certifies that it has obtained and maintains a signed authorization from the applicant/employee, permitting the procurement of a background check for employment purposes."}
              </p>
              
              <div>
                <div style={{ fontSize: "14px", color: "#4B5563", fontWeight: "600", marginBottom: "12px" }}>
                  The Company affirms that:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    listStyleType: "disc",
                    color: "#4B5563",
                    fontSize: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    lineHeight: "1.5",
                  }}
                >
                  <li>Proper disclosure was provided in accordance with the Fair Credit Reporting Act (FCRA).</li>
                  <li>
                    {isMinor(dob)
                      ? "Written parental/guardian consent has been obtained prior to initiating the background check."
                      : "Written consent has been obtained prior to initiating the background check."}
                  </li>
                  <li>Any information obtained will be used solely for lawful employment purposes and handled in compliance with applicable federal and state laws.</li>
                </ul>
              </div>

              {/* Agreement checkbox row */}
              <div
                style={{
                  borderTop: "1px solid #E5E7EB",
                  paddingTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={minorAgreementChecked}
                    onChange={(e) => setMinorAgreementChecked(e.target.checked)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#C70039",
                      cursor: "pointer",
                    }}
                  />
                  <span>By clicking here, you agree to these terms.</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowMinorModal(false)}
                  style={{
                    height: "40px",
                    padding: "0 24px",
                    background: "#2E1B85",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (minorAgreementChecked) {
                      setShowMinorModal(false);
                      setStep(3);
                    }
                  }}
                  disabled={!minorAgreementChecked}
                  style={{
                    height: "40px",
                    padding: "0 24px",
                    background: minorAgreementChecked ? "#C70039" : "#E5E7EB",
                    color: minorAgreementChecked ? "#FFFFFF" : "#9CA3AF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: minorAgreementChecked ? "pointer" : "not-allowed",
                  }}
                >
                  Continue
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "600px",
              maxWidth: "90%",
              background: "#FFFFFF",
              borderRadius: "4px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
              By clicking "Pay Now", you agree to the <span style={{ color: "#C70039", fontWeight: "bold" }}>₹{calculateOrderAmounts(selected, rushOrder).netAmount.toFixed(2)}</span> charge, and to the following certifications:
            </div>

            <div
              style={{
                background: "#FFF7ED",
                border: "1px solid #FDBA74",
                borderRadius: "6px",
                padding: "12px 14px",
                fontSize: "13px",
                color: "#9A3412",
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>Razorpay Test Mode tips</div>
              <div>• <b>Netbanking:</b> choose any bank → click <b>Success</b> on the mock page (most reliable).</div>
              <div>• <b>Card:</b> enter any Razorpay test card → on the bank/OTP page click <b>Success</b>.</div>
              <div>• <b>UPI QR:</b> cannot be scanned by real apps in test mode — use Netbanking or Card instead.</div>
            </div>

            <div style={{ color: "#C70039", fontSize: "14px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontWeight: 500 }}>
                I agree and certify now and at the time of each order of a consumer report for employment purposes, or in accordance with the written instructions of the consumer, that:
              </div>

              <div>
                · (1) the consumer has been provided with a disclosure, in a document consisting solely of the disclosure, and that a consumer report will be procured from a consumer reporting agency in connection with the consumer seeking to work as an employee or to perform services as an independent contractor or to serve as volunteer;
              </div>

              <div>
                · (2) if our company / organization decides to take any adverse action against the consumer based in whole or in part on the consumer report, we will provide the consumer a copy of the consumer report along with “A Summary of Your Rights Under the Fair Credit Reporting Act” before taking any adverse action; and as part of the Adverse Action process, we will perform an Individualized Assessment on the consumer, as required by applicable laws, ordinances and EEOC Guidance;
              </div>

              <div>
                · (3) information from the consumer report will not be used in violation of any applicable Federal or State equal employment opportunity law or regulation and;
              </div>

              <div>
                · (4) these actions may not be legally required with respect to screening independent contractors and volunteers pursuant to their written instructions. However, to the extent these actions are not legally required, our company / organization shall exceed legal requirements and still take these actions in favor of the consumer.
              </div>
            </div>

            <div style={{ fontSize: "14px", color: "#D97706", fontWeight: "600", marginTop: "8px" }}>
              *For your protection, we have logged your IP Address 183.82.116.22
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                style={{
                  height: "40px",
                  padding: "0 32px",
                  background: "#2E1B85",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                type="button"
                disabled={isSubmittingOrder}
                onClick={async () => {
                  if (!currentUser) {
                    triggerToast("You must be logged in to pay for an order.", true);
                    return;
                  }

                  if (selected.size === 0) {
                    triggerToast("Please select at least one search product.", true);
                    return;
                  }

                  setIsSubmittingOrder(true);

                  const { grossAmount, deductions, netAmount } = calculateOrderAmounts(selected, rushOrder);
                  const fullName = `${firstName} ${middleNameDisabled ? "" : middleName + " "}${lastName}`.trim();
                  const searchId = "" + Math.floor(8000000 + Math.random() * 1000000);
                  const reportId = "RP-" + Math.floor(20000 + Math.random() * 10000);

                  const productNames = Array.from(selected).map((id) => {
                    const knownNames: Record<string, string> = {
                      "personal-details": "Personal Details",
                      "ssn-check": "SSN Check",
                      "id-verification-aadhar": "ID Verification (Aadhar)",
                      "id-verification-pan": "ID Verification (PAN)",
                      "id-verification-dl": "ID Verification (DL)",
                      "id-verification-voterid": "ID Verification (Voter ID)",
                      "id-verification-passport": "ID Verification (Passport)",
                      "uan-verification": "UAN Verification",
                      "indian-database-check": "Indian Database Check",
                      "global-database-check": "Global Database Check",
                      "ofac-check": "OFAC Check",
                      "criminal-record-check": "Criminal Record Check",
                      "police-verification-check": "Police Verification Check",
                      "nationwide-criminal-check": "Nationwide Criminal Check",
                      "national-sex-offender-registry-check": "National Sex Offender Registry Check",
                      "credit-check": "Credit Check",
                      "26as-check": "26AS Check",
                      "form-16-check": "Form 16 Check",
                      "itr-check": "ITR Check",
                      "employment-verification": "Employment Verification",
                      "education-verification": "Education Verification",
                      "reference-check": "Reference Check",
                      "freelancing-check": "Freelancing Check",
                      "directorship-check": "Directorship Check",
                      "cv-check": "Cv Check",
                      "gap-analysis": "Gap Analysis",
                      "address-verification": "Address Verification",
                      "supplier-address": "Supplier Address",
                      "drug-test": "Drug test",
                      "medical-examination-test": "Medical Examination Test",
                      "social-media-check": "Social Media Check",
                      "right-to-work": "Right to Work",
                      "emergency": "Emergency",
                      "authorization": "Authorization",
                      "exit": "Exit",
                    };
                    return knownNames[id] || id;
                  });

                  const verificationType = productNames.join(", ") || "Background Check";

                  const newOrder = {
                    searchId,
                    reportId,
                    firstName,
                    lastName,
                    applicantName: fullName,
                    verificationType,
                    status: "PENDING" as const,
                    orderedBy: currentUser.firstName && currentUser.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
                      : currentUser.username,
                    orderDate: new Date().toISOString().substring(0, 10),
                    county: "Cook",
                    state: jobState !== "Select State" ? jobState : "IL",
                    adhr: adhr ? adhr.replace(/.(?=.{4})/g, "*") : "********XXXX",
                    dob: dob || "N/A",
                    applicantEmail: applicantEmail,
                    criminalRecordsFound: "None",
                    reference: reference || "",
                  };

                  try {
                    const razorpayReady = await loadRazorpayScript();
                    if (!razorpayReady || !window.Razorpay) {
                      throw new Error("Unable to load Razorpay checkout. Please try again.");
                    }

                    const paymentRes = await fetch("http://localhost:5000/api/payments/create-order", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "x-user-id": currentUser.id,
                      },
                      body: JSON.stringify({
                        grossAmount,
                        deductions,
                        currency: "INR",
                        createdBy: currentUser.id,
                        notes: {
                          applicant: fullName,
                          services: productNames.join(", "),
                        },
                      }),
                    });

                    const paymentData = await paymentRes.json();
                    if (!paymentRes.ok || !paymentData.success) {
                      throw new Error(paymentData.error || "Failed to create payment order.");
                    }

                    setIsSubmittingOrder(false);
                    setShowSubmitModal(false);

                    const rzp = new window.Razorpay({
                      key: paymentData.keyId,
                      amount: paymentData.amount,
                      currency: paymentData.currency || "INR",
                      name: "EvalRight",
                      description: `Background check order for ${fullName}`,
                      image: `${window.location.origin}/evalright-logo.jpg`,
                      order_id: paymentData.razorpayOrderId,
                      prefill: {
                        name:
                          currentUser.firstName && currentUser.lastName
                            ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
                            : currentUser.username,
                        email: currentUser.email || "",
                        contact: (currentUser.phone || "7075809540").replace(/\D/g, "").slice(-10),
                      },
                      theme: { color: "#C70039" },
                      handler: async (razorpayResponse: any) => {
                        setIsSubmittingOrder(true);
                        try {
                          const response = await fetch("http://localhost:5000/api/orders", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "x-user-id": currentUser.id,
                            },
                            body: JSON.stringify({
                              applicantDetails: {
                                firstName,
                                middleName: middleNameDisabled ? undefined : middleName,
                                lastName,
                                email: applicantEmail,
                                dob,
                                adhr,
                                street1: streetAddress,
                                zipCode,
                                state: jobState !== "Select State" ? jobState : "IL",
                              },
                              branchId: currentUser.branch_id,
                              serviceIds: Array.from(selected),
                              priority: rushOrder ? "rush" : "standard",
                              notes: reference || "",
                              idempotencyKey: "idem-" + searchId,
                            }),
                          });

                          const data = await response.json();
                          if (!response.ok || !data.success) {
                            throw new Error(data.error || "Payment succeeded but order save failed.");
                          }

                          const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "x-user-id": currentUser.id,
                            },
                            body: JSON.stringify({
                              razorpay_order_id: razorpayResponse.razorpay_order_id,
                              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                              razorpay_signature: razorpayResponse.razorpay_signature,
                              orderId: data.orderId,
                              transactionId: paymentData.transactionId,
                              grossAmount,
                              deductions,
                              netAmount,
                              createdBy: currentUser.id,
                            }),
                          });

                          const verifyData = await verifyRes.json();
                          if (!verifyRes.ok || !verifyData.success) {
                            throw new Error(verifyData.error || "Payment verification failed.");
                          }

                          const existingOrdersStr = localStorage.getItem("evalright_orders");
                          let existingOrders = [];
                          if (existingOrdersStr) {
                            try {
                              existingOrders = JSON.parse(existingOrdersStr);
                            } catch (e) {}
                          } else {
                            existingOrders = [...ORDERS];
                          }
                          localStorage.setItem("evalright_orders", JSON.stringify([newOrder, ...existingOrders]));

                          const inviteUrl =
                            data.inviteUrl || `http://localhost:5173/#invite-form?id=${data.inviteToken}`;
                          const linkHtml = `<div style="text-align: center; margin: 30px 0;">
                            <a href="${inviteUrl}" style="background-color: rgb(199, 0, 57); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Start Background Check Form</a>
                          </div>`;

                          const mailSubject = `Background Check Process Initiated - ${fullName}`;
                          const mailBody = `
                            <p>Hello ${firstName},</p>
                            <p style="margin-top: 16px;">We wanted to inform you that a background check order has been submitted for you by EvalRight Client Corp.</p>
                            <p style="margin-top: 16px;"><b>Verification Services:</b> ${verificationType}</p>
                            <p style="margin-top: 16px;"><b>Payment ID:</b> ${razorpayResponse.razorpay_payment_id}</p>
                            <p style="margin-top: 16px;"><b>Order Date:</b> ${new Date().toLocaleDateString()}</p>
                            <p style="margin-top: 16px;"><b>Please click the button below to view details:</b></p>
                            ${linkHtml}
                          `;
                          const newEmail = {
                            id: Math.floor(4000000 + Math.random() * 1000000),
                            subject: mailSubject,
                            recipient: applicantEmail,
                            dateSent: new Date().toISOString().replace("T", " ").substring(0, 19),
                            lastUpdate: "N/A",
                            displayDateSent:
                              new Date().toLocaleDateString() +
                              " " +
                              new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            body: mailBody,
                          };
                          const existingEmailsStr = localStorage.getItem("evalright_emails");
                          let existingEmails = [];
                          if (existingEmailsStr) {
                            try {
                              existingEmails = JSON.parse(existingEmailsStr);
                            } catch (e) {}
                          }
                          localStorage.setItem("evalright_emails", JSON.stringify([newEmail, ...existingEmails]));

                          triggerToast("Payment successful. Order created.");
                          setStep(4);
                        } catch (err: any) {
                          console.error("Error after payment:", err);
                          triggerToast(err.message || "Payment received but order finalization failed.", true);
                        } finally {
                          setIsSubmittingOrder(false);
                        }
                      },
                    });

                    rzp.on("payment.failed", (response: any) => {
                      console.error("Razorpay payment failed:", response);
                      triggerToast(
                        response?.error?.description ||
                          "Payment failed. Try Netbanking and click Success on the mock bank page.",
                        true
                      );
                      setIsSubmittingOrder(false);
                    });

                    rzp.open();
                  } catch (err: any) {
                    console.error("Error starting payment:", err);
                    triggerToast(err.message || "Failed to start payment. Please try again.", true);
                    setIsSubmittingOrder(false);
                  }
                }}
                style={{
                  height: "40px",
                  padding: "0 32px",
                  background: isSubmittingOrder ? "#9CA3AF" : "#C70039",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: isSubmittingOrder ? "not-allowed" : "pointer",
                }}
              >
                {isSubmittingOrder ? "Processing..." : "Pay Now"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: isToastError ? "#EF4444" : "#10B981",
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
        >
          {toastMessage}
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

interface CalendarDay {
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
}

function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const grid: CalendarDay[] = [];
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInCurrent = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrev - i;
    const dateStr = `${(prevMonth + 1).toString().padStart(2, '0')}/${dayNum.toString().padStart(2, '0')}/${prevYear}`;
    grid.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false
    });
  }
  
  for (let i = 1; i <= daysInCurrent; i++) {
    const dateStr = `${(month + 1).toString().padStart(2, '0')}/${i.toString().padStart(2, '0')}/${year}`;
    grid.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false
    });
  }
  
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 42 - grid.length;
  for (let i = 1; i <= remaining; i++) {
    const dateStr = `${(nextMonth + 1).toString().padStart(2, '0')}/${i.toString().padStart(2, '0')}/${nextYear}`;
    grid.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true
    });
  }
  
  return grid;
}

interface FloatingDatePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

function FloatingDatePicker({ label, value, onChange, required = false }: FloatingDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth();

  const [viewMonth, setViewMonth] = useState(defaultMonth);
  const [viewYear, setViewYear] = useState(defaultYear);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = () => {
    if (value) {
      const parts = value.split("/");
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const d = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
          setViewMonth(m);
          setViewYear(y);
        }
      }
    }
    setIsOpen(true);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearsRange: number[] = [];
  for (let y = 2026; y >= 1930; y--) {
    yearsRange.push(y);
  }

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleDayClick(dateStr: string) {
    onChange(dateStr);
    setIsOpen(false);
  }

  const calendarDays = getCalendarGrid(viewYear, viewMonth);
  const isActive = isOpen || value !== "";

  const currentDayNum = today.getDate();
  const currentMonthNum = today.getMonth();
  const currentYearNum = today.getFullYear();
  const todayStr = `${(currentMonthNum + 1).toString().padStart(2, '0')}/${currentDayNum.toString().padStart(2, '0')}/${currentYearNum}`;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={handleOpen}
        style={{
          position: "relative",
          height: "56px",
          background: "#FFFFFF",
          border: `1px solid ${isOpen ? "#B7042C" : "#D1D5DB"}`,
          borderRadius: "4px",
          width: "100%",
          transition: "border-color 0.15s ease",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: isActive ? "8px" : "50%",
            transform: isActive ? "none" : "translateY(-50%)",
            fontSize: isActive ? "11px" : "14px",
            color: "#888888",
            transition: "all 0.15s ease",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {label}
          {required && <span style={{ color: "#C70039", marginLeft: "2px" }}>*</span>}
        </span>
        <input
          type="text"
          value={value}
          readOnly
          placeholder={isOpen ? "MM/DD/YYYY" : ""}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            padding: isActive ? "22px 12px 6px 12px" : "0 12px",
            fontSize: "14px",
            color: "#374151",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: "0",
            width: "320px",
            background: "#FFFFFF",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            boxSizing: "border-box",
            paddingBottom: "8px",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#C70039",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderTopLeftRadius: "3px",
              borderTopRightRadius: "3px",
            }}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }}
              style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "16px" }}>
              {/* Month Selector */}
              <div style={{ display: "flex", alignItems: "center", position: "relative", cursor: "pointer" }}>
                <select
                  value={viewMonth}
                  onChange={(e) => { e.stopPropagation(); setViewMonth(Number(e.target.value)); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    outline: "none",
                    appearance: "none",
                    paddingRight: "16px",
                  }}
                >
                  {monthNames.map((m, idx) => (
                    <option key={m} value={idx} style={{ color: "#333" }}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={12} style={{ position: "absolute", right: 0, pointerEvents: "none", color: "#FFFFFF" }} />
              </div>

              {/* Year Selector */}
              <div style={{ display: "flex", alignItems: "center", position: "relative", cursor: "pointer" }}>
                <select
                  value={viewYear}
                  onChange={(e) => { e.stopPropagation(); setViewYear(Number(e.target.value)); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    outline: "none",
                    appearance: "none",
                    paddingRight: "16px",
                  }}
                >
                  {yearsRange.map((y) => (
                    <option key={y} value={y} style={{ color: "#333" }}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={12} style={{ position: "absolute", right: 0, pointerEvents: "none", color: "#FFFFFF" }} />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNextMonth(); }}
              style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              padding: "8px 8px 4px 8px",
              fontWeight: 600,
              fontSize: "13px",
              color: "#4B5563",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ padding: "4px 0" }}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              padding: "0 8px",
              rowGap: "2px",
            }}
          >
            {calendarDays.map((day) => {
              const { dateStr, dayNum, isCurrentMonth } = day;
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;

              let dayBg = "transparent";
              let dayColor = "#374151";
              let dayWeight = "normal";
              let dayBorder = "none";

              if (isSelected) {
                dayBg = "#C70039";
                dayColor = "#FFFFFF";
                dayWeight = "bold";
              } else if (isToday) {
                dayBorder = "1px solid #C70039";
                dayColor = "#374151";
              } else if (!isCurrentMonth) {
                dayColor = "#D1D5DB";
              }

              return (
                <div
                  key={dateStr}
                  onClick={(e) => { e.stopPropagation(); handleDayClick(dateStr); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "36px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: dayBg,
                      color: dayColor,
                      fontWeight: dayWeight as any,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: dayBorder,
                      boxSizing: "border-box",
                    }}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Floating Input Component
interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}

function FloatingInput({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  type = "text",
  placeholder = "",
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value !== "";

  return (
    <div
      style={{
        position: "relative",
        height: "56px",
        background: disabled ? "#F3F4F6" : "#FFFFFF",
        border: `1px solid ${focused ? "#B7042C" : "#D1D5DB"}`,
        borderRadius: "4px",
        width: "100%",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "12px",
          top: isActive ? "8px" : "50%",
          transform: isActive ? "none" : "translateY(-50%)",
          fontSize: isActive ? "11px" : "14px",
          color: "#888888",
          transition: "all 0.15s ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {label}
        {required && <span style={{ color: "#C70039", marginLeft: "2px" }}>*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={focused ? placeholder : ""}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          padding: isActive ? "22px 12px 6px 12px" : "0 12px",
          fontSize: "14px",
          color: "#374151",
          boxSizing: "border-box",
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </div>
  );
}

// Custom Floating Select Dropdown Component
interface FloatingSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
}

function FloatingSelect({ label, value, options, onChange, required = false }: FloatingSelectProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value !== "";

  return (
    <div
      style={{
        position: "relative",
        height: "56px",
        background: "#FFFFFF",
        border: `1px solid ${focused ? "#B7042C" : "#D1D5DB"}`,
        borderRadius: "4px",
        width: "100%",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "12px",
          top: isActive ? "8px" : "50%",
          transform: isActive ? "none" : "translateY(-50%)",
          fontSize: isActive ? "11px" : "14px",
          color: "#888888",
          transition: "all 0.15s ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {label}
        {required && <span style={{ color: "#C70039", marginLeft: "2px" }}>*</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          padding: isActive ? "22px 12px 6px 12px" : "0 12px",
          fontSize: "14px",
          color: "#374151",
          boxSizing: "border-box",
          cursor: "pointer",
          appearance: "none",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* Dropdown Arrow */}
      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid #888888",
        }}
      />
    </div>
  );
}
