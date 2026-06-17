import { useState } from "react";
import { Search } from "lucide-react";
import { Footer } from "../components/Footer";
import { getListPageStyles } from "../theme/listPageStyles";

interface ConsentRecord {
  id: string;
  applicantName: string;
  emailAddress: string;
  dob: string;
  ssn: string;
  dateSigned: string;
  formType: string;
}

const MOCK_CONSENTS: ConsentRecord[] = [];

function SortIcon({
  active,
  direction,
  colors,
}: {
  active: boolean;
  direction: "asc" | "desc";
  colors: { asc: string; desc: string };
}) {
  return (
    <span style={{ marginLeft: "6px", display: "inline-flex", flexDirection: "column", verticalAlign: "middle", opacity: active ? 1 : 0.35 }}>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: colors.asc }}>▲</span>
      <span style={{ fontSize: "8px", height: "5px", lineHeight: "1", color: colors.desc, marginTop: "2px" }}>▼</span>
    </span>
  );
}

export function ElectronicConsents({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const s = getListPageStyles(isDarkMode);
  const [consents, setConsents] = useState<ConsentRecord[]>(MOCK_CONSENTS);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("dateSigned");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  }

  const filtered = consents.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.applicantName.toLowerCase().includes(q) ||
        c.emailAddress.toLowerCase().includes(q) ||
        c.formType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA: any = "";
    let valB: any = "";

    if (sortField === "id") {
      valA = a.id;
      valB = b.id;
    } else if (sortField === "applicantName") {
      valA = a.applicantName;
      valB = b.applicantName;
    } else if (sortField === "emailAddress") {
      valA = a.emailAddress;
      valB = b.emailAddress;
    } else if (sortField === "dob") {
      valA = a.dob;
      valB = b.dob;
    } else if (sortField === "ssn") {
      valA = a.ssn;
      valB = b.ssn;
    } else if (sortField === "dateSigned") {
      valA = a.dateSigned;
      valB = b.dateSigned;
    }

    return sortDirection === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const totalEntries = sorted.length;
  const totalPages = Math.ceil(totalEntries / perPage);
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, totalEntries);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={s.outer}>
      <div style={{ ...s.content, display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ ...s.title, marginBottom: "0px" }}>Electronic Consents List</h1>

        <div style={s.card}>
          <h2 style={{ fontSize: "16px", fontWeight: 500, color: s.t.heading, marginBottom: "20px", marginTop: 0 }}>
            Secure e-Consent Links
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "14px", color: s.t.textMuted }}>
              Regular Authorization Form:{" "}
              <a
                href="https://clients.evalright.com/e_consent.php?u=29662&h=29a004c2"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: s.t.link, textDecoration: "none" }}
              >
                https://clients.evalright.com/e_consent.php?u=29662&h=29a004c2
              </a>
            </div>
            <div style={{ fontSize: "14px", color: s.t.textMuted }}>
              International Authorization Form:{" "}
              <a
                href="https://clients.evalright.com/e_consent.php?u=29662&h=29a004c2&type=International"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: s.t.link, textDecoration: "none" }}
              >
                https://clients.evalright.com/e_consent.php?u=29662&h=29a004c2&type=International
              </a>
            </div>
            <div style={{ fontSize: "14px", color: s.t.textMuted }}>
              FMCSA (PSP) Authorization Form:{" "}
              <a
                href="https://clients.evalright.com/e_consent.php?u=29662&h=29a004c2&type=PSP"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: s.t.link, textDecoration: "none" }}
              >
                https://clients.evalright.com/e_consent.php?u=29662&h=29a004c2&type=PSP
              </a>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <h2 style={{ fontSize: "16px", fontWeight: 500, color: s.t.heading, marginBottom: "16px", marginTop: 0 }}>
            e-Consent List
          </h2>

          <div style={s.controlsRow}>
            <div style={s.controlsLabel}>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(parseInt(e.target.value)); setPage(1); }}
                style={s.select}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>

            <div style={{ position: "relative", width: "240px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: s.t.textMuted, display: "flex", alignItems: "center" }}>
                <Search size={15} />
              </span>
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={s.search}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={s.theadRow}>
                  <th onClick={() => handleSort("id")} style={s.th}>
                    ID <SortIcon active={sortField === "id"} direction={sortDirection} colors={s.sortColors(sortField === "id", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("applicantName")} style={s.th}>
                    Applicant Name <SortIcon active={sortField === "applicantName"} direction={sortDirection} colors={s.sortColors(sortField === "applicantName", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("emailAddress")} style={s.th}>
                    Email Address <SortIcon active={sortField === "emailAddress"} direction={sortDirection} colors={s.sortColors(sortField === "emailAddress", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("dob")} style={s.th}>
                    DOB <SortIcon active={sortField === "dob"} direction={sortDirection} colors={s.sortColors(sortField === "dob", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("ssn")} style={s.th}>
                    SSN <SortIcon active={sortField === "ssn"} direction={sortDirection} colors={s.sortColors(sortField === "ssn", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("dateSigned")} style={s.th}>
                    Date Signed <SortIcon active={sortField === "dateSigned"} direction={sortDirection} colors={s.sortColors(sortField === "dateSigned", sortDirection)} />
                  </th>
                  <th style={s.thStatic}>Form Type</th>
                  <th style={s.thStatic}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={s.emptyCell}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((c, idx) => (
                    <tr key={c.id} style={s.row(idx)}>
                      <td style={s.tdPrimary}>{c.id}</td>
                      <td style={{ ...s.td, color: s.t.text }}>{c.applicantName}</td>
                      <td style={s.td}>{c.emailAddress}</td>
                      <td style={s.td}>{c.dob}</td>
                      <td style={s.td}>{c.ssn}</td>
                      <td style={s.td}>{c.dateSigned}</td>
                      <td style={{ ...s.td, color: s.t.text }}>{c.formType}</td>
                      <td style={s.td}>
                        <button style={s.actionLink}>View PDF</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={s.pagination}>
            <div>
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </div>

            <div style={{ display: "flex", gap: "4px" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                style={s.navBtn(page === 1)}
              >
                «
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={s.navBtn(page === 1)}
              >
                &lt;
              </button>

              {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={s.pageBtn(p === page)}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={s.navBtn(page === totalPages || totalPages === 0)}
              >
                &gt;
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(totalPages)}
                style={s.navBtn(page === totalPages || totalPages === 0)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
