import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye } from "lucide-react";
import { AppStatus, AppSubmission } from "../types";
import {
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui";
import { useReviewQueue } from "../hooks/data/useAdmin/useReviewQueue";

const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  // ✅ Gọi API thật bằng React Query
  const { data, isLoading } = useReviewQueue("pending");

  // ✅ Mapping data từ backend → frontend
  const mapSubmission = (item: any): AppSubmission => ({
    id: item.id,

    appId: item.app_id || item.id,
    appName: item.app_name || "",
    developerName: item.developer_name || "",
    developerId: item.developer_id || "",

    version: item.version || "1.0.0",
    submittedAt: item.submitted_at || new Date().toISOString(),

    status: item.status?.toUpperCase() || "IN_REVIEW",

    // ✅ các field bị thiếu → fallback
    manifest: item.manifest || {},
    sourceUrl: item.source_url || "",
    previewUrl: item.preview_url || "",

    securityChecklist: item.security_checklist || {
      hasExternalScripts: false,
      usesEval: false,
      hasInlineScripts: false,
    },
  });

  // ✅ Transform data
  const submissions: AppSubmission[] = data?.data?.map(mapSubmission) || [];
  console.log(data);

  // ✅ Filter search
  const filteredSubmissions = submissions.filter(
    (s) =>
      s.appName?.toLowerCase().includes(filter.toLowerCase()) ||
      s.developerName?.toLowerCase().includes(filter.toLowerCase()),
  );

  const getStatusBadge = (status: AppStatus) => {
    switch (status) {
      case AppStatus.IN_REVIEW:
        return <Badge variant="warning">In Review</Badge>;
      case AppStatus.APPROVED:
        return <Badge variant="success">Approved</Badge>;
      case AppStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
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
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No pending submissions found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="grid grid-cols-12 items-center p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-4 flex items-center space-x-3 pl-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                      {sub.appName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {sub.appName}
                      </p>
                      <p className="text-xs text-slate-500">ID: {sub.appId}</p>
                    </div>
                  </div>

                  <div className="col-span-3 text-sm text-slate-600">
                    {sub.developerName}
                  </div>

                  <div className="col-span-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {sub.version}
                    </Badge>
                  </div>

                  <div className="col-span-2 text-sm text-slate-500">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </div>

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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewQueue;
