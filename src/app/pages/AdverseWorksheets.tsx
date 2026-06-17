import { useState } from "react";
import { Search } from "lucide-react";
import { Footer } from "../components/Footer";
import { getListPageStyles } from "../theme/listPageStyles";

interface WorksheetRecord {
  id: string;
  applicantName: string;
  dateSubmitted: string;
  applicantExplanation: string;
  files: string[];
}

const MOCK_WORKSHEETS: WorksheetRecord[] = [];

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

export function AdverseWorksheets({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const s = getListPageStyles(isDarkMode);
  const [worksheets, setWorksheets] = useState<WorksheetRecord[]>(MOCK_WORKSHEETS);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("dateSubmitted");
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

  const filtered = worksheets.filter((w) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        w.id.toLowerCase().includes(q) ||
        w.applicantName.toLowerCase().includes(q) ||
        w.applicantExplanation.toLowerCase().includes(q)
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
    } else if (sortField === "dateSubmitted") {
      valA = a.dateSubmitted;
      valB = b.dateSubmitted;
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
      <div style={s.content}>
        <h1 style={s.title}>Confidential Adverse Action Worksheet List</h1>

        <div style={s.card}>
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
                    Order ID <SortIcon active={sortField === "id"} direction={sortDirection} colors={s.sortColors(sortField === "id", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("applicantName")} style={s.th}>
                    Applicant Name <SortIcon active={sortField === "applicantName"} direction={sortDirection} colors={s.sortColors(sortField === "applicantName", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("dateSubmitted")} style={s.th}>
                    Date Submitted <SortIcon active={sortField === "dateSubmitted"} direction={sortDirection} colors={s.sortColors(sortField === "dateSubmitted", sortDirection)} />
                  </th>
                  <th style={s.thStatic}>Applicant&apos;s Explanation</th>
                  <th style={s.thStatic}>Files</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={s.emptyCell}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((w, idx) => (
                    <tr key={w.id} style={s.row(idx)}>
                      <td style={s.tdPrimary}>{w.id}</td>
                      <td style={{ ...s.td, color: s.t.text }}>{w.applicantName}</td>
                      <td style={s.td}>{w.dateSubmitted}</td>
                      <td style={s.td}>{w.applicantExplanation}</td>
                      <td style={s.td}>
                        {w.files.map((f, fIdx) => (
                          <div key={fIdx} style={{ ...s.actionLink, padding: 0 }}>{f}</div>
                        ))}
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
