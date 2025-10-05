import React, { useEffect, useMemo, useState } from "react";
import TableComponent from "../../components/ui/TableComponent/TableComponent";
// import TableSkeleton from "../../components/ui/TableComponent/TableSkeleton";
// import { __fetch } from "../../components/ui/FetchApi";
// import useFetch from "../../hooks/useFetch";
import type { TableColumn } from "../../constants/types";
import { useTheme } from "../../hooks/useTheme";
import useFetch from "../../hooks/useFetch";
type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};
type Geo = {
  lat: string;
  lng: string;
};
type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};
type SimpleUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

const columns: TableColumn<SimpleUser>[] = [
  { key: "id", header: "ID", headerClassName: "w-16" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  {
    key: "address",
    header: "Address",
    headerClassName: "w-60",
    render: (_v, row) => {
      const a = row.address || ({} as Address);
      const line1 = [a.street, a.suite].filter(Boolean).join(", ");
      const line2 = [a.city, a.zipcode].filter(Boolean).join(" ");
      return (
        <div className="flex flex-col">
          <span>{line1 || "-"}</span>
          <span className="text-xs text-secondary">{line2}</span>
        </div>
      );
    },
  },
  { key: "phone", header: "Phone", headerClassName: "w-32" },
  {
    key: "website",
    header: "Website",
    headerClassName: "w-40",
    render: (value) => (
      <a
        href={`https://${String(value)}`}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline"
        onClick={(e) => {
          if (!value) e.preventDefault();
        }}
      >
        {value || "-"}
      </a>
    ),
  },
  {
    key: "company",
    header: "Company",
    headerClassName: "w-60",
    render: (_v, row) => {
      const c = row.company || ({} as Company);
      return (
        <div className="flex flex-col">
          <span>{c.name || "-"}</span>
          {c.catchPhrase ? (
            <span className="text-xs text-secondary">{c.catchPhrase}</span>
          ) : null}
        </div>
      );
    },
  },
];

const Users: React.FC = () => {
  const { getThemeStyles, getTableClasses } = useTheme();
  const themeStyles = getThemeStyles();
  const tableClasses = getTableClasses();
  const { loading, error, fetchData, response } = useFetch({
    urlPath: "https://jsonplaceholder.typicode.com/users",
    reqMethodType: "GET",
    resType: "JSON",
    reqData: {},
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<keyof SimpleUser | "company" | "address">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<SimpleUser | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  // Normalize API data once
  const users: SimpleUser[] = useMemo(() => {
    const raw = (response?.resData as any[]) || [];
    return raw.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: "User",
      address: u.address,
      phone: u.phone,
      website: u.website,
      company: u.company,
    }));
  }, [response?.resData]);

  // Search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      [u.name, u.email, u.company?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, search]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const getVal = (x: SimpleUser) => {
        if (sortKey === "company") return x.company?.name || "";
        if (sortKey === "address")
          return [x.address?.city, x.address?.street].filter(Boolean).join(" ");
        return (x as any)[sortKey] ?? "";
      };
      const va = String(getVal(a)).toLowerCase();
      const vb = String(getVal(b)).toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // Pagination (client-side)
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const totalCount = sorted.length;

  const toggleSort = (key: typeof sortKey) => {
    setCurrentPage(1);
    setSortKey((prev) => (prev === key ? prev : key));
    setSortDir((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
  };

  const sortIndicator = (key: typeof sortKey) => (
    <span className="ml-1 text-xs">{sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : ""}</span>
  );

  return (
    <div className="p-6" style={themeStyles.container}>
      <h1 className="text-2xl font-bold mb-6" style={themeStyles.text}>
        Users
      </h1>
      <div className="rounded-lg shadow p-4" style={themeStyles.card}>
        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => { setCurrentPage(1); setSearch(e.target.value); }}
            placeholder="Search by name, email or company"
            className="w-full sm:max-w-sm border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-sm">Failed to load users.</span>
              <button onClick={() => fetchData()} className="px-3 py-2 rounded bg-primary text-white">Retry</button>
            </div>
          )}
        </div>
        <TableComponent<SimpleUser>
          columns={[
            { key: "id", header: "ID", headerClassName: "w-16" },
            {
              key: "name",
              header: "Name",
              headerRender: () => (
                <button className="flex items-center" onClick={() => toggleSort("name")}>Name{sortIndicator("name")}</button>
              ),
            },
            {
              key: "email",
              header: "Email",
              headerRender: () => (
                <button className="flex items-center" onClick={() => toggleSort("email")}>Email{sortIndicator("email")}</button>
              ),
            },
            {
              key: "address",
              header: "Address",
              headerClassName: "w-60",
              headerRender: () => (
                <button className="flex items-center" onClick={() => toggleSort("address")}>Address{sortIndicator("address")}</button>
              ),
              render: (_v, row) => {
                const a = row.address || ({} as Address);
                const line1 = [a.street, a.suite].filter(Boolean).join(", ");
                const line2 = [a.city, a.zipcode].filter(Boolean).join(" ");
                return (
                  <div className="flex flex-col">
                    <span>{line1 || "-"}</span>
                    <span className="text-xs text-secondary">{line2}</span>
                  </div>
                );
              },
            },
            { key: "phone", header: "Phone", headerClassName: "w-32" },
            {
              key: "website",
              header: "Website",
              headerClassName: "w-40",
              render: (value) => (
                <a
                  href={`https://${String(value)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                  onClick={(e) => { if (!value) e.preventDefault(); }}
                >
                  {value || "-"}
                </a>
              ),
            },
            {
              key: "company",
              header: "Company",
              headerClassName: "w-60",
              headerRender: () => (
                <button className="flex items-center" onClick={() => toggleSort("company")}>Company{sortIndicator("company")}</button>
              ),
              render: (_v, row) => {
                const c = row.company || ({} as Company);
                return (
                  <div className="flex flex-col">
                    <span>{c.name || "-"}</span>
                    {c.catchPhrase ? (
                      <span className="text-xs text-secondary">{c.catchPhrase}</span>
                    ) : null}
                  </div>
                );
              },
            },
          ]}
          data={paged}
          loading={loading}
          pagination={{
            currentPage,
            onPageChange: (p) => setCurrentPage(p),
            pageSize,
            setPageSize: (s) => { setCurrentPage(1); setPageSize(s); },
          }}
          totalCount={totalCount}
          className={tableClasses}
          onRowClick={(row) => setSelected(row)}
        />
      </div>

      {/* Details side panel */}
      <div
        className={`fixed inset-0 z-[70] ${selected ? "block" : "hidden"}`}
        aria-hidden={!selected}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setSelected(null)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[380px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            selected ? "translate-x-0" : "translate-x-full"
          }`}
          style={themeStyles.card}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={themeStyles.text}>User Details</h3>
            <button className="px-2 py-1" onClick={() => setSelected(null)}>✕</button>
          </div>
          <div className="p-4 space-y-2">
            {selected && (
              <div className="text-sm" style={themeStyles.text}>
                <div><span className="font-medium">Name:</span> {selected.name}</div>
                <div><span className="font-medium">Email:</span> {selected.email}</div>
                <div><span className="font-medium">Phone:</span> {selected.phone}</div>
                <div><span className="font-medium">Website:</span> {selected.website}</div>
                <div><span className="font-medium">Company:</span> {selected.company?.name}</div>
                <div>
                  <span className="font-medium">Address:</span> {[selected.address?.street, selected.address?.suite, selected.address?.city, selected.address?.zipcode].filter(Boolean).join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
