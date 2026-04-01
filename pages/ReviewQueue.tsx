import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Hand } from "lucide-react";
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
import { useAdminSubmission } from "../hooks/useAdminSubmission";

const PAGE_SIZE = 5;

// ========================
const getPagination = (current: number, total: number) => {
  if (total <= 1) return [1];

  const pages: (number | string)[] = [];
  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  let last: number | undefined;

  for (const i of range) {
    if (last) {
      if (i - last === 2) rangeWithDots.push(last + 1);
      else if (i - last > 2) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
};

// ========================
const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useReviewQueue();
  const { claimSubmission, isClaiming } = useAdminSubmission();

  const mapSubmission = (item: any): AppSubmission => ({
    id: item.id,
    appId: item.app_id,
    appName: item.app_name,
    developerName: item.developer_name,
    developerId: item.submitted_by,
    version: item.version_number,
    submittedAt: item.submitted_at,
    status: item.status?.toUpperCase(),
    manifest: {
      name: item.app_name,
      version_number: item.version_number,
      description: "",
      permissions: [],
    },
    sourceUrl: "",
    previewUrl: "",
    securityChecklist: [],
  });

  const submissions: AppSubmission[] = data?.data?.map(mapSubmission) || [];

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchSearch =
        s.appName?.toLowerCase().includes(filter.toLowerCase()) ||
        s.developerName?.toLowerCase().includes(filter.toLowerCase());

      const status = (s.status || "").toUpperCase();

      return matchSearch && (status === "PENDING" || status === "IN_REVIEW");
    });
  }, [submissions, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const pagination = getPagination(page, totalPages);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Queue</h1>
          <p className="text-slate-500">Manage submissions</p>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2 w-4 h-4 text-slate-400" />
          <Input
            className="pl-8"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="grid grid-cols-12 text-xs font-semibold">
          <div className="col-span-4">App</div>
          <div className="col-span-3">Developer</div>
          <div className="col-span-2">Version</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1 text-right">Action</div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedData.map((sub) => {
            const isClaimed = sub.status === "IN_REVIEW";

            return (
              <div key={sub.id} className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-4">{sub.appName}</div>
                <div className="col-span-3">{sub.developerName}</div>
                <div className="col-span-2">{sub.version}</div>
                <div className="col-span-2">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </div>

                <div className="col-span-1 flex gap-2 justify-end">
                  {/* CLAIM */}
                  {!isClaimed && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isClaiming}
                      onClick={() => claimSubmission(sub.id)}
                    >
                      <Hand className="w-4 h-4 mr-1" />
                      Claim
                    </Button>
                  )}

                  {/* REVIEW - chỉ hiện khi đã claim (IN_REVIEW) */}
                  {isClaimed && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/reviews/${sub.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* PAGINATION */}
          <div className="flex justify-between p-4">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </Button>

            <div className="flex gap-1">
              {pagination.map((p, i) =>
                p === "..." ? (
                  <span key={i}>...</span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "primary" : "outline"}
                    onClick={() => setPage(Number(p))}
                  >
                    {p}
                  </Button>
                ),
              )}
            </div>

            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewQueue;
