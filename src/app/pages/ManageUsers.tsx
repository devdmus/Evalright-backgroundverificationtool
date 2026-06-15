import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  Pencil,
  Plus,
  Eye,
  ArrowLeft,
  X,
  Save,
  Check,
  CircleAlert,
} from "lucide-react";
import { Footer } from "../components/Footer";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  status: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  carbonCopy?: string;
  branches?: Record<string, boolean>;
  roles?: Record<SecurityRole, boolean>;
}

const INITIAL_USERS: User[] = [
  { id: 25014, username: "rameshs", name: "ramesh K", email: "sales@evalright.us", status: false },
  { id: 13670, username: "Evalrightdemo", name: "Suresh Ramakoti", email: "sales@evalright.us", status: true },
];

const BRANCHES = ["Headquarters", "Addanki", "Hyderabad"];

const SECURITY_ROLES = [
  "Administrator",
  "Accounting",
  "Order Reports",
  "View Assigned Branch Reports",
  "View Reports In All Branches",
  "View Pricing",
  "Disable Email on Completed Invitations",
] as const;

type SecurityRole = (typeof SECURITY_ROLES)[number];

interface AddUserFormState {
  branches: Record<string, boolean>;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  carbonCopy: string;
  roles: Record<SecurityRole, boolean>;
}

const createEmptyForm = (): AddUserFormState => ({
  branches: Object.fromEntries(BRANCHES.map((b) => [b, false])),
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  carbonCopy: "",
  roles: Object.fromEntries(SECURITY_ROLES.map((r) => [r, false])) as Record<SecurityRole, boolean>,
});

const userToFormState = (user: User): AddUserFormState => {
  const nameParts = user.name.trim().split(/\s+/);
  const firstName = user.firstName ?? nameParts[0] ?? "";
  const lastName = user.lastName ?? nameParts.slice(1).join(" ");

  return {
    branches: user.branches ?? Object.fromEntries(BRANCHES.map((b) => [b, false])),
    firstName,
    lastName,
    username: user.username,
    password: "",
    confirmPassword: "",
    email: user.email,
    phone: user.phone ?? "",
    carbonCopy: user.carbonCopy ?? "",
    roles:
      user.roles ??
      (Object.fromEntries(SECURITY_ROLES.map((r) => [r, false])) as Record<SecurityRole, boolean>),
  };
};

type FormFieldKey =
  | "firstName"
  | "lastName"
  | "username"
  | "password"
  | "confirmPassword"
  | "email"
  | "phone"
  | "carbonCopy";

type ValidationState = "error" | "success" | "neutral";

const ERROR_COLOR = "rgb(199, 0, 57)";
const SUCCESS_COLOR = "#79B249";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const getFieldValidation = (
  field: FormFieldKey,
  formState: AddUserFormState,
  hasSubmitted: boolean,
  isEditing: boolean
): ValidationState => {
  if (!hasSubmitted) return "neutral";

  const value = formState[field].trim();
  const isChangingPassword = formState.password.trim() || formState.confirmPassword.trim();

  if (field === "confirmPassword") {
    if (isEditing && !isChangingPassword) return "neutral";
    if (!value || value !== formState.password) return "error";
    return "success";
  }

  if (field === "password") {
    if (isEditing && !isChangingPassword) return "neutral";
    if (!value) return "error";
    if (formState.confirmPassword && value !== formState.confirmPassword) return "error";
    return "success";
  }

  if (field === "email") {
    if (!value || !isValidEmail(value)) return "error";
    return "success";
  }

  if (field === "phone" || field === "carbonCopy") {
    return value ? "success" : "neutral";
  }

  return value ? "success" : "error";
};

const isFormValid = (formState: AddUserFormState, isEditing: boolean) => {
  const hasBranch = BRANCHES.some((b) => formState.branches[b]);
  const isChangingPassword = formState.password.trim() || formState.confirmPassword.trim();
  const passwordValid =
    isEditing && !isChangingPassword
      ? true
      : formState.password.trim() &&
        formState.confirmPassword.trim() &&
        formState.password === formState.confirmPassword;

  return (
    hasBranch &&
    formState.firstName.trim() &&
    formState.lastName.trim() &&
    formState.username.trim() &&
    passwordValid &&
    isValidEmail(formState.email)
  );
};

export function ManageUsers({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formState, setFormState] = useState<AddUserFormState>(createEmptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isEditing = editingUserId !== null;
  const editingUser = users.find((u) => u.id === editingUserId);
  const formTitle = isEditing
    ? `Editing User - ${formState.firstName} ${formState.lastName}`.trim()
    : "Add User";

  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleToggleStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === id ? { ...user, status: !user.status } : user))
    );
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAllBranches = () => {
    const allSelected = BRANCHES.every((b) => formState.branches[b]);
    setFormState((prev) => ({
      ...prev,
      branches: Object.fromEntries(BRANCHES.map((b) => [b, !allSelected])),
    }));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!isFormValid(formState, isEditing)) return;

    const userPayload = {
      username: formState.username,
      name: `${formState.firstName} ${formState.lastName}`.trim(),
      email: formState.email,
      firstName: formState.firstName,
      lastName: formState.lastName,
      phone: formState.phone,
      carbonCopy: formState.carbonCopy,
      branches: formState.branches,
      roles: formState.roles,
    };

    if (isEditing && editingUserId !== null) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId ? { ...user, ...userPayload } : user
        )
      );
    } else {
      const newUser: User = {
        id: Math.floor(10000 + Math.random() * 90000),
        ...userPayload,
        status: true,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    closeUserForm();
  };

  const closeUserForm = () => {
    setFormState(createEmptyForm());
    setShowPassword(false);
    setShowConfirmPassword(false);
    setHasSubmitted(false);
    setEditingUserId(null);
    setShowUserForm(false);
  };

  const handleCancelChanges = () => {
    if (isEditing && editingUser) {
      setFormState(userToFormState(editingUser));
    } else {
      setFormState(createEmptyForm());
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setHasSubmitted(false);
  };

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setFormState(createEmptyForm());
    setShowPassword(false);
    setShowConfirmPassword(false);
    setHasSubmitted(false);
    setShowUserForm(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUserId(user.id);
    setFormState(userToFormState(user));
    setShowPassword(false);
    setShowConfirmPassword(false);
    setHasSubmitted(false);
    setShowUserForm(true);
  };

  const hasBranchSelected = BRANCHES.some((b) => formState.branches[b]);

  const processedUsers = useMemo(() => {
    let result = users;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.id.toString().includes(query) ||
          u.username.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === "string" && typeof valB === "string") {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return result;
  }, [users, searchQuery, sortField, sortAsc]);

  const totalEntries = processedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalEntries);

  const paginatedUsers = useMemo(() => {
    return processedUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [processedUsers, page, pageSize]);

  if (showUserForm) {
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
              marginBottom: "24px",
            }}
          >
            {formTitle}
          </h1>

          <form onSubmit={handleSaveUser}>
            {/* Assigned Branches */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isDarkMode ? "#E5E7EB" : "#555555",
                    margin: 0,
                  }}
                >
                  Assigned Branches
                </h2>
                <button
                  type="button"
                  onClick={handleSelectAllBranches}
                  style={{
                    background: isDarkMode ? "#1E3A5F" : "#E8F4FD",
                    color: isDarkMode ? "#93C5FD" : "#2563EB",
                    border: "none",
                    borderRadius: "3px",
                    padding: "4px 10px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                  }}
                >
                  SELECT ALL
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {BRANCHES.map((branch) => {
                  const isSelected = formState.branches[branch];
                  const branchValid = hasSubmitted && isSelected;
                  const branchError = hasSubmitted && !hasBranchSelected;

                  return (
                    <label
                      key={branch}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: branchValid
                          ? SUCCESS_COLOR
                          : branchError
                            ? ERROR_COLOR
                            : isDarkMode
                              ? "#D1D5DB"
                              : "#555555",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            branches: { ...prev.branches, [branch]: e.target.checked },
                          }))
                        }
                        style={{
                          width: "14px",
                          height: "14px",
                          accentColor: branchValid ? SUCCESS_COLOR : branchError ? ERROR_COLOR : "rgb(199, 0, 57)",
                          outline: branchValid
                            ? `1px solid ${SUCCESS_COLOR}`
                            : branchError
                              ? `1px solid ${ERROR_COLOR}`
                              : "none",
                          cursor: "pointer",
                        }}
                      />
                      {branch}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* User Details */}
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#555555",
                  margin: "0 0 14px 0",
                }}
              >
                User Details
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <FormField
                  label="First Name"
                  value={formState.firstName}
                  onChange={(v) => setFormState((prev) => ({ ...prev, firstName: v }))}
                  isDarkMode={isDarkMode}
                  validationState={getFieldValidation("firstName", formState, hasSubmitted, isEditing)}
                />
                <FormField
                  label="Last Name"
                  value={formState.lastName}
                  onChange={(v) => setFormState((prev) => ({ ...prev, lastName: v }))}
                  isDarkMode={isDarkMode}
                  validationState={getFieldValidation("lastName", formState, hasSubmitted, isEditing)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <FormField
                  label="Username"
                  value={formState.username}
                  onChange={(v) => setFormState((prev) => ({ ...prev, username: v }))}
                  isDarkMode={isDarkMode}
                  validationState={getFieldValidation("username", formState, hasSubmitted, isEditing)}
                />
                <FormField
                  label="Password"
                  value={formState.password}
                  onChange={(v) => setFormState((prev) => ({ ...prev, password: v }))}
                  isDarkMode={isDarkMode}
                  type={showPassword ? "text" : "password"}
                  validationState={getFieldValidation("password", formState, hasSubmitted, isEditing)}
                  eyeToggle={{
                    show: showPassword,
                    onToggle: () => setShowPassword(!showPassword),
                  }}
                />
                <FormField
                  label="Confirm Password"
                  value={formState.confirmPassword}
                  onChange={(v) => setFormState((prev) => ({ ...prev, confirmPassword: v }))}
                  isDarkMode={isDarkMode}
                  type={showConfirmPassword ? "text" : "password"}
                  validationState={getFieldValidation("confirmPassword", formState, hasSubmitted, isEditing)}
                  eyeToggle={{
                    show: showConfirmPassword,
                    onToggle: () => setShowConfirmPassword(!showConfirmPassword),
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <FormField
                  label="Email Address"
                  value={formState.email}
                  onChange={(v) => setFormState((prev) => ({ ...prev, email: v }))}
                  isDarkMode={isDarkMode}
                  type="email"
                  validationState={getFieldValidation("email", formState, hasSubmitted, isEditing)}
                />
                <FormField
                  label="Phone Number"
                  value={formState.phone}
                  onChange={(v) => setFormState((prev) => ({ ...prev, phone: v }))}
                  isDarkMode={isDarkMode}
                  validationState={getFieldValidation("phone", formState, hasSubmitted, isEditing)}
                />
                <div>
                  <FormField
                    label="Carbon Copy Reports To"
                    value={formState.carbonCopy}
                    onChange={(v) => setFormState((prev) => ({ ...prev, carbonCopy: v }))}
                    isDarkMode={isDarkMode}
                    validationState={getFieldValidation("carbonCopy", formState, hasSubmitted, isEditing)}
                  />
                  <span
                    style={{
                      display: "block",
                      marginTop: "6px",
                      fontSize: "11px",
                      color: isDarkMode ? "#9CA3AF" : "#9CA3AF",
                    }}
                  >
                    (separate email addresses by semicolon &apos;;&apos;)
                  </span>
                </div>
              </div>
            </div>

            {/* User Access Level */}
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isDarkMode ? "#E5E7EB" : "#555555",
                  margin: "0 0 14px 0",
                }}
              >
                User Access Level (Security Roles)
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px 24px",
                }}
              >
                {SECURITY_ROLES.map((role) => (
                  <label
                    key={role}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "13px",
                      color: isDarkMode ? "#D1D5DB" : "#555555",
                      cursor: "pointer",
                      userSelect: "none",
                      lineHeight: 1.4,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formState.roles[role]}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          roles: { ...prev.roles, [role]: e.target.checked },
                        }))
                      }
                      style={{
                        width: "14px",
                        height: "14px",
                        marginTop: "2px",
                        flexShrink: 0,
                        accentColor: "rgb(199, 0, 57)",
                        cursor: "pointer",
                      }}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <button
                type="button"
                onClick={closeUserForm}
                style={secondaryButtonStyle(isDarkMode)}
              >
                <ArrowLeft size={16} /> Go Back
              </button>
              <button type="button" onClick={handleCancelChanges} style={secondaryButtonStyle(isDarkMode)}>
                <X size={16} /> Cancel Changes
              </button>
              <button type="submit" style={saveButtonStyle}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

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
          Manage Users
        </h1>

        <div
          style={{
            background: isDarkMode ? "#1A1C21" : "#FFFFFF",
            border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
            }}
          >
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: isDarkMode ? "#E5E7EB" : "#555555",
                margin: 0,
              }}
            >
              Users List
            </h2>
            <button
              onClick={handleOpenAddUser}
              style={{
                background: "rgb(199, 0, 57)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "3px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A0002C")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(199, 0, 57)")}
            >
              <Plus size={14} /> Add New User
            </button>
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
                  {[
                    { label: "ID", field: "id" as keyof User, sortable: true },
                    { label: "Username", field: "username" as keyof User, sortable: true },
                    { label: "Name", field: "name" as keyof User, sortable: true },
                    { label: "Email", field: "email" as keyof User, sortable: true },
                    { label: "Status", field: null, sortable: false },
                    { label: "Actions", field: null, sortable: false },
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      onClick={() => col.sortable && col.field && handleSort(col.field)}
                      style={{
                        padding: "10px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: isDarkMode ? "#9CA3AF" : "#555555",
                        cursor: col.sortable ? "pointer" : "default",
                        borderRight: idx < 5 ? (isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB") : "none",
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
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#8A8A8A",
                        background: isDarkMode ? "#1A1C21" : "#FFFFFF",
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      style={{
                        background: idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"),
                        borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #F3F4F6",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#2A2D34" : "#F5F8FC")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = idx % 2 === 0 ? (isDarkMode ? "#1A1C21" : "#FFFFFF") : (isDarkMode ? "#252830" : "#FAFAFA"))
                      }
                    >
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
                        {user.id}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#E5E7EB" : "#333333", fontWeight: 500 }}>
                        {user.username}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#D1D5DB" : "#555555", fontWeight: 500 }}>
                        {user.name}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#555555" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <div
                            onClick={() => handleToggleStatus(user.id)}
                            style={{
                              width: "32px",
                              height: "16px",
                              borderRadius: "8px",
                              background: user.status ? "#86EFAC" : "#E5E7EB",
                              position: "relative",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                          >
                            <div
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: "#FFFFFF",
                                position: "absolute",
                                top: "2px",
                                left: user.status ? "18px" : "2px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                                transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 600,
                              marginTop: "3px",
                              color: user.status ? "#137333" : "#C70039",
                              userSelect: "none",
                            }}
                          >
                            {user.status ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          type="button"
                          title="Edit User"
                          onClick={() => handleOpenEditUser(user)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "rgb(199, 0, 57)",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                      </td>
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = page === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      background: isCurrent ? "rgb(199, 0, 57)" : "none",
                      border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                      borderLeft: "none",
                      color: isCurrent ? "#FFFFFF" : "#777777",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: isCurrent ? "600" : "400",
                      cursor: "pointer",
                      minWidth: "26px",
                      borderRadius: isCurrent ? "50%" : "0",
                      boxSizing: "border-box",
                      height: "26px",
                      width: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.35 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight size={12} style={{ color: "#777777" }} />
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={{
                  background: "none",
                  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
                  borderLeft: "none",
                  padding: "4px 6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.35 : 1,
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
      <Footer />
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  isDarkMode,
  type = "text",
  validationState = "neutral",
  eyeToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  type?: string;
  validationState?: ValidationState;
  eyeToggle?: { show: boolean; onToggle: () => void };
}) {
  const hasValue = value.length > 0;

  const borderColor =
    validationState === "error"
      ? ERROR_COLOR
      : validationState === "success"
        ? SUCCESS_COLOR
        : "transparent";

  const fieldBox = (
    <div
      style={{
        flex: 1,
        background: isDarkMode ? "#1A1C21" : "#FFFFFF",
        borderRadius: "3px",
        border: `1px solid ${borderColor}`,
        padding: "14px 14px",
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {hasValue && (
          <label
            style={{
              display: "block",
              fontSize: "9px",
              color: isDarkMode ? "#9CA3AF" : "#777777",
              marginBottom: "2px",
              userSelect: "none",
            }}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          placeholder={hasValue ? "" : label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: isDarkMode ? "#E5E7EB" : "#555555",
            background: "transparent",
            width: "100%",
            padding: 0,
            margin: 0,
          }}
        />
      </div>
      {validationState === "error" && (
        <CircleAlert size={18} color={ERROR_COLOR} fill={ERROR_COLOR} stroke="#FFFFFF" strokeWidth={2} />
      )}
      {validationState === "success" && (
        <Check size={20} color={SUCCESS_COLOR} strokeWidth={3} />
      )}
    </div>
  );

  if (eyeToggle) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {fieldBox}
        <button type="button" onClick={eyeToggle.onToggle} style={eyeButtonStyle}>
          <Eye size={16} />
        </button>
      </div>
    );
  }

  return fieldBox;
}

const eyeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#9CA3AF",
  padding: "0 4px",
  display: "flex",
  alignItems: "center",
};

const secondaryButtonStyle = (isDarkMode: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 16px",
  background: isDarkMode ? "#2A2D34" : "#F3F4F6",
  border: isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB",
  borderRadius: "4px",
  color: isDarkMode ? "#E5E7EB" : "#333333",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
});

const saveButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
  background: "rgb(199, 0, 57)",
  border: "none",
  borderRadius: "4px",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
};
