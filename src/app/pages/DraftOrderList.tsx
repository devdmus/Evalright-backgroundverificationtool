import { useState } from "react";
import { Search } from "lucide-react";
import { Footer } from "../components/Footer";
import { getListPageStyles } from "../theme/listPageStyles";

interface DraftRecord {
  id: string;
  applicantName: string;
  searchesOrdered: string;
  dateCreated: string;
}

// Default to empty to match screenshot exactly
const MOCK_DRAFTS: DraftRecord[] = [];

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

export function DraftOrderList({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const s = getListPageStyles(isDarkMode);
  const [drafts, setDrafts] = useState<DraftRecord[]>(MOCK_DRAFTS);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("dateCreated");
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

  // Filter drafts
  const filtered = drafts.filter((d) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = d.applicantName.toLowerCase().includes(q);
      const matchSearches = d.searchesOrdered.toLowerCase().includes(q);
      if (!matchName && !matchSearches) return false;
    }
    return true;
  });

  // Sort drafts
  const sorted = [...filtered].sort((a, b) => {
    let valA: any = "";
    let valB: any = "";

    if (sortField === "applicantName") {
      valA = a.applicantName;
      valB = b.applicantName;
    } else if (sortField === "searchesOrdered") {
      valA = a.searchesOrdered;
      valB = b.searchesOrdered;
    } else if (sortField === "dateCreated") {
      valA = a.dateCreated;
      valB = b.dateCreated;
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
        <h1 style={s.title}>Draft List</h1>

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
                  <th onClick={() => handleSort("applicantName")} style={s.th}>
                    Applicant <SortIcon active={sortField === "applicantName"} direction={sortDirection} colors={s.sortColors(sortField === "applicantName", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("searchesOrdered")} style={s.th}>
                    Searches Ordered <SortIcon active={sortField === "searchesOrdered"} direction={sortDirection} colors={s.sortColors(sortField === "searchesOrdered", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("dateCreated")} style={s.th}>
                    Date Created <SortIcon active={sortField === "dateCreated"} direction={sortDirection} colors={s.sortColors(sortField === "dateCreated", sortDirection)} />
                  </th>
                  <th style={s.thStatic}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={s.emptyCell}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((d, idx) => (
                    <tr key={d.id} style={s.row(idx)}>
                      <td style={{ ...s.td, color: s.t.text }}>{d.applicantName}</td>
                      <td style={s.td}>{d.searchesOrdered}</td>
                      <td style={s.td}>{d.dateCreated}</td>
                      <td style={s.td}>
                        <button style={s.actionLink}>Continue</button>
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
