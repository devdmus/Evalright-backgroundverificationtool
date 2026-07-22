import { useState } from "react";
import { Save } from "lucide-react";
import { AVAILABLE_SEARCHES, BILLING_INFO } from "../data/mockData";

interface ClientBillingTabProps {
  isDarkMode?: boolean;
}

export function ClientBillingTab({ isDarkMode = false }: ClientBillingTabProps) {
  const [billing, setBilling] = useState(BILLING_INFO);
  const [available, setAvailable] = useState<string[]>(AVAILABLE_SEARCHES);
  const [feeCharged, setFeeCharged] = useState<string[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedFeeCharged, setSelectedFeeCharged] = useState<string[]>([]);

  const cardBg = isDarkMode ? "#252830" : "#FFFFFF";
  const borderColor = isDarkMode ? "#333333" : "#E5E7EB";
  const textColor = isDarkMode ? "#E5E7EB" : "#333333";
  const mutedColor = isDarkMode ? "#9CA3AF" : "#888888";
  const sectionBg = isDarkMode ? "#6B7280" : "#9E9E9E";
  const inputBg = isDarkMode ? "#1A1C21" : "#FFFFFF";

  function moveToFeeCharged() {
    if (selectedAvailable.length === 0) return;
    setFeeCharged((prev) => [...prev, ...selectedAvailable].sort());
    setAvailable((prev) => prev.filter((s) => !selectedAvailable.includes(s)));
    setSelectedAvailable([]);
  }

  function moveToAvailable() {
    if (selectedFeeCharged.length === 0) return;
    setAvailable((prev) => [...prev, ...selectedFeeCharged].sort());
    setFeeCharged((prev) => prev.filter((s) => !selectedFeeCharged.includes(s)));
    setSelectedFeeCharged([]);
  }

  function moveAllToFeeCharged() {
    setFeeCharged((prev) => [...prev, ...available].sort());
    setAvailable([]);
    setSelectedAvailable([]);
  }

  function moveAllToAvailable() {
    setAvailable((prev) => [...prev, ...feeCharged].sort());
    setFeeCharged([]);
    setSelectedFeeCharged([]);
  }

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <SectionHeader bg={sectionBg}>BILLING INFO</SectionHeader>
      <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 24px" }}>
        <Field label="Billing Contact" mutedColor={mutedColor}>
          <Input value={billing.billingContact} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="Phone Number" mutedColor={mutedColor}>
          <Input value={billing.phoneNumber} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="Billing Address 1" mutedColor={mutedColor}>
          <Input value={billing.billingAddress1} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="Billing Address 2" mutedColor={mutedColor}>
          <Input value={billing.billingAddress2} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="City" mutedColor={mutedColor}>
          <Input value={billing.city} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="State" mutedColor={mutedColor}>
          <Input value={billing.state} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="Zip" mutedColor={mutedColor}>
          <Input value={billing.zip} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
        <Field label="Sales Tax Rate" mutedColor={mutedColor} hint="Decimal format i.e. 8% = 0.08">
          <Input value={billing.salesTaxRate} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
        </Field>
      </div>

      <SectionHeader bg={sectionBg}>ACCOUNT CONFIGURATION</SectionHeader>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 24px", marginBottom: "16px" }}>
          <Field label="Pay Type" mutedColor={mutedColor}>
            <Select value={billing.payType} borderColor={borderColor} inputBg={inputBg} textColor={textColor}>
              <option>Open Account</option>
              <option>Prepaid</option>
              <option>Credit Card</option>
            </Select>
          </Field>
          <Field label="Account Limit" mutedColor={mutedColor}>
            <Input value={billing.accountLimit} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
          </Field>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "20px" }}>
          <Checkbox
            label="Client Pays Fees"
            checked={billing.clientPaysFees}
            onChange={(v) => setBilling((b) => ({ ...b, clientPaysFees: v }))}
          />
          <Checkbox
            label="Free Alias Searches"
            checked={billing.freeAliasSearches}
            onChange={(v) => setBilling((b) => ({ ...b, freeAliasSearches: v }))}
          />
          <Checkbox
            label="Auto Approve Invoices"
            checked={billing.autoApproveInvoices}
            onChange={(v) => setBilling((b) => ({ ...b, autoApproveInvoices: v }))}
          />
          <Checkbox
            label="Guarantee with Credit Card"
            checked={billing.guaranteeWithCreditCard}
            onChange={(v) => setBilling((b) => ({ ...b, guaranteeWithCreditCard: v }))}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: "16px", alignItems: "start" }}>
          <div>
            <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "6px" }}>Available Searches</label>
            <select
              multiple
              value={selectedAvailable}
              onChange={(e) => setSelectedAvailable(Array.from(e.target.selectedOptions, (o) => o.value))}
              style={{
                width: "100%",
                height: "220px",
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                fontSize: "12px",
                color: textColor,
                background: inputBg,
                padding: "4px",
              }}
            >
              {available.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "28px" }}>
            <TransferBtn onClick={moveAllToFeeCharged}>&gt;&gt;</TransferBtn>
            <TransferBtn onClick={moveToFeeCharged}>&gt;</TransferBtn>
            <TransferBtn onClick={moveToAvailable}>&lt;</TransferBtn>
            <TransferBtn onClick={moveAllToAvailable}>&lt;&lt;</TransferBtn>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "6px" }}>Fee Charged Searches</label>
            <select
              multiple
              value={selectedFeeCharged}
              onChange={(e) => setSelectedFeeCharged(Array.from(e.target.selectedOptions, (o) => o.value))}
              style={{
                width: "100%",
                height: "220px",
                border: `1px solid ${borderColor}`,
                borderRadius: "4px",
                fontSize: "12px",
                color: textColor,
                background: inputBg,
                padding: "4px",
              }}
            >
              {feeCharged.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <SectionHeader bg={sectionBg}>INVOICE / PAYMENT CONFIGURATION</SectionHeader>
      <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 24px" }}>
        <Field label="Payment Terms" mutedColor={mutedColor}>
          <Select value={billing.paymentTerms} borderColor={borderColor} inputBg={inputBg} textColor={textColor}>
            <option>Net30</option>
            <option>Net15</option>
            <option>On Receipt</option>
            <option>E-MAIL</option>
          </Select>
        </Field>
        <Field label="Invoice Pay Method" mutedColor={mutedColor}>
          <Select value={billing.invoicePayMethod} borderColor={borderColor} inputBg={inputBg} textColor={textColor}>
            <option>Check</option>
            <option>Credit Card</option>
            <option>ACH</option>
          </Select>
        </Field>
        <Field label="Invoice Type" mutedColor={mutedColor}>
          <Select value={billing.invoiceType} borderColor={borderColor} inputBg={inputBg} textColor={textColor}>
            <option>Detail</option>
            <option>Summary</option>
          </Select>
        </Field>
      </div>

      <SectionHeader bg={sectionBg}>INVOICE DELIVERY / ACCOUNTING LOGIN RESTRICTIONS</SectionHeader>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 24px", marginBottom: "16px" }}>
          <Field label="Invoice Delivery Method" mutedColor={mutedColor}>
            <Select value={billing.invoiceDeliveryMethod} borderColor={borderColor} inputBg={inputBg} textColor={textColor}>
              <option>E-MAIL</option>
              <option>Mail</option>
              <option>Fax</option>
            </Select>
          </Field>
          <Field label="Email Address" mutedColor={mutedColor} hint="Separate multiple emails with semicolon ;">
            <Input value={billing.emailAddress} borderColor={borderColor} inputBg={inputBg} textColor={textColor} readOnly />
          </Field>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          <Checkbox
            label="Delinquent invoice login block"
            checked={billing.delinquentInvoiceLoginBlock}
            onChange={(v) => setBilling((b) => ({ ...b, delinquentInvoiceLoginBlock: v }))}
          />
          <Checkbox
            label="Disable URLs in invoice emails"
            checked={billing.disableUrlsInInvoiceEmails}
            onChange={(v) => setBilling((b) => ({ ...b, disableUrlsInInvoiceEmails: v }))}
          />
        </div>
      </div>

      <SectionHeader bg={sectionBg}>OTHER</SectionHeader>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px" }}>
          <Checkbox
            label="Hide due invoices on home page (doesn't apply to Primary User)"
            checked={billing.hideDueInvoicesOnHomePage}
            onChange={(v) => setBilling((b) => ({ ...b, hideDueInvoicesOnHomePage: v }))}
          />
          <Checkbox
            label="Put all branches on same invoice"
            checked={billing.putAllBranchesOnSameInvoice}
            onChange={(v) => setBilling((b) => ({ ...b, putAllBranchesOnSameInvoice: v }))}
          />
          <Checkbox
            label="Show $25 Rush Order Option"
            checked={billing.showRushOrderOption}
            onChange={(v) => setBilling((b) => ({ ...b, showRushOrderOption: v }))}
          />
          <Checkbox
            label="Auto Late Invoice Login Disable"
            checked={billing.autoLateInvoiceLoginDisable}
            onChange={(v) => setBilling((b) => ({ ...b, autoLateInvoiceLoginDisable: v }))}
          />
          <Checkbox
            label="Send Failed Payment Notifications"
            checked={billing.sendFailedPaymentNotifications}
            onChange={(v) => setBilling((b) => ({ ...b, sendFailedPaymentNotifications: v }))}
          />
        </div>
      </div>

      <div style={{ padding: "24px 20px 28px", display: "flex", justifyContent: "center" }}>
        <button
          style={{
            height: "40px",
            padding: "0 28px",
            background: "#C70039",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Save size={16} />
          Update Information
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div
      style={{
        background: bg,
        color: "#FFFFFF",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.3px",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  mutedColor,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  mutedColor: string;
  hint?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: mutedColor, display: "block", marginBottom: "4px" }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: "10px", color: mutedColor, display: "block", marginTop: "4px" }}>{hint}</span>}
    </div>
  );
}

function Input({
  value,
  borderColor,
  inputBg,
  textColor,
  readOnly,
}: {
  value: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  readOnly?: boolean;
}) {
  return (
    <input
      value={value}
      readOnly={readOnly}
      style={{
        width: "100%",
        height: "34px",
        padding: "0 10px",
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

function Select({
  value,
  children,
  borderColor,
  inputBg,
  textColor,
}: {
  value: string;
  children: React.ReactNode;
  borderColor: string;
  inputBg: string;
  textColor: string;
}) {
  return (
    <select
      value={value}
      style={{
        width: "100%",
        height: "34px",
        padding: "0 10px",
        fontSize: "13px",
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        background: inputBg,
        color: textColor,
        boxSizing: "border-box",
      }}
    >
      {children}
    </select>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#333333", cursor: "pointer" }}>
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

function TransferBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: "32px",
        border: "1px solid #5B6ABF",
        background: "#FFFFFF",
        color: "#5B6ABF",
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
