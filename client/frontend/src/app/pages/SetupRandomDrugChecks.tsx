import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { Footer } from "../components/Footer";

interface Employee {
  name: string;
  birthdate: string;
  ssn: string;
  address: string;
  zipCode: string;
  email: string;
}

const EMPLOYEE_COLUMNS: {
  label: string;
  field: keyof Employee;
  sortable: boolean;
}[] = [
  { label: "Name", field: "name", sortable: true },
  { label: "Birthdate", field: "birthdate", sortable: true },
  { label: "SSN", field: "ssn", sortable: false },
  { label: "Address", field: "address", sortable: true },
  { label: "Zip Code", field: "zipCode", sortable: true },
  { label: "Email", field: "email", sortable: true },
];

const TEST_TYPES = ["(AF) LabCorp - 10 Panel", "(AF) LabCorp - 5 Panel", "(AF) Quest - 10 Panel"];
const TEST_FREQUENCIES = ["Weekly", "Bi-Weekly", "Monthly", "Quarterly"];
const MIN_TIME_OPTIONS = ["None", "30 Days", "60 Days", "90 Days", "180 Days"];

export function SetupRandomDrugChecks({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [testType, setTestType] = useState("(AF) LabCorp - 10 Panel");
  const [testFrequency, setTestFrequency] = useState("");
  const [minTimeBetween, setMinTimeBetween] = useState("None");
  const [enableRandomChecks, setEnableRandomChecks] = useState(false);
  const [employees] = useState<Employee[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedEmployees = useMemo(() => {
    let result = [...employees];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((emp) =>
        Object.values(emp).some((val) => val.toLowerCase().includes(query))
      );
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [employees, searchQuery, sortField, sortAsc]);

  const totalEntries = processedEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedEmployees = useMemo(() => {
    return processedEmployees.slice((page - 1) * pageSize, page * pageSize);
  }, [processedEmployees, page, pageSize]);

  const cardStyle: React.CSSProperties = {
    background: isDarkMode ? "#1A1C21" : "#FFFFFF",
    border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    padding: "24px",
    marginBottom: "20px",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: isDarkMode ? "#E5E7EB" : "#555555",
    margin: "0 0 16px 0",
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ background: isDarkMode ? "#252830" : "#F6F6F6" }}
    >
      <div className="flex-1 p-6" style={{ overflowY: "auto" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: isDarkMode ? "#DF2A57" : "rgb(199, 0, 57)",
            marginBottom: "20px",
          }}
        >
          Random Drug Check Setup
        </h1>

        {showBanner && (
          <div
            style={{
              background: "#E6F4EA",
              border: "1px solid #CEEAD6",
              color: "#137333",
              padding: "10px 16px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "13px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Last employee list was submitted by: on:</span>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#137333",
                cursor: "pointer",
                display: "flex",
                padding: 0,
                opacity: 0.7,
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload Employee List */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Upload Employee List</h2>
          <p
            style={{
              fontSize: "13px",
              color: "rgb(199, 0, 57)",
              textDecoration: "underline",
              margin: "0 0 8px 0",
            }}
          >
            Only CSV files are supported.
          </p>
          <p
            style={{
              fontSize: "12px",
              color: isDarkMode ? "#9CA3AF" : "#777777",
              margin: "0 0 20px 0",
              lineHeight: 1.5,
            }}
          >
            Following format is expected: First Name, Middle Name, Last Name, Generation, Birthdate
            (YYYY-MM-DD), SSN, Address, Address 2, Zip Code, Email.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <label
              style={{
                display: "inline-block",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 500,
                color: isDarkMode ? "#E5E7EB" : "#333333",
                background: isDarkMode ? "#2A2D34" : "#F3F4F6",
                border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Choose File
              <input
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>

          <button
            type="button"
            style={{
              background: "rgb(199, 0, 57)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "3px",
              padding: "8px 20px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>

        {/* Random Drug Test Options */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Random Drug Test Options</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <SelectField
              label="Test Type"
              value={testType}
              onChange={setTestType}
              options={TEST_TYPES}
              isDarkMode={isDarkMode}
            />
            <SelectField
              label="Test Frequency"
              value={testFrequency}
              onChange={setTestFrequency}
              options={TEST_FREQUENCIES}
              placeholder="Select Frequency of Tests"
              isDarkMode={isDarkMode}
            />
            <SelectField
              label="Min. Time Between Tests Per Employee"
              value={minTimeBetween}
              onChange={setMinTimeBetween}
              options={MIN_TIME_OPTIONS}
              isDarkMode={isDarkMode}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: isDarkMode ? "#D1D5DB" : "#555555",
              cursor: "pointer",
              marginBottom: "20px",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={enableRandomChecks}
              onChange={(e) => setEnableRandomChecks(e.target.checked)}
              style={{
                width: "14px",
                height: "14px",
                accentColor: "rgb(199, 0, 57)",
                cursor: "pointer",
              }}
            />
            Enable Random Drug Checks
          </label>

          <button
            type="button"
            style={{
              background: "rgb(199, 0, 57)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "3px",
              padding: "8px 20px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Update Options
          </button>
        </div>

        {/* Current Employee List */}
        <div
          style={{
            ...cardStyle,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 16px 0 16px" }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: "12px" }}>Current Employee List</h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                  borderRadius: "3px",
                  padding: "3px 6px",
                  fontSize: "12px",
                  outline: "none",
                  background: isDarkMode ? "#252830" : "#FFFFFF",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  cursor: "pointer",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: isDarkMode ? "#252830" : "#F9FAFB",
                border: isDarkMode ? "1px solid #333333" : "1px solid #D1D5DB",
                borderRadius: "3px",
                padding: "0 8px",
                height: "28px",
                width: "180px",
              }}
            >
              <Search size={13} style={{ color: "#9CA3AF", marginRight: "6px" }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "12px",
                  color: isDarkMode ? "#E5E7EB" : "#333333",
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: isDarkMode ? "#2A2D34" : "#F9FAFB",
                    borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                    borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  }}
                >
                  {EMPLOYEE_COLUMNS.map((col, idx) => (
                    <th
                      key={col.field}
                      onClick={() => col.sortable && handleSort(col.field)}
                      style={{
                        padding: "10px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight:
                          idx < EMPLOYEE_COLUMNS.length - 1
                            ? isDarkMode
                              ? "1px solid #333333"
                              : "1px solid #E5E7EB"
                            : "none",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (col.sortable) e.currentTarget.style.background = isDarkMode ? "#333333" : "#F3F4F6";
                      }}
                      onMouseLeave={(e) => {
                        if (col.sortable) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span>{col.label}</span>
                        {col.sortable && (
                          <ArrowUpDown
                            size={11}
                            style={{
                              color: sortField === col.field ? "rgb(199, 0, 57)" : "#A0A0A0",
                            }}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={EMPLOYEE_COLUMNS.length}
                      style={{
                        padding: "24px 16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#8A8A8A",
                        background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                      }}
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp, idx) => (
                    <tr
                      key={idx}
                      style={{
                        background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"),
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                      }}
                    >
                      {EMPLOYEE_COLUMNS.map((col) => (
                        <td
                          key={col.field}
                          style={{
                            padding: "10px 14px",
                            fontSize: "12px",
                            color: isDarkMode ? "#D1D5DB" : "#555555",
                          }}
                        >
                          {emp[col.field]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
              background: isDarkMode ? "#1A1C21" : "#FFFFFF",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#777777" }}>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  padding: "4px 6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "3px 0 0 3px",
                }}
              >
                <ChevronsLeft size={12} style={{ color: "#777777" }} />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronLeft size={12} style={{ color: "#777777" }} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalEntries === 0}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages || totalEntries === 0 ? "not-allowed" : "pointer",
                  opacity: page === totalPages || totalEntries === 0 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight size={12} style={{ color: "#777777" }} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || totalEntries === 0}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages || totalEntries === 0 ? "not-allowed" : "pointer",
                  opacity: page === totalPages || totalEntries === 0 ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "0 3px 3px 0",
                }}
              >
                <ChevronsRight size={12} style={{ color: "#777777" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  isDarkMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  isDarkMode: boolean;
}) {
  const hasValue = value.length > 0;

  return (
    <div
      style={{
        border: isDarkMode ? "1px solid #333333" : "1px solid rgb(229, 231, 235)",
        borderRadius: "3px",
        padding: "6px 12px",
        background: isDarkMode ? "#252830" : "#FFFFFF",
        display: "flex",
        alignItems: "center",
        minHeight: "56px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div style={{ flex: 1 }}>
        <label
          style={{
            display: "block",
            fontSize: "9px",
            color: isDarkMode ? "#9CA3AF" : "#777777",
            marginBottom: "1px",
            userSelect: "none",
          }}
        >
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "12px",
            color: hasValue ? (isDarkMode ? "#E5E7EB" : "#555555") : (isDarkMode ? "#9CA3AF" : "#9CA3AF"),
            background: "transparent",
            width: "100%",
            padding: 0,
            margin: 0,
            appearance: "none",
            cursor: "pointer",
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <ChevronDown size={14} style={{ color: "#D1D5DB", pointerEvents: "none", flexShrink: 0 }} />
    </div>
  );
}
