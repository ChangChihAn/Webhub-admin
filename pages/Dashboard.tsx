import React, { useMemo, useState, useEffect } from "react";
import { Users, LayoutGrid, CheckCircle2, Clock, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "../components/ui";
import { useUsers } from "../hooks/data/useAdmin/useUsers";
import { useReviewQueue } from "../hooks/data/useAdmin/useReviewQueue";

// ========================
// STAT CARD
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, icon: Icon, color }) => (
  <Card className="h-full">
    <CardContent className="p-6 flex items-center justify-between h-full">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </CardContent>
  </Card>
);

// ========================
// PAGINATION HELPER (FIX 100%)
const getPagination = (current: number, total: number) => {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 4) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");

  pages.push(total);

  // remove duplicate
  return pages.filter((p, i, arr) => arr.indexOf(p) === i);
};

// ========================
const Dashboard: React.FC = () => {
  const { data: usersData } = useUsers();
  const { data: reviewsData } = useReviewQueue();

  const users = usersData?.data || [];
  const reviews = reviewsData?.data || [];

  // ========================
  // STATS
  const totalUsers = users.length;

  const activeDevelopers = users.filter(
    (u: any) => u.role === "developer" && u.is_active,
  ).length;

  const pendingReviews = reviews.filter(
    (r: any) => r.status === "pending" || r.status === "in_review",
  ).length;

  const approvedToday = reviews.filter((r: any) => {
    if (!r.reviewed_at) return false;
    return new Date(r.reviewed_at).toDateString() === new Date().toDateString();
  }).length;

  // ========================
  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u: any) =>
        (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  // reset page khi search
  useEffect(() => {
    setPage(1);
  }, [search]);

  // clamp page
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages]);

  const pagination = getPagination(page, totalPages);

  // ========================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">System overview and recent activity.</p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={String(totalUsers)}
          icon={Users}
          color="bg-indigo-500"
        />
        <StatCard
          title="Pending Reviews"
          value={String(pendingReviews)}
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Active Developers"
          value={String(activeDevelopers)}
          icon={LayoutGrid}
          color="bg-blue-500"
        />
        <StatCard
          title="Approved Today"
          value={String(approvedToday)}
          icon={CheckCircle2}
          color="bg-green-500"
        />
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* RECENT USERS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {paginatedUsers.length === 0 ? (
                <div className="text-center text-slate-400 py-6">
                  No users found
                </div>
              ) : (
                paginatedUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">
                        {user.full_name?.charAt(0) || "U"}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {pagination.map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={`${p}-${idx}`}
                      size="sm"
                      variant={p === page ? "primary" : "outline"}
                      onClick={() => setPage(Number(p))}
                    >
                      {p}
                    </Button>
                  ),
                )}
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SYSTEM STATUS */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">API Latency</span>
                <span className="text-green-600 font-medium">45ms</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Users</span>
                <span className="font-medium">{totalUsers}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pending Reviews</span>
                <span className="font-medium">{pendingReviews}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
