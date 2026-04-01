import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye } from "lucide-react";
import { AppSubmission } from "../types";
import {
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  CardHeader,
} from "../components/ui";
import { useReviewQueue } from "../hooks/data/useAdmin/useReviewQueue";

const PAGE_SIZE = 5;

const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ❗ Lấy toàn bộ data (KHÔNG truyền status)
  const { data, isLoading } = useReviewQueue();

  // ========================
  // MAP BACKEND → FRONTEND
  // ========================
  const mapSubmission = (item: any): AppSubmission => ({
    id: item.id,

    appId: item.app_id,
    appName: item.app_name,
    developerName: item.developer_name,
    developerId: item.submitted_by,

    version: item.version_number,
    submittedAt: item.submitted_at,

    status: item.status?.toUpperCase(),

    manifest: item.manifest || {},
    sourceUrl: item.package_url || "",
    previewUrl: "",

    securityChecklist: [],
  });

  // ========================
  // DATA
  // ========================
  const submissions: AppSubmission[] = data?.data?.map(mapSubmission) || [];

  // ========================
  // FILTER SEARCH + STATUS
  // ========================
  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.appName?.toLowerCase().includes(filter.toLowerCase()) ||
      s.developerName?.toLowerCase().includes(filter.toLowerCase());

    const matchStatus =
      (s.status as string) === "PENDING" ||
      (s.status as string) === "IN_REVIEW";

    return matchSearch && matchStatus;
  });

  // ========================
  // PAGINATION (LOAD MORE)
  // ========================
  const visibleData = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // ========================
  // BADGE STATUS
  // ========================
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "IN_REVIEW":
        return <Badge variant="primary">In Review</Badge>;
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Review Queue</h1>
          <p className="text-slate-500">Manage pending app submissions.</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search apps..."
              className="pl-9 w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="border-b bg-slate-50/50 p-4">
          <div className="grid grid-cols-12 text-xs font-semibold uppercase text-slate-500 tracking-wider">
            <div className="col-span-4 pl-2">App Name</div>
            <div className="col-span-3">Developer</div>
            <div className="col-span-2">Version</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              Loading submissions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No submissions found.
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {visibleData.map((sub) => (
                  <div
                    key={sub.id}
                    className="grid grid-cols-12 items-center p-4 hover:bg-slate-50 transition-colors"
                  >
                    {/* APP */}
                    <div className="col-span-4 flex items-center space-x-3 pl-2">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {sub.appName?.substring(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {sub.appName}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: {sub.appId}
                        </p>
                      </div>
                    </div>

                    {/* DEV */}
                    <div className="col-span-3 text-sm text-slate-600">
                      {sub.developerName}
                    </div>

                    {/* VERSION */}
                    <div className="col-span-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {sub.version}
                      </Badge>
                    </div>

                    {/* DATE */}
                    <div className="col-span-2 text-sm text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>

                    {/* ACTION */}
                    <div className="col-span-1 flex justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/reviews/${sub.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* LOAD MORE */}
              {hasMore && (
                <div className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewQueue;
