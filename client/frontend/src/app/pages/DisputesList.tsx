import { useState } from "react";
import { Search } from "lucide-react";
import { Footer } from "../components/Footer";
import { getListPageStyles } from "../theme/listPageStyles";

interface DisputeRecord {
  id: string;
  requester: string;
  dob: string;
  phone: string;
  email: string;
  deliveryMethod: string;
  disputeDetails: string;
  fileName: string;
  requestDate: string;
}

const MOCK_DISPUTES: DisputeRecord[] = [];

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

export function DisputesList({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const s = getListPageStyles(isDarkMode);
  const [disputes, setDisputes] = useState<DisputeRecord[]>(MOCK_DISPUTES);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("requestDate");
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

  const filtered = disputes.filter((d) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.requester.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.disputeDetails.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField as keyof DisputeRecord] ?? "";
    let valB = b[sortField as keyof DisputeRecord] ?? "";

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
        <h1 style={s.title}>Report Disputes List</h1>

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
                    ID <SortIcon active={sortField === "id"} direction={sortDirection} colors={s.sortColors(sortField === "id", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("requester")} style={s.th}>
                    Requester <SortIcon active={sortField === "requester"} direction={sortDirection} colors={s.sortColors(sortField === "requester", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("dob")} style={s.th}>
                    DOB <SortIcon active={sortField === "dob"} direction={sortDirection} colors={s.sortColors(sortField === "dob", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("phone")} style={s.th}>
                    Phone <SortIcon active={sortField === "phone"} direction={sortDirection} colors={s.sortColors(sortField === "phone", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("email")} style={s.th}>
                    Email <SortIcon active={sortField === "email"} direction={sortDirection} colors={s.sortColors(sortField === "email", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("deliveryMethod")} style={s.th}>
                    Delivery Method <SortIcon active={sortField === "deliveryMethod"} direction={sortDirection} colors={s.sortColors(sortField === "deliveryMethod", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("disputeDetails")} style={s.th}>
                    Dispute Details <SortIcon active={sortField === "disputeDetails"} direction={sortDirection} colors={s.sortColors(sortField === "disputeDetails", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("fileName")} style={s.th}>
                    File Name <SortIcon active={sortField === "fileName"} direction={sortDirection} colors={s.sortColors(sortField === "fileName", sortDirection)} />
                  </th>
                  <th onClick={() => handleSort("requestDate")} style={s.th}>
                    Request Date <SortIcon active={sortField === "requestDate"} direction={sortDirection} colors={s.sortColors(sortField === "requestDate", sortDirection)} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={s.emptyCell}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((d, idx) => (
                    <tr key={d.id} style={s.row(idx)}>
                      <td style={s.tdPrimary}>{d.id}</td>
                      <td style={{ ...s.td, color: s.t.text }}>{d.requester}</td>
                      <td style={s.td}>{d.dob}</td>
                      <td style={s.td}>{d.phone}</td>
                      <td style={s.td}>{d.email}</td>
                      <td style={s.td}>{d.deliveryMethod}</td>
                      <td style={s.td}>{d.disputeDetails}</td>
                      <td style={{ ...s.td, ...s.actionLink, padding: "12px 16px" }}>{d.fileName}</td>
                      <td style={s.td}>{d.requestDate}</td>
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
