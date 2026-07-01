import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Shield, FileText, Landmark, User, Award, Briefcase, Car } from "lucide-react";
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

interface InviteFormProps {
  isDarkMode?: boolean;
  onNavigate?: (page: any) => void;
}

export function InviteForm({ isDarkMode = false, onNavigate }: InviteFormProps) {
  const t = getPageTheme(isDarkMode);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    ssn: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    // Driving
    licenseNumber: "",
    licenseState: "",
    // Drug Test
    clinicZip: "",
    drugConsent: false,
    // Education
    schoolName: "",
    degree: "",
    major: "",
    gradDate: "",
    // Employment
    employerName: "",
    jobTitle: "",
    empStart: "",
    empEnd: "",
    supervisorPhone: "",
    // Signature
    fcraConsent: false,
    signatureName: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("evalright_active_invite_id");
    setInviteId(id);

    if (id) {
      const saved = localStorage.getItem("evalright_invitations");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const matched = parsed.find((p: any) => p.inviteId === id);
          if (matched) {
            setInviteData(matched);
            // Pre-populate name & email
            const nameParts = matched.name.split(" ");
            setFormData((prev) => ({
              ...prev,
              firstName: nameParts[0] || "",
              middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
              lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
              email: matched.email || "",
            }));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Required Common Fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.dob.trim() || !formData.ssn.trim() || !formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim()) {
      setErrorMsg("Please complete all general personal information fields.");
      return;
    }

    // Validate SSN and DOB simple format
    if (formData.ssn.replace(/\D/g, "").length < 9) {
      setErrorMsg("Please enter a valid 9-digit Social Security Number.");
      return;
    }

    // Validate Dynamic Fields based on invitation selection
    const products = inviteData?.selectedProducts || [];
    
    // Check Driving History products
    if (products.some((p: string) => p.includes("driving") || p.includes("cdlis"))) {
      if (!formData.licenseNumber.trim() || !formData.licenseState.trim()) {
        setErrorMsg("Please provide your Driver's License Number and Issuing State.");
        return;
      }
    }

    // Check Drug Test products
    if (products.some((p: string) => p.includes("panel") || p.includes("drug"))) {
      if (!formData.clinicZip.trim()) {
        setErrorMsg("Please specify a Clinic Zip Code for your drug testing appointment.");
        return;
      }
      if (!formData.drugConsent) {
        setErrorMsg("Please consent to the drug screening authorization.");
        return;
      }
    }

    // Check Education Verification products
    if (products.some((p: string) => p.includes("education"))) {
      if (!formData.schoolName.trim() || !formData.degree.trim() || !formData.gradDate.trim()) {
        setErrorMsg("Please complete all Education History fields.");
        return;
      }
    }

    // Check Employment Verification products
    if (products.some((p: string) => p.includes("employment"))) {
      if (!formData.employerName.trim() || !formData.jobTitle.trim() || !formData.empStart.trim()) {
        setErrorMsg("Please complete all Employment History fields.");
        return;
      }
    }

    // Validate FCRA E-Signature
    if (!formData.fcraConsent) {
      setErrorMsg("You must check the authorization box to consent to the background screening.");
      return;
    }

    const expectedSignName = `${formData.firstName} ${formData.lastName}`.toLowerCase().trim();
    const enteredSignName = formData.signatureName.toLowerCase().trim();
    if (!enteredSignName || expectedSignName !== enteredSignName) {
      setErrorMsg(`Please sign the form by typing your full legal name: "${formData.firstName} ${formData.lastName}"`);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      // 1. Update Invitation Status in localStorage
      const savedInvitesStr = localStorage.getItem("evalright_invitations");
      if (savedInvitesStr) {
        try {
          const invites = JSON.parse(savedInvitesStr);
          const idx = invites.findIndex((i: any) => i.inviteId === inviteId);
          if (idx !== -1) {
            invites[idx].status = "Complete";
            invites[idx].emailActivity = "Replied";
            localStorage.setItem("evalright_invitations", JSON.stringify(invites));
          }
        } catch (e) {}
      }

      // 2. Create the final order in localStorage evalright_orders
      const savedOrdersStr = localStorage.getItem("evalright_orders");
      let existingOrders = [];
      if (savedOrdersStr) {
        try {
          existingOrders = JSON.parse(savedOrdersStr);
        } catch (e) {}
      }

      // Map selected products to friendly verification type string
      const productNames = products.map((id: string) => {
        const known: Record<string, string> = {
          cdlis: "CDLIS",
          "county-criminal": "County Criminal Search",
          "driving-history": "Driving History",
          "education-verification": "Education Verification",
          "employment-verification": "Employment Verification",
          "labcorp-10-panel": "LabCorp - 10 Panel Drug Screen",
        };
        return known[id] || id;
      });
      const verificationType = productNames.join(", ") || "Background Check";

      const newOrder = {
        searchId: "" + Math.floor(8000000 + Math.random() * 1000000),
        reportId: "RP-" + Math.floor(20000 + Math.random() * 10000),
        firstName: formData.firstName,
        lastName: formData.lastName,
        applicantName: `${formData.firstName} ${formData.lastName}`,
        verificationType,
        status: "IN PROGRESS" as const,
        orderedBy: "Applicant (Online Portal)",
        orderDate: new Date().toISOString().substring(0, 10),
        county: formData.city,
        state: formData.state,
        ssn: formData.ssn.replace(/.(?=.{4})/g, '*'),
        dob: formData.dob,
        applicantEmail: formData.email,
        criminalRecordsFound: "Pending Court Records",
        details: formData,
      };

      localStorage.setItem("evalright_orders", JSON.stringify([newOrder, ...existingOrders]));

      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6" }}>
        <div style={{ color: "rgb(199, 0, 57)", fontSize: "16px", fontWeight: "bold" }}>Loading Background Form...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "560px", width: "100%" }}>
            <CheckCircle size={64} color="#10B981" style={{ margin: "0 auto 20px auto" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2937", marginBottom: "12px" }}>Submission Successful</h2>
            <p style={{ fontSize: "15px", color: "#4B5563", lineHeight: 1.6, marginBottom: "30px" }}>
              Thank you! Your background screening details have been successfully saved and authorized. The employer has been notified, and our verification team will start compiling your background check report.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate("home");
              }}
              style={{
                background: "rgb(199, 0, 57)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "12px 32px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(199,0,57,0.2)",
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "500px" }}>
            <Shield size={48} color="#EF4444" style={{ margin: "0 auto 20px auto" }} />
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1F2937", marginBottom: "10px" }}>Invalid Invitation</h2>
            <p style={{ fontSize: "14px", color: "#4B5563", marginBottom: "24px" }}>
              We could not locate an active background check invitation with this link. It may have expired or been completed already.
            </p>
            <button onClick={() => onNavigate && onNavigate("home")} style={{ background: "#374151", color: "#FFFFFF", border: "none", borderRadius: "4px", padding: "10px 20px", fontSize: "13px", cursor: "pointer" }}>
              Back to Portal
            </button>
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  const products = inviteData.selectedProducts || [];
  const hasDriving = products.some((p: string) => p.includes("driving") || p.includes("cdlis"));
  const hasDrug = products.some((p: string) => p.includes("panel") || p.includes("drug"));
  const hasEducation = products.some((p: string) => p.includes("education"));
  const hasEmployment = products.some((p: string) => p.includes("employment"));

  return (
    <div style={{ minHeight: "100vh", background: isDarkMode ? "#1A1C21" : "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Branding Top bar */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "16px 40px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/evalright-logo.jpg" alt="EvalRight Logo" style={{ height: "36px", width: "auto" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4B5563" }}>
            <Shield size={14} color="#10B981" />
            <span>Secure SSL Encrypted Portal</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, maxWidth: "900px", width: "100%", margin: "32px auto", padding: "0 20px" }}>
        {/* Intro */}
        <div style={{ background: "linear-gradient(135deg, #C70039 0%, #900028 100%)", borderRadius: "8px 8px 0 0", padding: "28px 30px", color: "#FFFFFF" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
            Invitation Code: {inviteData.inviteId}
          </span>
          <h1 style={{ fontSize: "22px", fontWeight: 600, marginTop: "12px", marginBottom: "8px" }}>Background Check Authorization Portal</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: 0 }}>
            Dear {inviteData.name}, please complete the dynamic authorization form below. The fields in this form are customized based on the background check searches ordered by the employer.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", borderRadius: "0 0 8px 8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", padding: "30px" }}>
          
          {errorMsg && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "4px", padding: "12px 16px", color: "#B91C1C", fontSize: "14px", fontWeight: 500, marginBottom: "24px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Section 1: General Personal Info */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(199, 0, 57)", marginBottom: "16px", borderBottom: "2px solid #F3F4F6", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} /> 1. Personal Information
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1.2fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={formLabel}>First Name *</label>
                <input style={formInput} value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Middle Name</label>
                <input style={formInput} value={formData.middleName} onChange={(e) => handleChange("middleName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Last Name *</label>
                <input style={formInput} value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1.2fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={formLabel}>Email Address *</label>
                <input style={formInput} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Date of Birth * (MM/DD/YYYY)</label>
                <input style={formInput} placeholder="e.g. 05/18/1992" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Social Security Number (SSN) *</label>
                <input style={formInput} type="password" placeholder="9 digits, e.g. 123456789" maxLength={9} value={formData.ssn} onChange={(e) => handleChange("ssn", e.target.value.replace(/\D/g, ""))} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label style={formLabel}>Street Address *</label>
                <input style={formInput} value={formData.street} onChange={(e) => handleChange("street", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>City *</label>
                <input style={formInput} value={formData.city} onChange={(e) => handleChange("city", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>State *</label>
                <select style={formSelect} value={formData.state} onChange={(e) => handleChange("state", e.target.value)} required>
                  <option value="">Select</option>
                  {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label style={formLabel}>Zip Code *</label>
                <input style={formInput} maxLength={6} value={formData.zip} onChange={(e) => handleChange("zip", e.target.value.replace(/\D/g, ""))} required />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Requirements based on Order Selections */}
          {(hasDriving || hasDrug || hasEducation || hasEmployment) && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(199, 0, 57)", marginBottom: "16px", borderBottom: "2px solid #F3F4F6", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={16} /> 2. Order Specific Requirements
              </h3>

              {/* Dynamic Sub-section: Driving Record */}
              {hasDriving && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Car size={16} color="rgb(199, 0, 57)" /> Motor Vehicle / Driving History Details
                  </h4>
                  <p style={dynamicDescription}>The employer has ordered a Driving History background check. Please enter your license details.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={formLabel}>Driver's License Number *</label>
                      <input style={formInput} value={formData.licenseNumber} onChange={(e) => handleChange("licenseNumber", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>State of Issuance *</label>
                      <select style={formSelect} value={formData.licenseState} onChange={(e) => handleChange("licenseState", e.target.value)}>
                        <option value="">Select State</option>
                        {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Sub-section: Drug Test */}
              {hasDrug && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Award size={16} color="rgb(199, 0, 57)" /> Drug Screening Authorization
                  </h4>
                  <p style={dynamicDescription}>The employer has requested a Drug Screen test. Please provide a ZIP code so we can schedule you at the closest LabCorp or Quest Diagnostics clinic.</p>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={formLabel}>Preferred Clinic ZIP Code / City *</label>
                    <input style={formInput} placeholder="e.g. 60611" value={formData.clinicZip} onChange={(e) => handleChange("clinicZip", e.target.value)} />
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                    <input 
                      type="checkbox" 
                      checked={formData.drugConsent} 
                      onChange={(e) => handleChange("drugConsent", e.target.checked)}
                      style={{ marginTop: "4px", width: "16px", height: "16px", accentColor: "rgb(199, 0, 57)" }} 
                    />
                    <span style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.4 }}>
                      I hereby authorize EvalRight and its partner drug screening laboratories to collect a specimen for testing, analyze it for controlled substances, and report the findings back to the requesting employer. *
                    </span>
                  </label>
                </div>
              )}

              {/* Dynamic Sub-section: Education Verification */}
              {hasEducation && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Award size={16} color="rgb(199, 0, 57)" /> Education History Verification
                  </h4>
                  <p style={dynamicDescription}>The employer has requested an Education Verification. Please supply information regarding your highest degree earned.</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={formLabel}>School/University Name *</label>
                      <input style={formInput} placeholder="e.g. University of Illinois" value={formData.schoolName} onChange={(e) => handleChange("schoolName", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Degree Earned *</label>
                      <select style={formSelect} value={formData.degree} onChange={(e) => handleChange("degree", e.target.value)}>
                        <option value="">Select Degree</option>
                        <option value="High School">High School Diploma</option>
                        <option value="Associate">Associate's Degree</option>
                        <option value="Bachelor">Bachelor's Degree</option>
                        <option value="Master">Master's Degree</option>
                        <option value="Doctorate">Doctorate / Ph.D.</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={formLabel}>Major / Field of Study</label>
                      <input style={formInput} placeholder="e.g. Computer Science" value={formData.major} onChange={(e) => handleChange("major", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Graduation Date * (MM/YYYY)</label>
                      <input style={formInput} placeholder="e.g. 05/2014" value={formData.gradDate} onChange={(e) => handleChange("gradDate", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Sub-section: Employment Verification */}
              {hasEmployment && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Briefcase size={16} color="rgb(199, 0, 57)" /> Previous Employment History
                  </h4>
                  <p style={dynamicDescription}>The employer has requested an Employment Verification. Please supply information regarding your most recent employer.</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={formLabel}>Employer / Company Name *</label>
                      <input style={formInput} placeholder="e.g. Acme Corporation" value={formData.employerName} onChange={(e) => handleChange("employerName", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Job Title *</label>
                      <input style={formInput} placeholder="e.g. Senior Software Engineer" value={formData.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={formLabel}>Start Date * (MM/YYYY)</label>
                      <input style={formInput} placeholder="e.g. 09/2019" value={formData.empStart} onChange={(e) => handleChange("empStart", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>End Date (MM/YYYY or 'Present')</label>
                      <input style={formInput} placeholder="e.g. Present" value={formData.empEnd} onChange={(e) => handleChange("empEnd", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Supervisor/HR Contact Phone</label>
                      <input style={formInput} placeholder="e.g. 555-0199" value={formData.supervisorPhone} onChange={(e) => handleChange("supervisorPhone", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 3: FCRA Disclosure & Signature */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(199, 0, 57)", marginBottom: "16px", borderBottom: "2px solid #F3F4F6", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} /> 3. FCRA Disclosure & Authorization
            </h3>

            <div style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "16px",
              height: "150px",
              overflowY: "scroll",
              fontSize: "12px",
              color: "#4B5563",
              lineHeight: 1.6,
              marginBottom: "20px"
            }}>
              <p style={{ margin: "0 0 10px 0", fontWeight: 700 }}>DISCLOSURE REGARDING BACKGROUND INVESTIGATION</p>
              <p style={{ margin: "0 0 10px 0" }}>
                The employer requesting this form ("the Company") may obtain information about you from a third party consumer reporting agency for employment purposes. Thus, you may be the subject of a "consumer report" and/or an "investigative consumer report" which may include information about your character, general reputation, personal characteristics, and/or mode of living.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                These reports may contain information regarding your credit history, criminal history, social security number verification, motor vehicle records ("driving records"), verification of your education or employment history, or other background checks.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                You have the right, upon written request made within a reasonable time, to request whether a consumer report has been run and to request the nature and scope of any investigative consumer report. The Consumer Financial Protection Bureau's "A Summary of Your Rights Under the Fair Credit Reporting Act" is provided along with this document.
              </p>
              <p style={{ margin: 0 }}>
                AUTHORIZATION: By signing below, you authorize the Company and its third party screening agent, EvalRight, to conduct this background screening and obtain consumer reports.
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                <input 
                  type="checkbox" 
                  checked={formData.fcraConsent} 
                  onChange={(e) => handleChange("fcraConsent", e.target.checked)}
                  style={{ marginTop: "4px", width: "16px", height: "16px", accentColor: "rgb(199, 0, 57)" }} 
                />
                <span style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.4, fontWeight: 500 }}>
                  I have read the FCRA Disclosure and I hereby authorize EvalRight and my potential employer to conduct a background check and obtain consumer reports. *
                </span>
              </label>
            </div>

            <div style={{ maxWidth: "480px" }}>
              <label style={formLabel}>E-Signature (Please type your full name: "{formData.firstName} {formData.lastName}") *</label>
              <input 
                style={formInput} 
                placeholder="Type your name to e-sign" 
                value={formData.signatureName} 
                onChange={(e) => handleChange("signatureName", e.target.value)} 
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #F3F4F6", paddingTop: "24px" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? "#E5E7EB" : "rgb(199, 0, 57)",
                color: submitting ? "#9CA3AF" : "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "12px 36px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 2px 8px rgba(199, 0, 57, 0.15)"
              }}
            >
              {submitting ? "Submitting Authorization..." : "Submit Authorization"}
            </button>
          </div>

        </form>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

// ── Styles & Data Helpers ──────────────────────────────────────────────────────

const formLabel: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#4B5563",
  marginBottom: "6px",
  textAlign: "left"
};

const formInput: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 12px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  boxSizing: "border-box",
  background: "#FFFFFF",
};

const formSelect: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 12px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  boxSizing: "border-box",
  background: "#FFFFFF",
  cursor: "pointer"
};

const dynamicCard: React.CSSProperties = {
  background: "#FAF5F5",
  border: "1px solid #F3E8E8",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "16px",
  textAlign: "left"
};

const dynamicHeader: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "14px",
  fontWeight: 700,
  color: "#1F2937",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const dynamicDescription: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "12px",
  color: "#6B7280",
  lineHeight: 1.4
};

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];
