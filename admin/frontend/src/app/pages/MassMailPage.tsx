import { useState, useRef } from "react";
import { Footer } from "../components/Footer";
import { AVAILABLE_SEARCHES, INDIA_STATES } from "../data/mockData";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Link2, 
  AlignLeft, 
  X,
  AlertCircle,
  Paperclip,
  Plus,
  Minus,
  Upload
} from "lucide-react";

interface MassMailPageProps {
  isDarkMode?: boolean;
}

type CriteriaKey =
  | "client-status"
  | "location"
  | "search-type"
  | "monthly-invoice-recipients"
  | "config-group"
  | "primary-user"
  | "billing-contact";

const MOCK_RECIPIENTS = [
  "Sridhar Chava <hr@eclatprosolutions.com>",
  "Nick Shiva <hr@effinxt.com>",
  "Harshini Chada <hr@elajika.com>",
  "Satyam B <hr@elitetechinfo.com>",
  "Donna Dsuza <hr@eninsystems.com>",
  "Sri Chada <hr@episdata.com>",
  "Sudheer Chakka <hr@etekit.com>",
  "Balakrishna Nemani <hr@evokesystems.com>",
  "Prasad Arikatla <hr@famoustechys.com>",
  "Hr Flexday <hr@flexday.ai>",
  "Ravi Polishetty <hr@fortuneminds.com>",
  "Aruna Edula <hr@fusionlifesolutions.com>",
];

const MASS_MAIL_SEARCH_TYPES = [
  "All Searches",
  "(AF) LabCorp - 10 Panel",
  "Nationwide Criminal Database Search",
  "SSN Verification (CBSV)",
  "County Criminal Search",
  "Drug Screening 4 Panel (LabCorp)",
  "Drug Screening 5 Panel with Nicotine",
  "Education Verification",
  "Employment Verification",
  "ES - 10 Panel (1906)",
  "ES - 10 Panel (1918)",
  "ES - 10 Panel 6AM (2249)",
  "ES - 10 Panel 6AM/ EXBNZ/ MDMA/ EXOPI/ OXY (6728)",
  "ES - 10 Panel 6AM/ HYDO/ OXY/ MDMA (4089)",
  "ES - 10 Panel 6AM/ OXY/ MEP/ MDMA (3462)",
  "ES - 10 Panel ALCOHOL (1208)",
  "ES - 10 Panel ALCOHOL/ FENT/ MEP/ EXT OPI (4007)",
  "ES - 10 Panel BUP/ FENT/ MDMA/ MEP/ EXP OPI/ OXY/ TCA/ TRAM (7127)",
  "ES - 10 Panel BUP/ OXY (2303)",
  "ES - 10 Panel COT/ EXP OPI/ ALCOHOL (3485)",
  "ES - 10 Panel Custom Drug Test",
  "ES - 10 Panel EXP OPI/ OXY (1910)",
  "ES - 10 Panel FEN (8596)",
  "ES - 10 Panel Hair/EXP OPI (H10P)",
  "ES - 10 Panel MDMA/ BATHSALTS (3324)",
  "ES - 10 Panel NO THC/ 6AM/ EXP OPI (4225)",
  "ES - 10 Panel NO THC/ 6AM/ MEQ (4111)",
  "ES - 10 Panel NO THC/ EXP OPI (6664)",
  "ES - 10 Panel NO THC/ MEQ (4343)",
  "ES - 10 Panel NO THC/ OXY/ EXP OPI (3477)",
  "ES - 10 Panel NO THC/ OXY/ MDMA (4691)",
  "ES - 10 Panel Standard (1204)",
  "ES - 10-Panel NICOTINE (1224)",
  "ES - 11 Panel ALCOHOL/ FENT/ EXP OPI (8548)",
  "ES - 11 Panel ExpOPI/NOTHC/OXY/ECS/FEN/TRAM",
  "ES - 11 Panel No THC/ 6AM/ Exp Opi (8145)",
  "ES - 11 Panel NO THC/ FENT/ OXY (6405)",
  "ES - 12 Panel NO THC/ MDMA/ OXY/ 6AM (4137)",
  "ES - 16 Panel 6AM/ ALCOHOL/ FEN/ MEP/ OXY/ TRAM (6605)",
  "ES - 3DR HYCD MDMA/6AM",
  "ES - 4 Panel 6AM/ FENT/ MDMA (6276)",
  "ES - 4 Panel NO THC (1687)",
  "ES - 4 Panel NO THC/ 6AM/ HYD/ MDMA/ OXY (3488)",
  "ES - 5 Panel Alcohol (2447)",
  "ES - 5 Panel Hair EXP OPI (H5PEO)",
  "ES - 5 Panel NO THC/ EXP OPI/ ALCOHOL (4645)",
  "ES - 5 Panel Standard (1200)",
  "ES - 6 Panel (2275)",
  "ES - 6 Panel Standard (3121)",
  "ES - 7 Panel",
  "ES - 7 Panel (5DSP/OXY/PHN)",
  "ES - 7 Panel 6AM (2267)",
  "ES - 7 Panel 6AM/ BUP/ FENT/ MDMA/ EXP OPI/ OXY/ TRAM (5268)",
  "ES - 7 Panel FENT/ BUP (2304)",
  "ES - 7 Panel MDMA/ EXP OPI/ OXY/ TCA (7116)",
  "ES - 7 Panel NO THC (2480)",
  "ES - 7 Panel NO THC/ BUP/ MDMA/ OXY/ TCA (3249)",
  "ES - 7 Panel OXY/ MDMA (3124)",
  "ES - 7 Panel Plus MDMA",
  "ES - 7 Panel Standard (1203)",
  "ES - 8 Panel",
  "ES - 8 Panel 6AM/ MDMA/ MEQ/ OXY/ NO THC (6480)",
  "ES - 8 Panel BUP/ MDMA/ OXY (4163)",
  "ES - 8 Panel FENT/ EXP OPI (4686)",
  "ES - 8 Panel HYCD/ MDMA/ OXY (6477)",
  "ES - 8 Panel NO THC/ 6AM (4249)",
  "ES - 8 Panel NO THC/ 6AM/ MEQ (6766)",
  "ES - 8 Panel NO THC/ BUP/ MDMA/ MEQ/ OXY (8825)",
  "ES - 8 Panel NO THC/ OXY/ MEP (7108)",
  "ES - 8 Panel OXY/ 6AM/ MDMA (2333)",
  "ES - 8 Panel Standard (3123)",
  "ES - 9 Panel 6AM/ FENT/ MDMA/ OXY (4758)",
  "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ EXP OPI/ OXY (8542)",
  "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ FENT/ EXP OPI/ OXY (8244)",
  "ES - 9 Panel 6AM/ OXY/ MDMA (6829)",
  "ES - 9 Panel 6AM/ OXY/ MEP (4520)",
  "ES - 9 Panel BUP/ MDMA/ OXY/ TCA (4715)",
  "ES - 9 Panel FENT/ EXOPI (6902)",
  "ES - 9 Panel FENT/ MEP/ MEQ/ OXY/ TRAM (6544)",
  "ES - 9 Panel NO THC (1790)",
  "ES - 9 Panel NO THC (6599)",
  "ES - 9 Panel NO THC/ OXY (7027)",
  "ES - 9 Panel NO THC/ OXY (8798)",
  "ES - 9 Panel OXY/ MDMA/ OPIEX (4190)",
  "ES - 9 Panel Standard (1205)",
  "ES - 9DSP/EXP OPI/Custom Levels/OXY/ECS/PHN",
  "ES - ALCOHOL",
  "ES - Audiogram",
  "ES - Chest X-Ray (1 or 2 Views)",
  "ES - Chest X-Ray (2 Views)",
  "ES - DOT Alcohol (BAT)",
  "ES - DOT Drug Test",
  "ES - DOT Physical",
  "ES - DOT Physical Recertification",
  "ES - DOT Urine Test",
  "ES - Hep A Titer",
  "ES - Hep A Vaccine #1",
  "ES - Hep A Vaccine #2",
  "ES - Hep B Surface Antigen - (Screen for Acute/Chronic Disease)",
  "ES - Hep B Titer",
  "ES - Hep B Vaccine #1",
  "ES - Hep B Vaccine #2",
  "ES - Hep B Vaccine #3",
  "ES - Hep C Titer",
  "ES - Influenza Vaccine",
  "ES - Lift Test",
  "ES - MMR Titer",
  "ES - MMR Vaccine",
  "ES - MMR Vaccine #2",
  "ES - Mumps Antibody (IgG)",
  "ES - Non DOT Alcohol (BAT)",
  "ES - Non-DOT Physical",
  "ES - Oral 10 Panel BUP/ MDMA (6037)",
  "ES - Oral 10 Panel EXP OPI/ MDMA (6036)",
  "ES - Oral 10 Panel MDMA/ ALCOHOL (6043)",
  "ES - Oral 5 Panel (6008)",
  "ES - Oral 6 Panel MDMA/ OXY (6002)",
  "ES - Oral Fluid Drug Screen",
  "ES - Oral Swab Kits",
  "ES - Oral THC (6051)",
  "ES - OSHA Respirator Questionnaire",
  "ES - Pulmonary Function Test/Spirometry",
  "ES - Respirator Fit Test, Qualitative",
  "ES - Respirator Fit Test, Quantitative",
  "ES - Rubella Antibody (IgG)",
  "ES - TB Chest X-Ray",
  "ES - TB/PPD Skin Test - 1 Step Only",
  "ES - TB/PPD Test 1",
  "ES - TB/PPD Test 2",
  "ES - TDAP",
  "ES - TSPOT/TB Blood Test",
  "ES - Urine Fentanyl Only",
  "ES - Varicella Titer",
  "ES - Varicella Vaccine",
  "ES - Varicella Vaccine #2",
  "ES - Vision Test, Ishihara",
  "ES - Vision Test, Jaeger",
  "ES - Vision Test, Snellen",
  "ES - Vision Test, Titmus"
];

export function MassMailPage({ isDarkMode = false }: MassMailPageProps) {
  // Selection and values state
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaKey | null>(null);
  const [clientStatus, setClientStatus] = useState<string>("All");
  const [location, setLocation] = useState<string>("Select One");
  const [searchType, setSearchType] = useState<string>("All Searches");
  const [monthlyInvoiceRecipients, setMonthlyInvoiceRecipients] = useState<string>("This Months Invoices");
  const [configGroup, setConfigGroup] = useState<string>("All");

  // Validation error state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compose Message state
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [fromName, setFromName] = useState<string>("EvalRight");
  const [fromAddress, setFromAddress] = useState<string>("support@evalright.com");
  const [sendListFilter, setSendListFilter] = useState<string>("");
  const [copyTo, setCopyTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [messageBody, setMessageBody] = useState<string>("");
  const [attachmentVal, setAttachmentVal] = useState<string>("");
  const [tickToSave, setTickToSave] = useState<boolean>(false);
  const [saveName, setSaveName] = useState<string>("");
  
  // Sending status states
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Textarea Ref for formatting
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Brand colors & styles
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
  const bodyBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const cardBg = isDarkMode ? "#252830" : "#ffffff";
  const cardBorder = isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB";
  const textPrimary = isDarkMode ? "#E5E7EB" : "#374151";
  const textMuted = isDarkMode ? "#8391a2" : "#8A8A8A";
  const inputBg = isDarkMode ? "#1A1C21" : "#ffffff";
  
  // Highlight styling matching screenshot (no border-left, solid yellow strip)
  const selectionBg = isDarkMode ? "rgba(234, 179, 8, 0.15)" : "#FCF8E3"; 

  // Dropdowns values from mockData
  const statuses = ["All", "ACTIVE", "INACTIVE", "CLOSED"];
  const configGroups = ["All", "New Sign-Ups EvalRight", "Evalright Group", "Standard Billing", "Special Tier"];

  // Option change triggers selection of that row
  const handleDropdownChange = (criteria: CriteriaKey, value: string, setter: (val: string) => void) => {
    setter(value);
    setSelectedCriteria(criteria);
    setValidationError(null);
  };

  const handleRowClick = (criteria: CriteriaKey) => {
    setSelectedCriteria(criteria);
    setValidationError(null);
  };

  const handleComposeClick = () => {
    if (!selectedCriteria) {
      setValidationError("Please select at least one option / criteria row before composing a message.");
      return;
    }
    setValidationError(null);
    setIsComposing(true);
    setSendSuccess(false);
  };

  const handleSendMail = () => {
    if (!subject.trim() || !messageBody.trim()) {
      return;
    }
    setIsSending(true);
    // Simulate API mail sending
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setSubject("");
      setMessageBody("");
      setAttachmentVal("");
      setTickToSave(false);
      setSaveName("");
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentVal(e.target.files[0].name);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    switch (command) {
      case "bold":
        replacement = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        replacement = `<em>${selectedText}</em>`;
        break;
      case "underline":
        replacement = `<u>${selectedText}</u>`;
        break;
      case "strike":
        replacement = `<s>${selectedText}</s>`;
        break;
      case "removeFormat":
        replacement = selectedText.replace(/<\/?[^>]+(>|$)/g, "");
        break;
      case "quote":
        replacement = `<blockquote>${selectedText}</blockquote>`;
        break;
      case "code":
        replacement = `<pre><code>${selectedText}</code></pre>`;
        break;
      case "numList":
        replacement = `<ol>\n  <li>${selectedText || "item"}</li>\n</ol>`;
        break;
      case "bulletList":
        replacement = `<ul>\n  <li>${selectedText || "item"}</li>\n</ul>`;
        break;
      case "alignLeft":
        replacement = `<div style="text-align: left;">${selectedText}</div>`;
        break;
      case "alignCenter":
        replacement = `<div style="text-align: center;">${selectedText}</div>`;
        break;
      case "alignRight":
        replacement = `<div style="text-align: right;">${selectedText}</div>`;
        break;
      case "link":
        const url = prompt("Enter link URL:", "http://");
        if (url) {
          replacement = `<a href="${url}">${selectedText || "link"}</a>`;
        } else {
          return;
        }
        break;
      case "font":
        replacement = `<span style="font-family: ${value || 'inherit'}">${selectedText}</span>`;
        break;
      case "normal":
        if (value === "p") replacement = `<p>${selectedText}</p>`;
        else if (value === "h1") replacement = `<h1>${selectedText}</h1>`;
        else if (value === "h2") replacement = `<h2>${selectedText}</h2>`;
        else if (value === "h3") replacement = `<h3>${selectedText}</h3>`;
        else if (value === "pre") replacement = `<pre>${selectedText}</pre>`;
        else replacement = `<p>${selectedText}</p>`;
        break;
      case "size":
        replacement = `<span style="font-size: ${value || 'inherit'}">${selectedText}</span>`;
        break;
      case "style":
        if (value === "Italic Title") replacement = `<h2 style="font-style: italic;">${selectedText}</h2>`;
        else if (value === "Special Code") replacement = `<code style="background: #eee; padding: 2px 4px;">${selectedText}</code>`;
        break;
      case "source":
        alert("Already in Source (HTML) editing mode.");
        return;
      default:
        return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setMessageBody(newText);

    // Refocus textarea and select the newly inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  // Generate target description for compose view
  const getSelectedCriteriaDescription = () => {
    switch (selectedCriteria) {
      case "client-status":
        return `Clients with Status: ${clientStatus}`;
      case "location":
        return `Clients in Location: ${location}`;
      case "search-type":
        return `Clients using Search Type: ${searchType}`;
      case "monthly-invoice-recipients":
        return `Monthly Invoice Recipients: ${monthlyInvoiceRecipients}`;
      case "config-group":
        return `Clients in Config Group: ${configGroup}`;
      case "primary-user":
        return "Primary User under each ACTIVE client account in database";
      case "billing-contact":
        return "Billing Contact under each client account in database";
      default:
        return "";
    }
  };

  if (isComposing) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: bodyBg }}>
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
          
          {/* Send Message Header */}
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "normal", color: "#C70039", margin: "0 0 16px 0", fontFamily: "inherit" }}>
              Send Message
            </h1>
            
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              The criteria selected for this email has resulted in no recipients which means it cannot be sent
            </p>
            
            <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "0 0 16px 0" }}>
              Send Email Message
            </h2>
          </div>

          {/* Form */}
          {sendSuccess ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "40px" }}>
              <span style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>Message Sent Successfully!</span>
              <button 
                onClick={() => { setSendSuccess(false); setIsComposing(false); }}
                style={{
                  padding: "6px 20px",
                  background: "#e1e1e1",
                  border: "1px solid #adadad",
                  borderRadius: "3px",
                  fontSize: "13px",
                  cursor: "pointer",
                  color: "#000"
                }}
              >
                Back to Mass Mail
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "900px" }}>
              {/* From Row */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333" }}>
                  From:
                </div>
                <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                  <input 
                    type="text" 
                    value={fromName} 
                    onChange={(e) => setFromName(e.target.value)}
                    style={{
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      fontSize: "13px",
                      width: "250px",
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                  <input 
                    type="text" 
                    value={fromAddress} 
                    onChange={(e) => setFromAddress(e.target.value)}
                    style={{
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      fontSize: "13px",
                      width: "350px",
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                </div>
              </div>

              {/* Send List Row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333", marginTop: "4px" }}>
                  Send List:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <select 
                    multiple 
                    size={12}
                    style={{
                      width: "500px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      padding: "4px",
                      fontSize: "12.5px",
                      fontFamily: "monospace",
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  >
                    {MOCK_RECIPIENTS.map((rec, idx) => (
                      <option key={idx} value={rec}>{rec}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={sendListFilter}
                    onChange={(e) => setSendListFilter(e.target.value)}
                    style={{
                      width: "500px",
                      padding: "4px 8px",
                      border: "1px solid #000",
                      borderRadius: "3px",
                      fontSize: "13px",
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                </div>
              </div>

              {/* Copy to Row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333", marginTop: "4px" }}>
                  Copy to:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <input 
                    type="text" 
                    value={copyTo}
                    onChange={(e) => setCopyTo(e.target.value)}
                    style={{
                      width: "500px",
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      fontSize: "13px",
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#777" }}>
                    You can add a comma separated email list. Each address will receive just one copy
                  </span>
                </div>
              </div>

              {/* Subject Row */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333" }}>
                  Subject:
                </div>
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "500px",
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      fontSize: "13px",
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                </div>
              </div>

              {/* Rich Text Editor Row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "8px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333", marginTop: "4px" }}>
                  Message:
                </div>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, maxWidth: "780px", border: "1px solid #ccc", borderRadius: "3px", overflow: "hidden" }}>
                  
                  {/* CKEditor Toolbar Replica */}
                  <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "2px", 
                    padding: "6px", 
                    background: "#f0f0f0", 
                    borderBottom: "1px solid #ccc", 
                    alignItems: "center" 
                  }}>
                    <button type="button" title="Bold" style={legacyToolbarBtnStyle} onClick={() => handleFormat("bold")}><Bold size={12} /></button>
                    <button type="button" title="Italic" style={legacyToolbarBtnStyle} onClick={() => handleFormat("italic")}><Italic size={12} /></button>
                    <button type="button" title="Underline" style={legacyToolbarBtnStyle} onClick={() => handleFormat("underline")}><Underline size={12} /></button>
                    <button type="button" title="Strikethrough" style={legacyToolbarBtnStyle} onClick={() => handleFormat("strike")}><span style={{ textDecoration: "line-through", fontSize: "11px", fontWeight: "bold" }}>S</span></button>
                    <div style={legacyToolbarDividerStyle} />
                    <button type="button" title="Remove Format" style={legacyToolbarBtnStyle} onClick={() => handleFormat("removeFormat")}><span style={{ fontSize: "11px" }}>T<sub>x</sub></span></button>
                    <div style={legacyToolbarDividerStyle} />
                    <button type="button" title="Quote" style={legacyToolbarBtnStyle} onClick={() => handleFormat("quote")}><span style={{ fontSize: "14px", lineHeight: "1", fontFamily: "serif" }}>“</span></button>
                    <button type="button" title="Code Block" style={legacyToolbarBtnStyle} onClick={() => handleFormat("code")}><span style={{ fontSize: "10px", fontFamily: "monospace" }}>&lt;/&gt;</span></button>
                    <div style={legacyToolbarDividerStyle} />
                    <button type="button" title="Numbered List" style={legacyToolbarBtnStyle} onClick={() => handleFormat("numList")}><span style={{ fontSize: "11px" }}>1.</span></button>
                    <button type="button" title="Bulleted List" style={legacyToolbarBtnStyle} onClick={() => handleFormat("bulletList")}><List size={12} /></button>
                    <div style={legacyToolbarDividerStyle} />
                    <button type="button" title="Align Left" style={legacyToolbarBtnStyle} onClick={() => handleFormat("alignLeft")}><AlignLeft size={12} /></button>
                    <button type="button" title="Align Center" style={legacyToolbarBtnStyle} onClick={() => handleFormat("alignCenter")}><span style={{ fontSize: "11px" }}>≡</span></button>
                    <button type="button" title="Align Right" style={legacyToolbarBtnStyle} onClick={() => handleFormat("alignRight")}><span style={{ fontSize: "11px", textAlign: "right" }}>≡</span></button>
                    <div style={legacyToolbarDividerStyle} />
                    <button type="button" title="Link" style={legacyToolbarBtnStyle} onClick={() => handleFormat("link")}><Link2 size={12} /></button>
                    
                    {/* Row 2 Selects */}
                    <div style={{ display: "flex", width: "100%", gap: "6px", marginTop: "4px", padding: "2px 0", borderTop: "1px dashed #ddd" }}>
                      <select style={legacyToolbarSelectStyle} onChange={(e) => { handleFormat("style", e.target.value); e.target.value = "Styles"; }} defaultValue="Styles">
                        <option value="Styles" disabled>Styles</option>
                        <option value="Italic Title">Italic Title</option>
                        <option value="Special Code">Special Code</option>
                      </select>
                      <select style={legacyToolbarSelectStyle} onChange={(e) => { handleFormat("normal", e.target.value); e.target.value = "Normal"; }} defaultValue="Normal">
                        <option value="Normal" disabled>Paragraph Format</option>
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="pre">Preformatted</option>
                      </select>
                      <select style={legacyToolbarSelectStyle} onChange={(e) => { handleFormat("font", e.target.value); e.target.value = "Font"; }} defaultValue="Font">
                        <option value="Font" disabled>Font</option>
                        <option value="Arial">Arial</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                      </select>
                      <select style={legacyToolbarSelectStyle} onChange={(e) => { handleFormat("size", e.target.value); e.target.value = "Size"; }} defaultValue="Size">
                        <option value="Size" disabled>Size</option>
                        <option value="8px">8px</option>
                        <option value="10px">10px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                        <option value="24px">24px</option>
                        <option value="36px">36px</option>
                      </select>
                      <div style={legacyToolbarDividerStyle} />
                      <button type="button" title="Source" style={{ ...legacyToolbarBtnStyle, display: "flex", gap: "3px", padding: "2px 6px" }} onClick={() => handleFormat("source")}>
                        <span style={{ fontSize: "11px", fontWeight: "bold" }}>Source</span>
                      </button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea 
                    ref={textareaRef}
                    rows={15}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "10px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                      outline: "none",
                      resize: "vertical",
                      background: isDarkMode ? "#222" : "#fff",
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                </div>
              </div>

              {/* Attachement Row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "8px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333", marginTop: "4px" }}>
                  Attachement:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input 
                      type="text" 
                      value={attachmentVal}
                      readOnly
                      style={{
                        width: "370px",
                        padding: "4px 8px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                        fontSize: "13px",
                        background: isDarkMode ? "#333" : "#eee",
                        color: isDarkMode ? "#fff" : "#000"
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: "4px 12px",
                        background: "#e1e1e1",
                        border: "1px solid #adadad",
                        borderRadius: "3px",
                        fontSize: "13px",
                        cursor: "pointer",
                        color: "#000"
                      }}
                    >
                      Browse...
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      style={{ display: "none" }} 
                    />
                    <span 
                      style={{ 
                        fontSize: "13px", 
                        color: "#C70039", 
                        cursor: "pointer", 
                        marginLeft: "8px" 
                      }}
                      onClick={() => setAttachmentVal("")}
                    >
                      Add Another...
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#777" }}>
                    (Allowed File Extensions: .jpg, .jpeg, .gif, .png, .doc, .pdf, .tif)
                  </span>
                </div>
              </div>

              {/* Save Message Row */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <div style={{ width: "120px", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "#333" }}>
                  Save Message:
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                  <input 
                    type="checkbox" 
                    checked={tickToSave}
                    onChange={(e) => setTickToSave(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "13px", color: "#333" }}>
                    Tick to save and enter save name:
                  </span>
                  <input 
                    type="text" 
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    disabled={!tickToSave}
                    style={{
                      width: "250px",
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      fontSize: "13px",
                      background: !tickToSave ? "#eee" : (isDarkMode ? "#333" : "#fff"),
                      color: isDarkMode ? "#fff" : "#000"
                    }}
                  />
                </div>
              </div>

              {/* Actions / Send Button Row */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={handleSendMail}
                  disabled={isSending || !subject.trim() || !messageBody.trim()}
                  style={{
                    padding: "6px 20px",
                    background: "#e1e1e1",
                    border: "1px solid #adadad",
                    borderRadius: "3px",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: "normal",
                    color: "#000"
                  }}
                >
                  {isSending ? "Sending..." : "Send Message »"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  style={{
                    marginLeft: "10px",
                    padding: "6px 20px",
                    background: "transparent",
                    border: "none",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "#555"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: bodyBg }}>
      <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
        
        {/* Header Section */}
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 600, color: primaryBrandColor, margin: "0 0 6px 0" }}>
            Mass Mail
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, color: textPrimary, margin: 0 }}>
              Mass Mail Tool
            </h2>
            <p style={{ fontSize: "12px", color: textMuted, margin: 0 }}>
              Select the option / criteria you want to use with Mass Mail tool. Only one can be selected.
            </p>
          </div>
        </div>

        {/* Form Criteria Table / Grid */}
        <div style={{ background: cardBg, border: cardBorder, borderRadius: "6px", overflow: "hidden", padding: "8px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
            <tbody>
              {/* Row 1: Client Status */}
              <tr 
                onClick={() => handleRowClick("client-status")}
                style={{ 
                  background: selectedCriteria === "client-status" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", width: "24px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "client-status"}
                    onChange={() => handleRowClick("client-status")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", width: "200px", color: textPrimary, userSelect: "none" }}>
                  Client Status:
                </td>
                <td style={{ padding: "6px 12px" }} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={clientStatus}
                    onChange={(e) => handleDropdownChange("client-status", e.target.value, setClientStatus)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      borderRadius: "4px",
                      padding: "3px 6px",
                      fontSize: "12px",
                      color: textPrimary,
                      outline: "none",
                      minWidth: "120px",
                      cursor: "pointer"
                    }}
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* Row 2: Location */}
              <tr 
                onClick={() => handleRowClick("location")}
                style={{ 
                  background: selectedCriteria === "location" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "location"}
                    onChange={() => handleRowClick("location")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", color: textPrimary, userSelect: "none" }}>
                  Location:
                </td>
                <td style={{ padding: "6px 12px" }} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={location}
                    onChange={(e) => handleDropdownChange("location", e.target.value, setLocation)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      borderRadius: "4px",
                      padding: "3px 6px",
                      fontSize: "12px",
                      color: textPrimary,
                      outline: "none",
                      minWidth: "140px",
                      cursor: "pointer",
                      maxWidth: "350px"
                    }}
                  >
                    <option value="Select One">Select One</option>
                    {INDIA_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* Row 3: Search Type */}
              <tr 
                onClick={() => handleRowClick("search-type")}
                style={{ 
                  background: selectedCriteria === "search-type" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "search-type"}
                    onChange={() => handleRowClick("search-type")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", color: textPrimary, userSelect: "none" }}>
                  Search Type:
                </td>
                <td style={{ padding: "6px 12px" }} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={searchType}
                    onChange={(e) => handleDropdownChange("search-type", e.target.value, setSearchType)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      borderRadius: "4px",
                      padding: "3px 6px",
                      fontSize: "12px",
                      color: textPrimary,
                      outline: "none",
                      width: "100%",
                      maxWidth: "520px",
                      cursor: "pointer"
                    }}
                  >
                    {MASS_MAIL_SEARCH_TYPES.map(search => (
                      <option key={search} value={search}>{search}</option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* Row 4: Monthly Invoice Recipients */}
              <tr 
                onClick={() => handleRowClick("monthly-invoice-recipients")}
                style={{ 
                  background: selectedCriteria === "monthly-invoice-recipients" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "monthly-invoice-recipients"}
                    onChange={() => handleRowClick("monthly-invoice-recipients")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", color: textPrimary, userSelect: "none" }}>
                  Monthly Invoice Recipients:
                </td>
                <td style={{ padding: "6px 12px" }} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={monthlyInvoiceRecipients}
                    onChange={(e) => handleDropdownChange("monthly-invoice-recipients", e.target.value, setMonthlyInvoiceRecipients)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      borderRadius: "4px",
                      padding: "3px 6px",
                      fontSize: "12px",
                      color: textPrimary,
                      outline: "none",
                      minWidth: "180px",
                      cursor: "pointer"
                    }}
                  >
                    <option value="This Months Invoices">This Months Invoices</option>
                    <option value="Last Months Invoices">Last Months Invoices</option>
                  </select>
                </td>
              </tr>

              {/* Row 5: Config Group */}
              <tr 
                onClick={() => handleRowClick("config-group")}
                style={{ 
                  background: selectedCriteria === "config-group" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "config-group"}
                    onChange={() => handleRowClick("config-group")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", color: textPrimary, userSelect: "none" }}>
                  Config Group:
                </td>
                <td style={{ padding: "6px 12px" }} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={configGroup}
                    onChange={(e) => handleDropdownChange("config-group", e.target.value, setConfigGroup)}
                    style={{
                      background: inputBg,
                      border: cardBorder,
                      borderRadius: "4px",
                      padding: "3px 6px",
                      fontSize: "12px",
                      color: textPrimary,
                      outline: "none",
                      minWidth: "140px",
                      cursor: "pointer"
                    }}
                  >
                    {configGroups.map(cg => (
                      <option key={cg} value={cg}>{cg}</option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* Row 6: Primary User */}
              <tr 
                onClick={() => handleRowClick("primary-user")}
                style={{ 
                  background: selectedCriteria === "primary-user" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "primary-user"}
                    onChange={() => handleRowClick("primary-user")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", color: textPrimary, userSelect: "none" }}>
                  Primary User
                </td>
                <td style={{ padding: "6px 12px", color: textMuted, userSelect: "none" }}>
                  Mass Mail all clients in database (only Primary User under each ACTIVE client account will receive an email)
                </td>
              </tr>

              {/* Row 7: Billing Contact */}
              <tr 
                onClick={() => handleRowClick("billing-contact")}
                style={{ 
                  background: selectedCriteria === "billing-contact" ? selectionBg : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                <td style={{ padding: "6px 12px", verticalAlign: "middle", textAlign: "center" }}>
                  <input 
                    type="radio" 
                    name="mass-mail-criteria"
                    checked={selectedCriteria === "billing-contact"}
                    onChange={() => handleRowClick("billing-contact")}
                    style={{ cursor: "pointer", accentColor: primaryBrandColor }}
                  />
                </td>
                <td style={{ padding: "6px 8px", color: textPrimary, userSelect: "none" }}>
                  Billing Contact
                </td>
                <td style={{ padding: "6px 12px", color: textMuted, userSelect: "none" }}>
                  Mass Mail all clients in database (only Billing Contact under each client account will receive email)
                </td>
              </tr>
            </tbody>
          </table>

          {/* Validation Error Message Box */}
          {validationError && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              justifyContent: "center", 
              color: primaryBrandColor, 
              fontSize: "12px",
              marginTop: "12px",
              fontWeight: 500,
              animation: "fadeIn 0.2s ease"
            }}>
              <AlertCircle size={14} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Centered Compose Message Button under the options list */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "12px", marginBottom: "4px" }}>
            <button
              onClick={handleComposeClick}
              style={{
                padding: "5px 16px",
                fontSize: "12px",
                fontWeight: 400,
                color: isDarkMode ? "#ffffff" : "#000000",
                background: isDarkMode ? "#3A3D4A" : "#FFFFFF",
                border: `1px solid ${isDarkMode ? "#777777" : "#767676"}`,
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? "#4A4D5C" : "#F5F5F5";
                e.currentTarget.style.borderColor = isDarkMode ? "#999999" : "#505050";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? "#3A3D4A" : "#FFFFFF";
                e.currentTarget.style.borderColor = isDarkMode ? "#777777" : "#767676";
              }}
            >
              Compose Message
            </button>
          </div>
        </div>


      </div>

      <Footer isDarkMode={isDarkMode} />

      {/* Embedded Animations and Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .spinner {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Helper styling for editor toolbar buttons
const editorToolbarButtonStyle = (isDarkMode: boolean) => ({
  background: "transparent",
  border: "none",
  color: isDarkMode ? "#8391a2" : "#555555",
  padding: "4px 6px",
  borderRadius: "3px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center"
});

// Inline spinner style
const spinnerStyle = {
  display: "inline-block",
  width: "12px",
  height: "12px",
  border: "2px solid rgba(255,255,255,0.3)",
  borderTop: "2px solid #FFFFFF",
  borderRadius: "50%"
};

const legacyToolbarBtnStyle = {
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "3px",
  padding: "3px 6px",
  fontSize: "12px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "22px",
  height: "22px",
  color: "#333"
};

const legacyToolbarDividerStyle = {
  width: "1px",
  height: "16px",
  background: "#ccc",
  margin: "0 4px"
};

const legacyToolbarSelectStyle = {
  fontSize: "11px",
  padding: "2px 4px",
  border: "1px solid #ccc",
  borderRadius: "3px",
  background: "#fff",
  outline: "none",
  color: "#333"
};
