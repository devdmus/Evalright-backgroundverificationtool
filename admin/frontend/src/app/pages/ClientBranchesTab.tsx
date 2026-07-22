import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { CLIENT_BRANCHES, ClientBranch } from "../data/mockData";

interface BranchForm {
  branchName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phoneNumber: string;
  emailDistribution: string;
  branchInvoiceEmail: string;
  showClientPackages: boolean;
  showConfigGroupPackages: boolean;
}

const EMPTY_FORM: BranchForm = {
  branchName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
  phoneNumber: "",
  emailDistribution: "",
  branchInvoiceEmail: "",
  showClientPackages: false,
  showConfigGroupPackages: false,
};

interface ClientBranchesTabProps {
  isDarkMode?: boolean;
}

export function ClientBranchesTab({ isDarkMode = false }: ClientBranchesTabProps) {
  const [branches, setBranches] = useState<ClientBranch[]>(CLIENT_BRANCHES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<BranchForm>(EMPTY_FORM);

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const headerBg = isDarkMode ? "#2A2D34" : "#F9FAFB";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  function openModal() {
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    if (!form.branchName.trim()) return;
    const newBranch: ClientBranch = {
      id: String(Date.now()),
      branchName: form.branchName,
      address1: form.address1,
      city: form.city,
      state: form.state,
      postcode: form.postcode,
      country: form.country,
      phoneNumber: form.phoneNumber,
      searchRestrictions: "",
      packages: "",
    };
    setBranches((prev) => [...prev, newBranch]);
    closeModal();
  }

  function updateForm<K extends keyof BranchForm>(key: K, value: BranchForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <div
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "6px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: mutedColor, margin: 0 }}>Branch List</h3>
          <button
            onClick={openModal}
            style={{
              height: "32px",
              padding: "0 14px",
              background: "#C70039",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add New Branch
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
                {[
                  "Branch Name",
                  "Address1",
                  "City",
                  "State",
                  "Postcode",
                  "Country",
                  "Phone Number",
                  "Search Restrictions",
                  "Packages",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: mutedColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.map((branch, i) => (
                <tr
                  key={branch.id}
                  style={{
                    borderBottom: i < branches.length - 1 ? `1px solid ${borderColor}` : "none",
                    background: i % 2 === 0 ? "transparent" : isDarkMode ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                  }}
                >
                  <Td textColor={textColor}>{branch.branchName}</Td>
                  <Td textColor={textColor}>{branch.address1}</Td>
                  <Td textColor={textColor}>{branch.city}</Td>
                  <Td textColor={textColor}>{branch.state}</Td>
                  <Td textColor={textColor}>{branch.postcode}</Td>
                  <Td textColor={textColor}>{branch.country}</Td>
                  <Td textColor={textColor}>{branch.phoneNumber}</Td>
                  <Td textColor={textColor}>{branch.searchRestrictions}</Td>
                  <Td textColor={textColor}>{branch.packages}</Td>
                  <Td textColor={textColor} align="center">
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: mutedColor,
                        padding: "4px",
                        display: "flex",
                        margin: "0 auto",
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: cardBg,
              borderRadius: "6px",
              width: "100%",
              maxWidth: "720px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "#C70039",
                color: "#FFFFFF",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Add New Branch</h3>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "24px 20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <Field label="Branch Name" mutedColor={mutedColor}>
                  <Input
                    value={form.branchName}
                    placeholder="Branch Name"
                    borderColor={borderColor}
                    inputBg={inputBg}
                    textColor={textColor}
                    onChange={(v) => updateForm("branchName", v)}
                  />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
                <Field label="Address 1" mutedColor={mutedColor}>
                  <Input value={form.address1} placeholder="Address 1" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("address1", v)} />
                </Field>
                <Field label="Address 2" mutedColor={mutedColor}>
                  <Input value={form.address2} placeholder="Address 2" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("address2", v)} />
                </Field>
                <Field label="City" mutedColor={mutedColor}>
                  <Input value={form.city} placeholder="City" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("city", v)} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
                <Field label="State" mutedColor={mutedColor}>
                  <Input value={form.state} placeholder="State" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("state", v)} />
                </Field>
                <Field label="Postcode" mutedColor={mutedColor}>
                  <Input value={form.postcode} placeholder="Postcode" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("postcode", v)} />
                </Field>
                <Field label="Country" mutedColor={mutedColor}>
                  <Input value={form.country} placeholder="Country" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("country", v)} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <Field label="Phone Number" mutedColor={mutedColor}>
                  <Input value={form.phoneNumber} placeholder="Phone Number" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("phoneNumber", v)} />
                </Field>
                <div />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <Field label="Email Distribution" mutedColor={mutedColor}>
                  <Input value={form.emailDistribution} placeholder="Email Distribution" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("emailDistribution", v)} />
                </Field>
                <Field label="Branch Invoice Email" mutedColor={mutedColor}>
                  <Input value={form.branchInvoiceEmail} placeholder="Branch Invoice Email" borderColor={borderColor} inputBg={inputBg} textColor={textColor} onChange={(v) => updateForm("branchInvoiceEmail", v)} />
                </Field>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Checkbox
                  label="Show Client Packages"
                  checked={form.showClientPackages}
                  onChange={(v) => updateForm("showClientPackages", v)}
                  textColor={textColor}
                />
                <Checkbox
                  label="Show Config Group Packages"
                  checked={form.showConfigGroupPackages}
                  onChange={(v) => updateForm("showConfigGroupPackages", v)}
                  textColor={textColor}
                />
              </div>
            </div>

            <div style={{ padding: "0 20px 24px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={handleSave}
                style={{
                  height: "36px",
                  padding: "0 28px",
                  background: "#C70039",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={closeModal}
                style={{
                  height: "36px",
                  padding: "0 28px",
                  background: "#2E1B85",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Td({
  children,
  textColor,
  align = "left",
}: {
  children: React.ReactNode;
  textColor: string;
  align?: "left" | "center";
}) {
  return (
    <td style={{ padding: "12px 16px", color: textColor, textAlign: align, whiteSpace: "nowrap" }}>{children}</td>
  );
}

function Field({
  label,
  children,
  mutedColor,
}: {
  label: string;
  children: React.ReactNode;
  mutedColor: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>{label}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  placeholder,
  borderColor,
  inputBg,
  textColor,
  onChange,
}: {
  value: string;
  placeholder?: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        height: "36px",
        padding: "0 12px",
        fontSize: "13px",
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        background: inputBg,
        color: textColor,
        boxSizing: "border-box",
      }}
    />
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  textColor,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  textColor: string;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: "#C70039", width: "14px", height: "14px", cursor: "pointer" }}
      />
      {label}
    </label>
  );
}
