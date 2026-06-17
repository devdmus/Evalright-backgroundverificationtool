import { useState } from "react";
import {
  Undo,
  Redo,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Code,
  Link,
  Image as ImageIcon,
  ArrowLeft,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Footer } from "../components/Footer";

// A small component to replicate the floating label / standard input look from the screenshots
function EditorInput({ label, value, onChange, placeholder, helperText, isDarkMode }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: "0" }}>
      <div
        style={{
          border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
          borderRadius: "3px",
          padding: value ? "8px 12px" : "16px 12px",
          background: isDarkMode ? "#2A2D34" : "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          minHeight: "56px",
          justifyContent: "center",
          boxSizing: "border-box"
        }}
      >
        {value && (
          <span style={{ fontSize: "11px", color: isDarkMode ? "#9CA3AF" : "#8A8A8A", marginBottom: "4px", lineHeight: 1 }}>
            {label}
          </span>
        )}
        <input
          value={value}
          onChange={onChange}
          placeholder={value ? "" : placeholder || label}
          style={{
            border: "none",
            outline: "none",
            fontSize: "15px",
            color: isDarkMode ? "#E5E7EB" : "#333333",
            background: "transparent",
            padding: 0,
            lineHeight: 1.2,
            width: "100%"
          }}
        />
      </div>
      {helperText && (
        <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#A0A0A0", marginTop: "6px" }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

export function ApplicantInviteTemplates({ isDarkMode = false, onNavigate }: { isDarkMode?: boolean, onNavigate?: (page: any) => void }) {
  const [activeTab, setActiveTab] = useState<"Templates List" | "Create New Template" | "Import Sample Template">("Templates List");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [templatesList, setTemplatesList] = useState<{name: string, subject: string, fromName: string, replyTo: string, copyTo: string, content: string}[]>([]);
  const [editingTemplateIndex, setEditingTemplateIndex] = useState<number | null>(null);

  const defaultHtmlContent = `
    <p>Hello [applicant_first_name],</p>
    <p style="margin-top: 16px;">Below you will find a link to authorize and initiate a background check, which is required as a condition of employment.</p>
    <p style="margin-top: 16px;">Please save this email and keep it handy as it contains instructions for entering information to process the background check.</p>
    <p style="margin-top: 16px;">
      <b>First, please click this link to read and print the <span style="color: rgb(199, 0, 57);">Fair Credit Reporting Act Summary of Rights</span>.</b>
    </p>
    <p style="margin-top: 16px;">We perform these background checks on each of our candidates to verify information included in the application, and to ensure eligibility for employment.</p>
    <p style="margin-top: 16px;">
      The background check will be conducted by our third party screening partner. Please provide all requested information for fields highlighted in <b>RED</b> and make sure to double-check your data entry to ensure correct spelling and correct numerical sequences. Failure to do this will delay your background check.
    </p>
    <p style="margin-top: 24px; color: #555555;">
      <b>&gt;&gt;&gt; Please review your name and ensure it appears exactly as it does on your Social Security card or driver's license. If the name does not match please reach out to the employer.</b>
    </p>
    <p style="margin-top: 24px;">
      <b style="color: #666666;">&gt;&gt;&gt; ALSO, WHEN ENTERING INFORMATION, PROVIDE AS MUCH DETAIL AS POSSIBLE. FAILURE TO PROVIDE ALL REQUESTED INFORMATION WILL DELAY COMPLETION OF YOUR BACKGROUND CHECK.</b>
    </p>
  `;
  
  const [editorContent, setEditorContent] = useState(defaultHtmlContent);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const [formState, setFormState] = useState({
    subject: "",
    fromName: "",
    replyTo: "",
    copyTo: ""
  });

  const mergingFields = [
    { token: "[applicant_name]", desc: "replaced by applicant's full name" },
    { token: "[applicant_first_name]", desc: "replaced by applicant's first name" },
    { token: "[applicant_last_name]", desc: "replaced by applicant's last name" },
    { token: "[company_name]", desc: "replaced with our company name" },
    { token: "[company_info]", desc: "replaced with our company information (address, phonenumber etc.)" },
    { token: "[FCRA_URL]", desc: "replaced with most recent URL to FCRA Summary of Rights" },
  ];

  const handleEdit = (idx: number) => {
    const tpl = templatesList[idx];
    setNewTemplateName(tpl.name);
    setFormState({
      subject: tpl.subject,
      fromName: tpl.fromName,
      replyTo: tpl.replyTo,
      copyTo: tpl.copyTo
    });
    setEditorContent(tpl.content);
    setEditingTemplateIndex(idx);
    setIsEditing(true);
  };

  const handleDelete = (idx: number) => {
    setTemplatesList(templatesList.filter((_, i) => i !== idx));
  };

  const handleUpdateTemplate = () => {
    if (editingTemplateIndex !== null) {
      const newList = [...templatesList];
      newList[editingTemplateIndex] = {
        name: newTemplateName,
        ...formState,
        content: editorContent
      };
      setTemplatesList(newList);
    } else {
      setTemplatesList([...templatesList, {
        name: newTemplateName,
        ...formState,
        content: editorContent
      }]);
    }
    setIsEditing(false);
    setEditingTemplateIndex(null);
    setActiveTab("Templates List");
  };

  if (isEditing) {
    return (
      <div className="flex-1 flex flex-col min-h-0" style={{ background: isDarkMode ? "#252830" : "#F9FAFB" }}>
        <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
          {/* Page Title */}
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
              marginBottom: "24px",
            }}
          >
            {editingTemplateIndex !== null ? "Update Applicant Invite Template" : "Create New Applicant Invite Template"}
          </h1>

          {/* Form Rows */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <EditorInput
              label="Template Name"
              value={newTemplateName}
              onChange={(e: any) => setNewTemplateName(e.target.value)}
              isDarkMode={isDarkMode}
            />
            <EditorInput
              label="Subject"
              value={formState.subject}
              onChange={(e: any) => setFormState({ ...formState, subject: e.target.value })}
              isDarkMode={isDarkMode}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            <EditorInput
              label="From Name"
              value={formState.fromName}
              onChange={(e: any) => setFormState({ ...formState, fromName: e.target.value })}
              isDarkMode={isDarkMode}
            />
            <EditorInput
              label="Reply-To"
              value={formState.replyTo}
              onChange={(e: any) => setFormState({ ...formState, replyTo: e.target.value })}
              isDarkMode={isDarkMode}
            />
            <EditorInput
              label="Copy to"
              value={formState.copyTo}
              onChange={(e: any) => setFormState({ ...formState, copyTo: e.target.value })}
              helperText="Email addresses must be separated by semicolon"
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Rich Text Editor Mockup */}
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Editor Body */}
            <div className="quill-editor-wrapper" style={{ minHeight: "400px" }}>
              <ReactQuill 
                theme="snow" 
                value={editorContent} 
                onChange={setEditorContent} 
                modules={modules}
                style={{ height: "400px" }}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: "flex", gap: "16px", marginTop: "32px", marginBottom: "40px" }}>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingTemplateIndex(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: isDarkMode ? "#252830" : "#F3F4F6",
                border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                borderRadius: "4px",
                color: isDarkMode ? "#E5E7EB" : "#333333",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <button
              onClick={handleUpdateTemplate}
              style={{
                padding: "10px 24px",
                background: "rgb(199, 0, 57)",
                border: "none",
                borderRadius: "4px",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {editingTemplateIndex !== null ? "Update Template" : "Save Template"}
            </button>
          </div>

          {/* Available Merging Fields */}
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              marginBottom: "40px"
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                background: isDarkMode ? "#2A2D34" : "#F9FAFB",
                borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                color: isDarkMode ? "#9CA3AF" : "#555555",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              Available Merging Fields
            </div>
            <div style={{ padding: "0 20px" }}>
              {mergingFields.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "20px 0",
                    borderBottom: idx !== mergingFields.length - 1 ? (isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB") : "none",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "rgb(199, 0, 57)" }}>{f.token}</span>
                  <span style={{ color: isDarkMode ? "#9CA3AF" : "#8A8A8A" }}> - {f.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  // --- TABS VIEW ---
  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{
        background: isDarkMode ? "#252830" : "#F6F6F6",
      }}
    >
      <div
        className="flex-1 p-6"
        style={{
          overflowY: "auto",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "20px",
          }}
        >
          Applicant Invite Templates
        </h1>

        {showSuccessToast && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              borderRadius: "4px",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              color: "#166534",
              fontSize: "14px"
            }}
          >
            <span>Sample invitations succesfully imported.</span>
            <button
              onClick={() => setShowSuccessToast(false)}
              style={{ background: "transparent", border: "none", color: "#166534", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E0E0E0",
            marginBottom: "20px",
          }}
        >
          {(["Templates List", "Create New Template", "Import Sample Template"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid rgb(199, 0, 57)" : "2px solid transparent",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? (isDarkMode ? "#E5E7EB" : "#333333") : (isDarkMode ? "#9CA3AF" : "#777777"),
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgb(199, 0, 57)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = isDarkMode ? "#9CA3AF" : "#777777";
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "Templates List" && (
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              color: isDarkMode ? "#9CA3AF" : "#8A8A8A",
              fontSize: "14px",
            }}
          >
            {templatesList.length === 0 ? (
              <p>Before you can start an invitation order, please create or import an email invitation template.</p>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ color: isDarkMode ? "#9CA3AF" : "#8A8A8A" }}>You can start an invitation order here: </span>
                  <span style={{ color: "#22c55e", cursor: "pointer" }} onClick={() => onNavigate && onNavigate("order-invitation")}>Start order!</span>
                </div>
                
                <div style={{ background: isDarkMode ? "#1A1C21" : "#FFFFFF", borderRadius: "4px", border: isDarkMode ? "1px solid #333" : "1px solid #E5E7EB", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", background: isDarkMode ? "#2A2D34" : "#F3F4F6", padding: "12px 16px", fontWeight: "bold", borderBottom: isDarkMode ? "1px solid #333" : "1px solid #E5E7EB", color: isDarkMode ? "#E5E7EB" : "#4B5563" }}>
                    <span>Template Name</span>
                    <span>Actions</span>
                  </div>
                  {templatesList.map((tpl, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: i < templatesList.length - 1 ? (isDarkMode ? "1px solid #333" : "1px solid #E5E7EB") : "none", color: isDarkMode ? "#D1D5DB" : "#6B7280" }}>
                      <span>{tpl.name}</span>
                      <div style={{ display: "flex", gap: "24px" }}>
                        <Pencil size={16} color="rgb(199, 0, 57)" style={{ cursor: "pointer" }} onClick={() => handleEdit(i)} />
                        <Trash2 size={16} color="rgb(199, 0, 57)" style={{ cursor: "pointer" }} onClick={() => handleDelete(i)} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "Create New Template" && (
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <p style={{ color: isDarkMode ? "#9CA3AF" : "#8A8A8A", fontSize: "14px", marginTop: 0, marginBottom: "20px" }}>
              To create a custom template, start by entering the template name.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="text"
                placeholder="Template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  background: isDarkMode ? "#2A2D34" : "#FFFFFF",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  outline: "none",
                  width: "250px",
                }}
              />
              <button
                onClick={() => {
                  setNewTemplateName(newTemplateName);
                  setFormState({ subject: "", fromName: "", replyTo: "", copyTo: "" });
                  setEditorContent(defaultHtmlContent);
                  setEditingTemplateIndex(null);
                  setIsEditing(true);
                }}
                style={{
                  background: "rgb(199, 0, 57)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 24px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Create
              </button>
            </div>
          </div>
        )}

        {activeTab === "Import Sample Template" && (
          <div
            style={{
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              color: isDarkMode ? "#E5E7EB" : "#333333",
              fontSize: "14px",
            }}
          >
            <p style={{ color: isDarkMode ? "#9CA3AF" : "#8A8A8A", marginBottom: "24px", marginTop: 0 }}>
              After importing sample template, please replace the placeholder logo image and any other details as you see fit.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              {[
                "Background Check Email",
                "Background Check + Drug Test Email",
                "Drug Test Email",
                "Driving Record Email",
                "Physical Email"
              ].map((template) => (
                <label key={template} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedTemplates.includes(template)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTemplates([...selectedTemplates, template]);
                      } else {
                        setSelectedTemplates(selectedTemplates.filter(t => t !== template));
                      }
                    }}
                    style={{ 
                      width: "16px", 
                      height: "16px", 
                      accentColor: "rgb(199, 0, 57)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "3px"
                    }} 
                  />
                  <span style={{ color: "rgb(199, 0, 57)", fontSize: "14px" }}>{template}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                if (selectedTemplates.length > 0) {
                  setTemplatesList([
                    ...templatesList, 
                    ...selectedTemplates.map(t => ({
                      name: t, 
                      subject: t + " Invitation", 
                      fromName: "EvalRight", 
                      replyTo: "farooq@digitmarketus.com", 
                      copyTo: "farooq@digitmarketus.com",
                      content: defaultHtmlContent
                    }))
                  ]);
                  setSelectedTemplates([]);
                  setActiveTab("Templates List");
                  setShowSuccessToast(true);
                }
              }}
              disabled={selectedTemplates.length === 0}
              style={{
                background: selectedTemplates.length > 0 ? "rgb(199, 0, 57)" : "#D1D5DB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "10px 24px",
                fontSize: "14px",
                cursor: selectedTemplates.length > 0 ? "pointer" : "not-allowed",
                fontWeight: 500,
              }}
            >
              Add {selectedTemplates.length > 0 ? selectedTemplates.length : ""} Template{selectedTemplates.length > 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
