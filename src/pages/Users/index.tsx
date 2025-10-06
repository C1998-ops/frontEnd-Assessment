import React, { useEffect, useMemo, useState } from "react";
import TableComponent from "../../components/ui/TableComponent/TableComponent";
// import TableSkeleton from "../../components/ui/TableComponent/TableSkeleton";
// import { __fetch } from "../../components/ui/FetchApi";
// import useFetch from "../../hooks/useFetch";
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

const Users: React.FC = () => {
  const { getThemeStyles, getTableClasses } = useTheme();
  const themeStyles = getThemeStyles();
  const { loading, error, fetchData, response } = useFetch({
    urlPath: "https://jsonplaceholder.typicode.com/users",
    reqMethodType: "GET",
    resType: "JSON",
    reqData: {},
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<
    keyof SimpleUser | "company" | "address"
  >("name");
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
    setSortDir((prev) =>
      sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const sortIndicator = (key: typeof sortKey) => (
    <span className="ml-1 text-xs">
      {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : ""}
    </span>
  );

  return (
    <div className="p-6" style={themeStyles.container}>
      <h1 className="text-2xl font-bold mb-6" style={themeStyles.text}>
        Users
      </h1>
      <div
        className={`${getTableClasses().tableContainer} p-6`}
        style={themeStyles.card}
      >
        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by name, email or company"
            className="w-full sm:max-w-sm border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-sm">
                Failed to load users.
              </span>
              <button
                onClick={() => fetchData()}
                className="px-3 py-2 rounded bg-primary text-white"
              >
                Retry
              </button>
            </div>
          )}
        </div>
        <div className={getTableClasses().tableWrapper}>
          <TableComponent<SimpleUser>
            columns={[
              { key: "id", header: "ID", headerClassName: "w-20" },
              {
                key: "name",
                header: "Name",
                headerRender: () => (
                  <button
                    className="flex items-center font-semibold"
                    onClick={() => toggleSort("name")}
                  >
                    Name{sortIndicator("name")}
                  </button>
                ),
              },
              {
                key: "email",
                header: "Email",
                headerRender: () => (
                  <button
                    className="flex items-center font-semibold"
                    onClick={() => toggleSort("email")}
                  >
                    Email{sortIndicator("email")}
                  </button>
                ),
              },
              {
                key: "address",
                header: "Address",
                headerClassName: "w-60",
                headerRender: () => (
                  <button
                    className="flex items-center font-semibold"
                    onClick={() => toggleSort("address")}
                  >
                    Address{sortIndicator("address")}
                  </button>
                ),
                render: (_v, row) => {
                  const a = row.address || ({} as Address);
                  const line1 = [a.street, a.suite].filter(Boolean).join(", ");
                  const line2 = [a.city, a.zipcode].filter(Boolean).join(" ");
                  return (
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{line1 || "-"}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {line2}
                      </span>
                    </div>
                  );
                },
              },
              { key: "phone", header: "Phone", headerClassName: "w-40" },
              {
                key: "website",
                header: "Website",
                headerClassName: "w-48",
                render: (value) => (
                  <a
                    href={`https://${String(value)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
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
                headerClassName: "w-64",
                headerRender: () => (
                  <button
                    className="flex items-center font-semibold"
                    onClick={() => toggleSort("company")}
                  >
                    Company{sortIndicator("company")}
                  </button>
                ),
                render: (_v, row) => {
                  const c = row.company || ({} as Company);
                  return (
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{c.name || "-"}</span>
                      {c.catchPhrase ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                          {c.catchPhrase}
                        </span>
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
              setPageSize: (s) => {
                setCurrentPage(1);
                setPageSize(s);
              },
            }}
            totalCount={totalCount}
            className={getTableClasses()}
            onRowClick={(row) => setSelected(row)}
          />
        </div>
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
          className={`absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out space-y ${
            selected ? "translate-x-0" : "translate-x-full"
          }`}
          style={themeStyles.card}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={themeStyles.text}>
              User Details
            </h3>
            <button className="px-2 py-1" onClick={() => setSelected(null)}>
              ✕
            </button>
          </div>
          <div className="p-4 space-y-2">
            {selected && (
              <div
                className="flex flex-col gap-4 text-base"
                style={themeStyles.text}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block w-24 font-semibold text-gray-500 dark:text-gray-300">
                    Name:
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                    {selected.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block w-24 font-semibold text-gray-500 dark:text-gray-300">
                    Email:
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900 break-all">
                    {selected.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block w-24 font-semibold text-gray-500 dark:text-gray-300">
                    Phone:
                  </span>
                  <span className="px-2 py-1 rounded bg-green-50 dark:bg-green-900">
                    {selected.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block w-24 font-semibold text-gray-500 dark:text-gray-300">
                    Website:
                  </span>
                  <a
                    href={`http://${selected.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 underline"
                  >
                    {selected.website}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block w-24 font-semibold text-gray-500 dark:text-gray-300">
                    Company:
                  </span>
                  <span className="px-2 py-1 rounded bg-yellow-50 dark:bg-yellow-900">
                    {selected.company?.name}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block w-24 font-semibold text-gray-500 dark:text-gray-300">
                    Address:
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-900">
                    {[
                      selected.address?.street,
                      selected.address?.suite,
                      selected.address?.city,
                      selected.address?.zipcode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
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
