import { useState, useRef, useEffect } from "react";
import { Eye, Upload, ChevronDown } from "lucide-react";
import { ORDERS, type SearchStatus, type OrderRecord, VERIFICATION_TYPES, US_STATES } from "../data/mockData";
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

interface Filters {
  searchId: string;
  reportId: string;
  status: string;
  searchType: string;
  firstName: string;
  lastName: string;
  ssn: string;
  dob: string;
  county: string;
  state: string;
  orderReference: string;
  orderDateFrom: string;
  orderDateTo: string;
  sortOrder: string;
  perPage: string;
  age: string;
  applicantEmail: string;
  criminalRecordsFound: string;
  orderedBy: string;
}

const EMPTY_FILTERS: Filters = {
  searchId: "", reportId: "", status: "", searchType: "",
  firstName: "", lastName: "", ssn: "", dob: "",
  county: "", state: "", orderReference: "",
  orderDateFrom: "", orderDateTo: "",
  sortOrder: "Status", perPage: "20",
  age: "", applicantEmail: "", criminalRecordsFound: "", orderedBy: "",
};

function getCellStyle(isDarkMode: boolean): React.CSSProperties {
  const t = getPageTheme(isDarkMode);
  return {
    background: t.inputBg,
    border: t.inputBorder,
    borderRadius: "4px",
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "58px",
    boxSizing: "border-box",
    position: "relative",
  };
}

function getCellLabelStyle(isDarkMode: boolean): React.CSSProperties {
  const t = getPageTheme(isDarkMode);
  return {
    fontSize: "12px",
    color: t.textMuted,
    fontWeight: 400,
    lineHeight: "1.2",
    marginBottom: "3px",
    textAlign: "left",
  };
}

function getInputElementStyle(isDarkMode: boolean): React.CSSProperties {
  const t = getPageTheme(isDarkMode);
  return {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
    fontSize: "14px",
    color: t.text,
    padding: "0",
    margin: "0",
    fontFamily: "inherit",
  };
}

function InputField({
  label,
  value,
  onChange,
  isDarkMode = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isDarkMode?: boolean;
}) {
  return (
    <div style={getCellStyle(isDarkMode)}>
      <label style={getCellLabelStyle(isDarkMode)}>{label}</label>
      <input
        style={getInputElementStyle(isDarkMode)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  isDarkMode?: boolean;
}

function CustomDropdown({ label, value, options, onChange, isDarkMode = false }: CustomDropdownProps) {
  const t = getPageTheme(isDarkMode);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
      style={{ ...getCellStyle(isDarkMode), cursor: "pointer" }}
    >
      <label style={getCellLabelStyle(isDarkMode)}>{label}</label>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", userSelect: "none" }}>
        <span
          style={{
            fontSize: "14px",
            color: t.text,
            fontWeight: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown size={14} style={{ color: t.textMuted, marginLeft: "4px", flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 2px)",
            left: "-1px",
            width: "calc(100% + 2px)",
            background: t.cardBg,
            border: t.inputBorder,
            borderRadius: "4px",
            boxSizing: "border-box",
            zIndex: 1000,
            maxHeight: "240px",
            overflowY: "auto",
            boxShadow: isDarkMode ? "0 4px 6px rgba(0,0,0,0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <DropdownItem
                key={opt.value}
                label={opt.label}
                isSelected={isSelected}
                isDarkMode={isDarkMode}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  label,
  isSelected,
  onClick,
  isDarkMode = false,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isDarkMode?: boolean;
}) {
  const t = getPageTheme(isDarkMode);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "8px 12px",
        fontSize: "14px",
        fontFamily: "'Wix Madefor Display', sans-serif",
        color: isHovered || isSelected ? "#FFFFFF" : t.textSecondary,
        background: isHovered || isSelected ? (isDarkMode ? "#4B5563" : "#7b7b7b") : t.cardBg,
        cursor: "pointer",
        transition: "background 0.1s ease, color 0.1s ease",
      }}
    >
      {label}
    </div>
  );
}

const BADGE_STYLES: Record<SearchStatus, { bg: string; color: string; border: string }> = {
  CANCELLED: { bg: "#EBF5FF", color: "#0066CC", border: "#C4E1FF" },
  CLOSED: { bg: "#FDE8E8", color: "#C81E1E", border: "#F8B4B4" },
  PENDING: { bg: "#FEF08A", color: "#854D0E", border: "#FDE047" },
  "IN PROGRESS": { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
};

const STATUS_OPTIONS = [
  { value: "", label: "Any Status" },
  { value: "Draft", label: "Draft" },
  { value: "Pending", label: "Pending" },
  { value: "Closed", label: "Closed" },
  { value: "Record", label: "Record" },
];

const SORT_ORDER_OPTIONS = [
  { value: "Status", label: "Status" },
  { value: "Search ID", label: "Search ID" },
  { value: "Search ID (High to Low)", label: "Search ID (High to Low)" },
  { value: "Order Date", label: "Order Date" },
  { value: "Order Date(Newest to Oldest)", label: "Order Date(Newest to Oldest)" },
];

const PER_PAGE_OPTIONS = [
  { value: "20", label: "20 Searches" },
  { value: "10", label: "10 Searches" },
  { value: "50", label: "50 Searches" },
  { value: "100", label: "100 Searches" },
];

const AGE_OPTIONS = [
  { value: "", label: "All" },
  { value: "Up to 24 Hours Old", label: "Up to 24 Hours Old" },
  { value: "24 to 48 Hours Old", label: "24 to 48 Hours Old" },
  { value: "48 to 72 Hours Old", label: "48 to 72 Hours Old" },
  { value: "Over 72 Hours", label: "Over 72 Hours" },
];

const CRIMINAL_RECORDS_OPTIONS = [
  { value: "", label: "All" },
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

const ORDERED_BY_OPTIONS = [
  { value: "", label: "All Users" },
  { value: "Suresh Ramakoti", label: "Suresh Ramakoti" },
  { value: "Admin User", label: "Admin User" },
];

const STATE_OPTIONS = [
  { value: "", label: "Select State" },
  ...US_STATES.map((s) => ({ value: s, label: s })),
];

const SEARCH_TYPE_OPTIONS = [
  { value: "", label: "All Searches" },
  { value: "Drug Screening 4 Panel (LabCorp)", label: "Drug Screening 4 Panel (LabCorp)" },
  { value: "Drug Screening 5 Panel with Nicotine", label: "Drug Screening 5 Panel with Nicotine" },
  { value: "Education Verification", label: "Education Verification" },
  { value: "Employment Verification", label: "Employment Verification" },
  { value: "ES - 10 Panel (1906)", label: "ES - 10 Panel (1906)" },
  { value: "ES - 10 Panel (1918)", label: "ES - 10 Panel (1918)" },
  { value: "ES - 10 Panel 6AM (2249)", label: "ES - 10 Panel 6AM (2249)" },
  { value: "ES - 10 Panel 6AM/ EXBNZ/ MDMA/ EXOPI/ OXY (6728)", label: "ES - 10 Panel 6AM/ EXBNZ/ MDMA/ EXOPI/ OXY (6728)" },
  { value: "ES - 10 Panel 6AM/ HYDO/ OXY/ MDMA (4089)", label: "ES - 10 Panel 6AM/ HYDO/ OXY/ MDMA (4089)" },
  { value: "ES - 10 Panel 6AM/ OXY/ MEP/ MDMA (3462)", label: "ES - 10 Panel 6AM/ OXY/ MEP/ MDMA (3462)" },
  { value: "ES - 10 Panel ALCOHOL (1208)", label: "ES - 10 Panel ALCOHOL (1208)" },
  { value: "ES - 10 Panel ALCOHOL/ FENT/ MEP/ EXT OPI (4007)", label: "ES - 10 Panel ALCOHOL/ FENT/ MEP/ EXT OPI (4007)" },
  { value: "ES - 10 Panel BUP/ FENT/ MDMA/ MEP/ EXP OPI/ OXY/ TCA/ TRAM (7127)", label: "ES - 10 Panel BUP/ FENT/ MDMA/ MEP/ EXP OPI/ OXY/ TCA/ TRAM (7127)" },
  { value: "ES - 10 Panel BUP/ OXY (2303)", label: "ES - 10 Panel BUP/ OXY (2303)" },
  { value: "ES - 10 Panel COT/ EXP OPI/ ALCOHOL (3485)", label: "ES - 10 Panel COT/ EXP OPI/ ALCOHOL (3485)" },
  { value: "ES - 10 Panel Custom Drug Test", label: "ES - 10 Panel Custom Drug Test" },
  { value: "ES - 10 Panel EXP OPI/ OXY (1910)", label: "ES - 10 Panel EXP OPI/ OXY (1910)" },
  { value: "ES - 10 Panel FEN (8596)", label: "ES - 10 Panel FEN (8596)" },
  { value: "ES - 10 Panel Hair/EXP OPI (H10P)", label: "ES - 10 Panel Hair/EXP OPI (H10P)" },
  { value: "ES - 10 Panel MDMA/ BATHSALTS (3324)", label: "ES - 10 Panel MDMA/ BATHSALTS (3324)" },
  { value: "ES - 10 Panel NO THC/ 6AM/ EXP OPI (4225)", label: "ES - 10 Panel NO THC/ 6AM/ EXP OPI (4225)" },
  { value: "ES - 10 Panel NO THC/ 6AM/ MEQ (4111)", label: "ES - 10 Panel NO THC/ 6AM/ MEQ (4111)" },
  { value: "ES - 10 Panel NO THC/ EXP OPI (6664)", label: "ES - 10 Panel NO THC/ EXP OPI (6664)" },
  { value: "ES - 10 Panel NO THC/ MEQ (4343)", label: "ES - 10 Panel NO THC/ MEQ (4343)" },
  { value: "ES - 10 Panel NO THC/ OXY/ EXP OPI (3477)", label: "ES - 10 Panel NO THC/ OXY/ EXP OPI (3477)" },
  { value: "ES - 10 Panel NO THC/ OXY/ MDMA (4691)", label: "ES - 10 Panel NO THC/ OXY/ MDMA (4691)" },
  { value: "ES - 10 Panel Standard (1204)", label: "ES - 10 Panel Standard (1204)" },
  { value: "ES - 10-Panel NICOTINE (1224)", label: "ES - 10-Panel NICOTINE (1224)" },
  { value: "ES - 11 Panel ALCOHOL/ FENT/ EXP OPI (8548)", label: "ES - 11 Panel ALCOHOL/ FENT/ EXP OPI (8548)" },
  { value: "ES - 11 Panel ExpOPI/NOTHC/OXY/ECS/FEN/TRAM", label: "ES - 11 Panel ExpOPI/NOTHC/OXY/ECS/FEN/TRAM" },
  { value: "ES - 11 Panel No THC/ 6AM/ Exp Opi (8145)", label: "ES - 11 Panel No THC/ 6AM/ Exp Opi (8145)" },
  { value: "ES - 11 Panel NO THC/ FENT/ OXY (6405)", label: "ES - 11 Panel NO THC/ FENT/ OXY (6405)" },
  { value: "ES - 12 Panel NO THC/ MDMA/ OXY/ 6AM (4137)", label: "ES - 12 Panel NO THC/ MDMA/ OXY/ 6AM (4137)" },
  { value: "ES - 16 Panel 6AM/ ALCOHOL/ FEN/ MEP/ OXY/ TRAM (6605)", label: "ES - 16 Panel 6AM/ ALCOHOL/ FEN/ MEP/ OXY/ TRAM (6605)" },
  { value: "ES - 3DR HYCD MDMA/6AM", label: "ES - 3DR HYCD MDMA/6AM" },
  { value: "ES - 4 Panel 6AM/ FENT/ MDMA (6276)", label: "ES - 4 Panel 6AM/ FENT/ MDMA (6276)" },
  { value: "ES - 4 Panel NO THC (1687)", label: "ES - 4 Panel NO THC (1687)" },
  { value: "ES - 4 Panel NO THC/ 6AM/ HYD/ MDMA/ OXY (3488)", label: "ES - 4 Panel NO THC/ 6AM/ HYD/ MDMA/ OXY (3488)" },
  { value: "ES - 5 Panel Alcohol (2447)", label: "ES - 5 Panel Alcohol (2447)" },
  { value: "ES - 5 Panel Hair EXP OPI (H5PEO)", label: "ES - 5 Panel Hair EXP OPI (H5PEO)" },
  { value: "ES - 5 Panel NO THC/ EXP OPI/ ALCOHOL (4645)", label: "ES - 5 Panel NO THC/ EXP OPI/ ALCOHOL (4645)" },
  { value: "ES - 5 Panel Standard (1200)", label: "ES - 5 Panel Standard (1200)" },
  { value: "ES - 6 Panel (2275)", label: "ES - 6 Panel (2275)" },
  { value: "ES - 6 Panel Standard (3121)", label: "ES - 6 Panel Standard (3121)" },
  { value: "ES - 7 Panel", label: "ES - 7 Panel" },
  { value: "ES - 7 Panel (5DSP/OXY/PHN)", label: "ES - 7 Panel (5DSP/OXY/PHN)" },
  { value: "ES - 7 Panel 6AM (2267)", label: "ES - 7 Panel 6AM (2267)" },
  { value: "ES - 7 Panel 6AM/ BUP/ FENT/ MDMA/ EXP OPI/ OXY/ TRAM (5268)", label: "ES - 7 Panel 6AM/ BUP/ FENT/ MDMA/ EXP OPI/ OXY/ TRAM (5268)" },
  { value: "ES - 7 Panel FENT/ BUP (2304)", label: "ES - 7 Panel FENT/ BUP (2304)" },
  { value: "ES - 7 Panel MDMA/ EXP OPI/ OXY/ TCA (7116)", label: "ES - 7 Panel MDMA/ EXP OPI/ OXY/ TCA (7116)" },
  { value: "ES - 7 Panel NO THC (2480)", label: "ES - 7 Panel NO THC (2480)" },
  { value: "ES - 7 Panel NO THC/ BUP/ MDMA/ OXY/ TCA (3249)", label: "ES - 7 Panel NO THC/ BUP/ MDMA/ OXY/ TCA (3249)" },
  { value: "ES - 7 Panel OXY/ MDMA (3124)", label: "ES - 7 Panel OXY/ MDMA (3124)" },
  { value: "ES - 7 Panel Plus MDMA", label: "ES - 7 Panel Plus MDMA" },
  { value: "ES - 7 Panel Standard (1203)", label: "ES - 7 Panel Standard (1203)" },
  { value: "ES - 8 Panel", label: "ES - 8 Panel" },
  { value: "ES - 8 Panel 6AM/ MDMA/ MEQ/ OXY/ NO THC (6480)", label: "ES - 8 Panel 6AM/ MDMA/ MEQ/ OXY/ NO THC (6480)" },
  { value: "ES - 8 Panel BUP/ MDMA/ OXY (4163)", label: "ES - 8 Panel BUP/ MDMA/ OXY (4163)" },
  { value: "ES - 8 Panel FENT/ EXP OPI (4686)", label: "ES - 8 Panel FENT/ EXP OPI (4686)" },
  { value: "ES - 8 Panel HYCD/ MDMA/ OXY (6477)", label: "ES - 8 Panel HYCD/ MDMA/ OXY (6477)" },
  { value: "ES - 8 Panel NO THC/ 6AM (4249)", label: "ES - 8 Panel NO THC/ 6AM (4249)" },
  { value: "ES - 8 Panel NO THC/ 6AM/ MEQ (6766)", label: "ES - 8 Panel NO THC/ 6AM/ MEQ (6766)" },
  { value: "ES - 8 Panel NO THC/ BUP/ MDMA/ MEQ/ OXY (8825)", label: "ES - 8 Panel NO THC/ BUP/ MDMA/ MEQ/ OXY (8825)" },
  { value: "ES - 8 Panel NO THC/ OXY/ MEP (7108)", label: "ES - 8 Panel NO THC/ OXY/ MEP (7108)" },
  { value: "ES - 8 Panel OXY/ 6AM/ MDMA (2333)", label: "ES - 8 Panel OXY/ 6AM/ MDMA (2333)" },
  { value: "ES - 8 Panel Standard (3123)", label: "ES - 8 Panel Standard (3123)" },
  { value: "ES - 9 Panel 6AM/ FENT/ MDMA/ OXY (4758)", label: "ES - 9 Panel 6AM/ FENT/ MDMA/ OXY (4758)" },
  { value: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ EXP OPI/ OXY (8542)", label: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ EXP OPI/ OXY (8542)" },
  { value: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ FENT/ EXP OPI/ OXY (8244)", label: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ FENT/ EXP OPI/ OXY (8244)" },
  { value: "ES - 9 Panel 6AM/ OXY/ MDMA (6829)", label: "ES - 9 Panel 6AM/ OXY/ MDMA (6829)" },
  { value: "ES - 9 Panel 6AM/ OXY/ MEP (4520)", label: "ES - 9 Panel 6AM/ OXY/ MEP (4520)" },
  { value: "ES - 9 Panel BUP/ MDMA/ OXY/ TCA (4715)", label: "ES - 9 Panel BUP/ MDMA/ OXY/ TCA (4715)" },
  { value: "ES - 9 Panel FENT/ EXOPI (6902)", label: "ES - 9 Panel FENT/ EXOPI (6902)" },
  { value: "ES - 9 Panel FENT/ MEP/ MEQ/ OXY/ TRAM (6544)", label: "ES - 9 Panel FENT/ MEP/ MEQ/ OXY/ TRAM (6544)" },
  { value: "ES - 9 Panel NO THC (1790)", label: "ES - 9 Panel NO THC (1790)" },
  { value: "ES - 9 Panel NO THC (6599)", label: "ES - 9 Panel NO THC (6599)" },
  { value: "ES - 9 Panel NO THC/ OXY (7027)", label: "ES - 9 Panel NO THC/ OXY (7027)" },
  { value: "ES - 9 Panel NO THC/ OXY (8798)", label: "ES - 9 Panel NO THC/ OXY (8798)" },
  { value: "ES - 9 Panel OXY/ MDMA/ OPIEX (4190)", label: "ES - 9 Panel OXY/ MDMA/ OPIEX (4190)" },
  { value: "ES - 9 Panel Standard (1205)", label: "ES - 9 Panel Standard (1205)" },
  { value: "ES - 9DSP/EXP OPI/Custom Levels/OXY/ECS/PHN", label: "ES - 9DSP/EXP OPI/Custom Levels/OXY/ECS/PHN" },
  { value: "ES - ALCOHOL", label: "ES - ALCOHOL" },
  { value: "ES - Audiogram", label: "ES - Audiogram" },
  { value: "ES - Chest X-Ray (1 or 2 Views)", label: "ES - Chest X-Ray (1 or 2 Views)" },
  { value: "ES - Chest X-Ray (2 Views)", label: "ES - Chest X-Ray (2 Views)" },
  { value: "ES - DOT Alcohol (BAT)", label: "ES - DOT Alcohol (BAT)" },
  { value: "ES - DOT Drug Test", label: "ES - DOT Drug Test" },
  { value: "ES - DOT Physical", label: "ES - DOT Physical" },
  { value: "ES - DOT Physical Recertification", label: "ES - DOT Physical Recertification" },
  { value: "ES - DOT Urine Test", label: "ES - DOT Urine Test" },
  { value: "ES - Hep A Titer", label: "ES - Hep A Titer" },
  { value: "ES - Hep A Vaccine #1", label: "ES - Hep A Vaccine #1" },
  { value: "ES - Hep A Vaccine #2", label: "ES - Hep A Vaccine #2" },
  { value: "ES - Hep B Surface Antigen ΓÇô (Screen for Acute/Chronic Disease)", label: "ES - Hep B Surface Antigen ΓÇô (Screen for Acute/Chronic Disease)" },
  { value: "ES - Hep B Titer", label: "ES - Hep B Titer" },
  { value: "ES - Hep B Vaccine #1", label: "ES - Hep B Vaccine #1" },
  { value: "ES - Hep B Vaccine #2", label: "ES - Hep B Vaccine #2" },
  { value: "ES - Hep B Vaccine #3", label: "ES - Hep B Vaccine #3" },
  { value: "ES - Hep C Titer", label: "ES - Hep C Titer" },
  { value: "ES - Influenza Vaccine", label: "ES - Influenza Vaccine" },
  { value: "ES - Lift Test", label: "ES - Lift Test" },
  { value: "ES - MMR Titer", label: "ES - MMR Titer" },
  { value: "ES - MMR Vaccine", label: "ES - MMR Vaccine" },
  { value: "ES - MMR Vaccine #2", label: "ES - MMR Vaccine #2" },
  { value: "ES - Mumps Antibody (IgG)", label: "ES - Mumps Antibody (IgG)" },
  { value: "ES - Non DOT Alcohol (BAT)", label: "ES - Non DOT Alcohol (BAT)" },
  { value: "ES - Non-DOT Physical", label: "ES - Non-DOT Physical" },
  { value: "ES - Oral 10 Panel BUP/ MDMA (6037)", label: "ES - Oral 10 Panel BUP/ MDMA (6037)" },
  { value: "ES - Oral 10 Panel EXP OPI/ MDMA (6036)", label: "ES - Oral 10 Panel EXP OPI/ MDMA (6036)" },
  { value: "ES - Oral 10 Panel MDMA/ ALCOHOL (6043)", label: "ES - Oral 10 Panel MDMA/ ALCOHOL (6043)" },
  { value: "ES - Oral 5 Panel (6008)", label: "ES - Oral 5 Panel (6008)" },
  { value: "ES - Oral 6 Panel MDMA/ OXY (6002)", label: "ES - Oral 6 Panel MDMA/ OXY (6002)" },
  { value: "ES - Oral Fluid Drug Screen", label: "ES - Oral Fluid Drug Screen" },
  { value: "ES - Oral Swab Kits", label: "ES - Oral Swab Kits" },
  { value: "ES - Oral THC (6051)", label: "ES - Oral THC (6051)" },
  { value: "ES - OSHA Respirator Questionnaire", label: "ES - OSHA Respirator Questionnaire" },
  { value: "ES - Pulmonary Function Test/Spirometry", label: "ES - Pulmonary Function Test/Spirometry" },
  { value: "ES - Respirator Fit Test, Qualitative", label: "ES - Respirator Fit Test, Qualitative" },
  { value: "ES - Respirator Fit Test, Quantitative", label: "ES - Respirator Fit Test, Quantitative" },
  { value: "ES - Rubella Antibody (IgG)", label: "ES - Rubella Antibody (IgG)" },
  { value: "ES - TB Chest X-Ray", label: "ES - TB Chest X-Ray" },
  { value: "ES - TB/PPD Skin Test - 1 Step Only", label: "ES - TB/PPD Skin Test - 1 Step Only" },
  { value: "ES - TB/PPD Test 1", label: "ES - TB/PPD Test 1" },
  { value: "ES - TB/PPD Test 2", label: "ES - TB/PPD Test 2" },
  { value: "ES - TDAP", label: "ES - TDAP" },
  { value: "ES - TSPOT/TB Blood Test", label: "ES - TSPOT/TB Blood Test" },
  { value: "ES - Urine Fentanyl Only", label: "ES - Urine Fentanyl Only" },
  { value: "ES - Varicella Titer", label: "ES - Varicella Titer" },
  { value: "ES - Varicella Vaccine", label: "ES - Varicella Vaccine" },
  { value: "ES - Varicella Vaccine #2", label: "ES - Varicella Vaccine #2" },
  { value: "ES - Vision Test, Ishihara", label: "ES - Vision Test, Ishihara" },
  { value: "ES - Vision Test, Jaeger", label: "ES - Vision Test, Jaeger" },
  { value: "ES - Vision Test, Snellen", label: "ES - Vision Test, Snellen" },
  { value: "ES - Vision Test, Titmus", label: "ES - Vision Test, Titmus" }
];

export function AllOrderDetails({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const t = getPageTheme(isDarkMode);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [searched, setSearched] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [expandedSearchId, setExpandedSearchId] = useState<string | null>(null);

  function set(key: keyof Filters, val: string) {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }

  function handleSearch() {
    setApplied(filters);
    setPage(1);
    setSearched(true);
    setShowAlert(true);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
    setSearched(true);
    setShowAlert(true);
  }

  const perPage = parseInt(applied.perPage || "20");

  const filtered = ORDERS.filter((o) => {
    if (applied.searchId && !o.searchId.toLowerCase().includes(applied.searchId.toLowerCase())) return false;
    if (applied.reportId && !o.reportId.toLowerCase().includes(applied.reportId.toLowerCase())) return false;
    
    // Status mapping case-insensitively
    if (applied.status && o.status.toLowerCase() !== applied.status.toLowerCase()) return false;
    
    if (applied.searchType && o.verificationType !== applied.searchType) return false;
    if (applied.firstName && !o.applicantName.split(" ")[0].toLowerCase().includes(applied.firstName.toLowerCase())) return false;
    if (applied.lastName && !o.applicantName.split(" ").slice(-1)[0].toLowerCase().includes(applied.lastName.toLowerCase())) return false;
    if (applied.state && o.state && !o.state.toLowerCase().includes(applied.state.toLowerCase())) return false;
    if (applied.county && o.county && !o.county.toLowerCase().includes(applied.county.toLowerCase())) return false;
    if (applied.orderedBy && !o.orderedBy.toLowerCase().includes(applied.orderedBy.toLowerCase())) return false;
    if (applied.orderDateFrom && o.orderDate < applied.orderDateFrom) return false;
    if (applied.orderDateTo && o.orderDate > applied.orderDateTo) return false;

    // New fields filtering:
    if (applied.applicantEmail && o.applicantEmail && !o.applicantEmail.toLowerCase().includes(applied.applicantEmail.toLowerCase())) return false;
    if (applied.criminalRecordsFound) {
      const hasRecords = o.criminalRecordsFound && o.criminalRecordsFound !== "None";
      if (applied.criminalRecordsFound === "yes" && !hasRecords) return false;
      if (applied.criminalRecordsFound === "no" && hasRecords) return false;
    }
    
    // Age of order in hours:
    if (applied.age) {
      const orderDate = new Date(o.orderDate);
      const now = new Date();
      const diffMs = now.getTime() - orderDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (applied.age === "Up to 24 Hours Old") {
        if (diffHours > 24) return false;
      } else if (applied.age === "24 to 48 Hours Old") {
        if (diffHours < 24 || diffHours > 48) return false;
      } else if (applied.age === "48 to 72 Hours Old") {
        if (diffHours < 48 || diffHours > 72) return false;
      } else if (applied.age === "Over 72 Hours") {
        if (diffHours <= 72) return false;
      }
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (applied.sortOrder === "Status") {
      return a.status.localeCompare(b.status);
    } else if (applied.sortOrder === "Search ID") {
      return a.searchId.localeCompare(b.searchId);
    } else if (applied.sortOrder === "Search ID (High to Low)") {
      return b.searchId.localeCompare(a.searchId);
    } else if (applied.sortOrder === "Order Date") {
      return a.orderDate.localeCompare(b.orderDate);
    } else if (applied.sortOrder === "Order Date(Newest to Oldest)") {
      return b.orderDate.localeCompare(a.orderDate);
    }
    return b.searchId.localeCompare(a.searchId);
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const searchTypeOptions = SEARCH_TYPE_OPTIONS;

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
          background: t.contentBg,
          overflowY: "auto",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: t.title,
            marginBottom: "14px",
          }}
        >
          All Order Details
        </h1>

        {/* ΓöÇΓöÇ Filters Grid ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          {/* Row 1 */}
          <InputField label="Search ID" value={filters.searchId} onChange={(val) => set("searchId", val)} isDarkMode={isDarkMode} />
          <InputField label="Report ID" value={filters.reportId} onChange={(val) => set("reportId", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(val) => set("status", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Search Type / Name" value={filters.searchType} options={searchTypeOptions} onChange={(val) => set("searchType", val)} isDarkMode={isDarkMode} />

          {/* Row 2 */}
          <InputField label="First Name" value={filters.firstName} onChange={(val) => set("firstName", val)} isDarkMode={isDarkMode} />
          <InputField label="Last Name" value={filters.lastName} onChange={(val) => set("lastName", val)} isDarkMode={isDarkMode} />
          <InputField label="SSN" value={filters.ssn} onChange={(val) => set("ssn", val)} isDarkMode={isDarkMode} />
          <InputField label="DOB" value={filters.dob} onChange={(val) => set("dob", val)} isDarkMode={isDarkMode} />

          {/* Row 3 */}
          <InputField label="County" value={filters.county} onChange={(val) => set("county", val)} isDarkMode={isDarkMode} />
          <InputField label="State" value={filters.state} onChange={(val) => set("state", val)} isDarkMode={isDarkMode} />
          <InputField label="Order Reference" value={filters.orderReference} onChange={(val) => set("orderReference", val)} isDarkMode={isDarkMode} />
          <InputField label="Order Date From" value={filters.orderDateFrom} onChange={(val) => set("orderDateFrom", val)} isDarkMode={isDarkMode} />

          {/* Row 4 */}
          <InputField label="Order Date To" value={filters.orderDateTo} onChange={(val) => set("orderDateTo", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Sort Order" value={filters.sortOrder} options={SORT_ORDER_OPTIONS} onChange={(val) => set("sortOrder", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Searches per page" value={filters.perPage} options={PER_PAGE_OPTIONS} onChange={(val) => set("perPage", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Age" value={filters.age} options={AGE_OPTIONS} onChange={(val) => set("age", val)} isDarkMode={isDarkMode} />

          {/* Row 5 */}
          <InputField label="Applicant Email" value={filters.applicantEmail} onChange={(val) => set("applicantEmail", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Criminal Records Found" value={filters.criminalRecordsFound} options={CRIMINAL_RECORDS_OPTIONS} onChange={(val) => set("criminalRecordsFound", val)} isDarkMode={isDarkMode} />
          <CustomDropdown label="Ordered By" value={filters.orderedBy} options={ORDERED_BY_OPTIONS} onChange={(val) => set("orderedBy", val)} isDarkMode={isDarkMode} />
        </div>

        {/* ΓöÇΓöÇ Buttons ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={handleSearch}
            style={{
              background: "#C70039",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Search
          </button>
          <button
            onClick={handleReset}
            style={{
              background: t.cardBg,
              color: t.link,
              border: `1px solid ${t.link}`,
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* ΓöÇΓöÇ Green success alert banner ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        {searched && showAlert && sorted.length > 0 && (
          <div
            style={{
              background: "#E6F0CD", // Olive-ish light green from screenshot
              border: "1px solid #D4E0B6",
              borderRadius: "4px",
              padding: "10px 16px",
              color: "#5B7A38",
              fontSize: "13px",
              fontWeight: 500,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              {sorted.length} Records Found. Page {page} of {Math.max(1, totalPages)}
            </div>
            <button
              onClick={() => setShowAlert(false)}
              style={{
                background: "none",
                border: "none",
                color: "#2E7D32",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              Γ£ò
            </button>
          </div>
        )}

        {/* ΓöÇΓöÇ Red "No records found." Centered Banner ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        {searched && sorted.length === 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              color: t.title,
              margin: "24px 0",
              fontFamily: "'Wix Madefor Display', sans-serif",
            }}
          >
            No records found.
          </div>
        )}

        {/* ΓöÇΓöÇ Search Results Card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        {searched && sorted.length > 0 && (
          <div
            style={{
              background: t.cardBg,
              border: t.cardBorder,
              borderRadius: "4px",
              boxShadow: t.cardShadow,
              marginBottom: "20px",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px",
                background: isDarkMode ? t.tableHeadBg : t.contentBg,
                borderBottom: t.tableRowBorder,
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: t.textMuted,
                }}
              >
                Search Results
              </span>

              {/* Page select dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "13px", color: t.textMuted }}>Page:</span>
                <select
                  value={page}
                  onChange={(e) => setPage(parseInt(e.target.value))}
                  style={{
                    background: t.inputBg,
                    border: t.inputBorder,
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "2px 20px 2px 8px",
                    color: t.text,
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='${isDarkMode ? "%239CA3AF" : "%23555555"}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 6px center",
                  }}
                >
                  {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Body */}
            <div>
              {paginated.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    fontSize: "12px",
                    color: t.textMuted,
                  }}
                >
                  No records match your filters.
                </div>
              ) : (
                paginated.map((o, idx) => (
                  <div key={o.searchId} style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      onClick={() => setExpandedSearchId(expandedSearchId === o.searchId ? null : o.searchId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 16px",
                        borderBottom: t.tableRowBorder,
                        background: idx % 2 === 0 ? t.tableRowEven : t.tableRowOdd,
                        cursor: "pointer",
                      }}
                    >
                      {/* Left: Search ID */}
                      <div style={{ fontSize: "13px", width: "160px" }}>
                        <span style={{ color: t.textMuted, fontWeight: 400 }}>Search ID: </span>
                        <span style={{ color: t.textSecondary, fontWeight: 600 }}>{o.searchId}</span>
                      </div>

                      {/* Center: Applicant name + Verification type */}
                      <div style={{ fontSize: "13px", flex: 1, textAlign: "left", paddingLeft: "20px" }}>
                        <span style={{ color: t.textSecondary, fontWeight: 600 }}>{o.applicantName}</span>
                        <span style={{ color: t.textMuted }}> : {o.verificationType}</span>
                      </div>

                      {/* Right: Status badge */}
                      <div>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                    {expandedSearchId === o.searchId && (
                      <div style={{ padding: "16px 20px", background: t.cardBg, borderBottom: t.tableRowBorder, fontSize: "12px", color: t.textSecondary }}>
                        {/* Row 1: Order Details */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", background: isDarkMode ? t.tableHeadBg : t.contentBg, padding: "10px", marginBottom: "16px", color: t.heading }}>
                          <div><strong style={{ fontWeight: 600 }}>Order Date:</strong> {o.orderDate}</div>
                          <div><strong style={{ fontWeight: 600 }}>DOB:</strong> {o.dob || "05/17/1996"}</div>
                          <div><strong style={{ fontWeight: 600 }}>SSN:</strong> {o.ssn || "111-11-1111"}</div>
                          <div><strong style={{ fontWeight: 600 }}>Location:</strong> {o.county ? `${o.county}, ` : ""}{o.state || "El Paso, TX 79999"}</div>
                        </div>

                        {/* Row 2: Links */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                          <div style={{ color: t.textSecondary }}>Order by: {o.orderedBy}</div>
                          <div style={{ color: t.link, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Report #{o.reportId}
                          </div>
                          <div style={{ color: t.link, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Search #{o.searchId}
                          </div>
                          <div style={{ color: t.link, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Pricing
                          </div>
                        </div>

                        {/* Row 3: Links */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                          <div style={{ color: t.link, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Upload size={13} /> Upload Document
                          </div>
                          <div style={{ color: t.link, cursor: "pointer" }}>+ Add Search to this Report</div>
                          <div style={{ gridColumn: "3 / 5", color: t.link, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={13} /> View Employment Verification Info
                          </div>
                        </div>

                        {/* Files Uploaded Section */}
                        <div style={{ background: isDarkMode ? t.badgeBg : "#D9D9D9", padding: "6px 12px", fontWeight: 600, color: t.heading, marginBottom: "12px" }}>
                          FILES UPLOADED
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", paddingLeft: "12px", color: t.textSecondary }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>#1 Authorization_Disclosure_Form_{o.applicantName.replace(" ", "_")}_07-15-2025.pdf</span>
                            <span style={{ color: t.textMuted }}>Type: PDF | E-Signed on: 2025-07-15 13:54:18 - Online (Order /w Invite)</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>#2 Authorization_Disclosure_Form_Suresh_Kumar_01-18-2024.pdf</span>
                            <span style={{ color: t.textMuted }}>Type: PDF | E-Signed on: 2024-01-18 14:12:51 - Online (Order /w Invite Process)</span>
                          </div>
                        </div>

                        {/* Upload File Section */}
                        <div style={{ background: isDarkMode ? t.badgeBg : "#D9D9D9", padding: "6px 12px", fontWeight: 600, color: t.heading, marginBottom: "12px" }}>
                          SELECT A FILE TO UPLOAD
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "12px" }}>
                          <div>
                            <input type="file" id={`upload-${o.searchId}`} style={{ display: "none" }} />
                            <label htmlFor={`upload-${o.searchId}`} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ padding: "6px 16px", border: t.inputBorder, background: t.inputBg, borderRadius: "3px", color: t.text }}>Choose File</div>
                              <span style={{ color: t.textMuted }}>No file chosen</span>
                            </label>
                            <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "8px" }}>Allowed File Extensions: jpg/jpeg, png, doc/docx, pdf</div>
                          </div>
                          <div>
                            <button style={{ background: t.link, color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
                              Upload File <Upload size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

function StatusBadge({ status }: { status: SearchStatus }) {
  const s = BADGE_STYLES[status] || { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "3px",
        fontSize: "10px",
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",

        letterSpacing: "0.02em",
      }}
    >
      {status}
    </span>
  );
}
