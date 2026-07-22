import { useState, useEffect, useMemo } from "react";
import { Mail, Plus, ArrowRight, Eye } from "lucide-react";
import { Footer } from "../components/Footer";
<<<<<<< HEAD
import { ORDERS, ALA_CARTE_SEARCHES } from "../data/mockData";
=======
import { ORDERS } from "../data/mockData";
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

// ── Static data ──────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    id: "completed",
    title: "COMPLETED ORDERS",
    count: 0,
    bg: "#4CA815",
    badge: "0.00%",
    badgeText: "Since last month",
  },
  {
    id: "pending",
    title: "PENDING ORDERS",
    count: 0,
    bg: "#DF2A57",
    link: "View Pending Orders",
  },
  {
    id: "draft",
    title: "DRAFT ORDERS",
    count: 0,
    bg: "#5A9CEF",
    link: "View Draft Orders",
  },
  {
    id: "invitation",
    title: "ACTIVE INVITATION ORDERS",
    count: 0,
    bg: "#8758D1",
    link: "View Active Invitation Orders",
  },
] as const;

const DUE_INVOICES = [
  { id: "239245", invoiceDate: "2026-02-01", dueDate: "2026-02-01", total: "$0.00" },
  { id: "227982", invoiceDate: "2025-10-01", dueDate: "2025-10-01", total: "$0.00" },
  { id: "222388", invoiceDate: "2025-08-01", dueDate: "2025-08-01", total: "$0.00" },
  { id: "219582", invoiceDate: "2025-07-01", dueDate: "2025-07-01", total: "$0.00" },
];

const PACKAGES = ["Basic Screening", "Demo3", "New", "DEMO_3", "Evalright_BGV", "Standard", "DEMO-2", "nationwide + federal"];

// ── Styles ────────────────────────────────────────────────────────────────────

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  color: "#4B5563",
  marginBottom: "6px",
};

const fieldInput: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 16px",
  fontSize: "14px",
  color: "#333333",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const fieldSelect: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 16px",
  fontSize: "14px",
  color: "#4B5563",
  outline: "none",
  background: "#fff",
  cursor: "pointer",
  boxSizing: "border-box",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

// ── Floating Field Component ───────────────────────────────────────────────────

function FloatingField({ label, required, value, onChange, type = "text", isSelect, options, placeholder, isDarkMode }: any) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value || isSelect;

  return (
    <div
      style={{
        position: "relative",
        border: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
        height: "54px",
        boxSizing: "border-box",
        background: isDarkMode ? "transparent" : "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 14px",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "14px",
          top: isFloating ? "10px" : "18px",
          fontSize: isFloating ? "11px" : "14px",
          color: "#9CA3AF",
          transition: "all 0.2s ease",
          pointerEvents: "none",
          display: "flex",
          gap: "4px",
        }}
      >
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </div>

      {isSelect ? (
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none",
            outline: "none",
            background: isDarkMode ? "#1A1C21" : "transparent",
            fontSize: "14px",
            color: isDarkMode ? "#E5E7EB" : "#4B5563",
            padding: 0,
            marginTop: "16px",
            appearance: "none",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options?.map((o: any) => (
            <option key={o.value || o} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "14px",
            color: isDarkMode ? "#E5E7EB" : "#333333",
            padding: 0,
            marginTop: isFloating ? "16px" : "0px",
            width: "100%",
            opacity: isFloating ? 1 : 0,
          }}
        />
      )}

      {isSelect && (
        <div style={{ position: "absolute", right: "14px", top: "18px", pointerEvents: "none" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface HomePageProps {
  isDarkMode?: boolean;
  onNavigate?: (page: any) => void;
  currentUser?: any;
}

export function HomePage({ isDarkMode = false, onNavigate, currentUser }: HomePageProps) {
  const [pkg, setPkg] = useState("");
  const [template, setTemplate] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastError, setIsToastError] = useState(false);

  function triggerToast(msg: string, isError = false) {
    setToastMessage(msg);
    setIsToastError(isError);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [reference, setReference] = useState("");

  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
  const [counts, setCounts] = useState({
    completed: 0,
    pending: 0,
    draft: 0,
    invitation: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem("evalright_templates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableTemplates(parsed.map((p: any) => p.name));
          return;
        }
      } catch (e) {}
    }
    setAvailableTemplates(["Standard Invitation Template"]);
  }, []);

  useEffect(() => {
    const ordersStr = localStorage.getItem("evalright_orders");
    let completed = 0;
    let pending = 0;
    if (ordersStr) {
      try {
        const orders = JSON.parse(ordersStr);
        completed = orders.filter((o: any) => o.status === "CLOSED").length;
        pending = orders.filter((o: any) => o.status === "PENDING" || o.status === "IN PROGRESS").length;
      } catch (e) {}
    } else {
      completed = 15;
      pending = 8;
    }

    const invitesStr = localStorage.getItem("evalright_invitations");
    let invitationCount = 0;
    if (invitesStr) {
      try {
        const invites = JSON.parse(invitesStr);
        invitationCount = invites.filter((i: any) => i.status === "Active").length;
      } catch (e) {}
    } else {
      invitationCount = 1;
    }

    setCounts({
      completed,
      pending,
      draft: 3,
      invitation: invitationCount
    });
  }, [updateTrigger]);

  const dynamicStatCards = useMemo(() => [
    {
      id: "completed",
      title: "COMPLETED ORDERS",
      count: counts.completed,
      bg: "#4CA815",
      badge: "4.82%",
      badgeText: "Since last month",
    },
    {
      id: "pending",
      title: "PENDING ORDERS",
      count: counts.pending,
      bg: "#DF2A57",
      link: "View Pending Orders",
    },
    {
      id: "draft",
      title: "DRAFT ORDERS",
      count: counts.draft,
      bg: "#5A9CEF",
      link: "View Draft Orders",
    },
    {
      id: "invitation",
      title: "ACTIVE INVITATION ORDERS",
      count: counts.invitation,
      bg: "#8758D1",
      link: "View Active Invitation Orders",
    },
  ], [counts]);

  const handleSendInvitation = async () => {
<<<<<<< HEAD
    if (!pkg || !firstName.trim() || !lastName.trim() || !emailAddr.trim()) {
=======
    if (!pkg || !template || !firstName.trim() || !lastName.trim() || !emailAddr.trim()) {
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
      triggerToast("Please fill in all required fields (marked with *).", true);
      return;
    }

    let selectedProducts: string[] = [];
    if (pkg === "Basic Screening") {
<<<<<<< HEAD
      selectedProducts = ["id-verification-aadhar", "criminal-record-check"];
    } else if (pkg === "Standard") {
      selectedProducts = ["id-verification-aadhar", "criminal-record-check", "global-database-check", "id-verification-dl"];
    } else if (pkg.toLowerCase().includes("federal")) {
      selectedProducts = ["id-verification-aadhar", "criminal-record-check", "nationwide-criminal-check"];
    } else {
      selectedProducts = ["id-verification-aadhar", "criminal-record-check", "global-database-check"];
=======
      selectedProducts = ["adhr-trace", "county-criminal"];
    } else if (pkg === "Standard") {
      selectedProducts = ["adhr-trace", "county-criminal", "global-watchlist", "driving-history"];
    } else if (pkg.toLowerCase().includes("federal")) {
      selectedProducts = ["adhr-trace", "county-criminal", "federal-criminal"];
    } else {
      selectedProducts = ["adhr-trace", "county-criminal", "global-watchlist"];
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    }

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
        const matched = templates.find((t: any) => t.name === template);
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
<<<<<<< HEAD
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
=======
        <p>Hello [applicant_first_name],</p>
        <p style="margin-top: 16px;">Below you will find a link to authorize and initiate a background check, which is required as a condition of employment.</p>
        <p style="margin-top: 16px;">Please save this email and keep it handy as it contains instructions for entering information to process the background check.</p>
        <p style="margin-top: 16px;">
          <b>First, please click this link to read and print the <span style="color: rgb(199, 0, 57);">Fair Credit Reporting Act Summary of Rights</span>.</b>
        </p>
        <p style="margin-top: 24px;">
          [INVITATION_URL]
        </p>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
      `;
    }

    const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();
<<<<<<< HEAD
    const searchMap = new Map((ALA_CARTE_SEARCHES || []).map((item: any) => [item.id, item]));
    const checksList = (selectedProducts || [])
      .map((id: string) => {
        const item = searchMap.get(id);
        return item ? `<li>${item.name}</li>` : `<li>${id}</li>`;
      })
      .join('');

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    let formattedBody = templateContent
      .replaceAll("[applicant_first_name]", firstName)
      .replaceAll("[applicant_last_name]", lastName)
      .replaceAll("[applicant_name]", fullName)
      .replaceAll("[company_name]", "EvalRight Client Corp")
      .replaceAll("[FCRA_URL]", "https://www.evalright.com/fcra")
<<<<<<< HEAD
      .replaceAll("[company_info]", "EvalRight Client Corp, 100 Main St, Chicago, IL")
      .replaceAll("[CHECKS_TO_BE_COMPLETED]", checksList);
=======
      .replaceAll("[company_info]", "EvalRight Client Corp, 100 Main St, Chicago, IL");
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

    try {
      const response = await fetch("http://localhost:5000/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser?.id || "fallback-id"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailAddr,
          branchId: currentUser?.branch_id || null,
          selectedProducts: selectedProducts,
          orderedBy: currentUser?.id || "fallback-id",
          emailTemplateName: templateName,
<<<<<<< HEAD
          emailSubject: templateSubject || "Background Verification Process – Action Required",
=======
          emailSubject: templateSubject || `Background Check Invitation - ${fullName}`,
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
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
<<<<<<< HEAD
        subject: templateSubject || "Background Verification Process – Action Required",
=======
        subject: templateSubject || `Background Check Invitation - ${fullName}`,
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
        recipient: emailAddr,
        dateSent: new Date().toISOString().replace('T', ' ').substring(0, 19),
        displayDateSent: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastUpdate: "N/A",
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
        email: emailAddr,
        dateCreated: new Date().toISOString().substring(0, 10),
        status: "Active",
        emailActivity: "Sent",
        selectedProducts,
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

      const productNames = selectedProducts.map((id: string) => {
        const knownNames: Record<string, string> = {
<<<<<<< HEAD
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
=======
          cdlis: "CDLIS",
          "county-criminal": "County Criminal Search",
          "driving-history": "Driving History",
          "education-verification": "Education Verification",
          "employment-verification": "Employment Verification",
          "labcorp-10-panel": "LabCorp - 10 Panel",
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
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
        orderedBy: currentUser?.firstName && currentUser?.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
          : (currentUser?.username || "Admin User"),
        orderDate: new Date().toISOString().substring(0, 10),
        county: "Pending",
        state: "Pending",
        adhr: "Pending",
        dob: "Pending",
        applicantEmail: emailAddr,
        criminalRecordsFound: "Pending",
        reference: reference || "",
        inviteId: inviteId,
      };
      localStorage.setItem("evalright_orders", JSON.stringify([pendingOrder, ...existingOrders]));

      triggerToast(`Invitation sent successfully to ${fullName}!`);
      
      setPkg("");
      setTemplate("");
      setFirstName("");
      setLastName("");
      setMiddleName("");
      setEmailAddr("");
      setReference("");
      setUpdateTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "An error occurred while sending invitation", true);
    }
  };

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
          padding: "16px 20px",
          background: "transparent",
          overflowY: "auto",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "14px",

          }}
        >
          Client Home
        </h1>

        {/* ── Stat cards – 2×2 grid ──────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {dynamicStatCards.map((card) => (
            <div
              key={card.id}
              style={{
                background: card.bg,
                borderRadius: "8px",
                padding: "20px 24px",
                color: "#fff",
                minHeight: "130px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Title row */}
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    opacity: 0.95,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </span>
              </div>

              {/* Count */}
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginTop: "10px",
                }}
              >
                {card.count}
              </div>

              {/* Footer row */}
              <div style={{ marginTop: "10px", fontSize: "12px" }}>
                {"badge" in card ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.28)",
                        borderRadius: "3px",
                        padding: "2px 7px",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      ↑ {card.badge}
                    </span>
                    <span style={{ opacity: 0.9, fontSize: "13px" }}>{card.badgeText}</span>
                  </span>
                ) : (
                  <a
                    href="#"
                    style={{
                      color: "#fff",
                      opacity: 0.92,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        if (card.id === "pending") {
                          onNavigate("reports-all-order-details");
                        } else if (card.id === "draft") {
                          onNavigate("reports-draft-orders");
                        } else if (card.id === "invitation") {
                          onNavigate("applicants");
                        }
                      }
                    }}
                  >
                    {card.link} <ArrowRight size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Two-column body ────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            alignItems: "start",
          }}
        >
          {/* ─ Rapid Invitation form ─────────────────────────────────── */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#fff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: isDarkMode ? "#F9FAFB" : "#4B5563",
                marginBottom: "16px",
              }}
            >
              Rapid Invitation
            </h2>
            <div style={{ margin: "0 -24px 24px -24px", borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <FloatingField
                label="Package"
                required
                isSelect
                value={pkg}
                onChange={(e: any) => setPkg(e.target.value)}
                placeholder="Please Select a package"
                options={PACKAGES}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Invitation Template"
<<<<<<< HEAD
=======
                required
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
                isSelect
                value={template}
                onChange={(e: any) => setTemplate(e.target.value)}
                placeholder="Select Template"
                options={availableTemplates}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="First Name"
                required
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Last Name"
                required
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Middle Name"
                value={middleName}
                onChange={(e: any) => setMiddleName(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Email Address"
                required
                type="email"
                value={emailAddr}
                onChange={(e: any) => setEmailAddr(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <FloatingField
                label="Reference"
                value={reference}
                onChange={(e: any) => setReference(e.target.value)}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Send Invitation button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <button
                onClick={handleSendInvitation}
                style={{
                  background: "#C70039",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Send Invitation <Mail size={16} />
              </button>
            </div>
          </div>

          {/* ─ Due Invoices ──────────────────────────────────────────── */}
          <div
            style={{
              background: isDarkMode ? "#252830" : "#fff",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isDarkMode ? "#F9FAFB" : "#333333",

                }}
              >
                Due Invoices (4)
              </h2>
              <button
                style={{
                  background: "#C70039",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",

                }}
              >
                <Plus size={11} /> View All Invoices
              </button>
            </div>

            {/* Table */}
            <div style={{ margin: "0 -16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: isDarkMode ? "#1A1C21" : "#F9FAFB",
                      borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                      borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    }}
                  >
                    {["Invoice #", "Invoice Date", "Due Date", "Total", "Status"].map(
                      (col) => (
                        <th
                          key={col}
                          style={{
                            textAlign: "left",
                            padding: "12px 16px",
                            fontSize: "13px",
                            color: isDarkMode ? "#9CA3AF" : "#4B5563",
                            fontWeight: 600,
                          }}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {DUE_INVOICES.map((inv) => (
                    <tr
                      key={inv.id}
                      style={{ borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB" }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#C70039",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Eye size={14} color="#C70039" />
                          {inv.id}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      >
                        {inv.invoiceDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      >
                        {inv.dueDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      >
                        {inv.total}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: isDarkMode ? "rgba(199, 0, 57, 0.2)" : "#FEE2E2",
                            color: "#C70039",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: "4px",
                            letterSpacing: "0.02em",
                          }}
                        >
                          UNPAID
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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
