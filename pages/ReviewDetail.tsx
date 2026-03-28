import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Monitor,
  FileJson,
  Activity,
} from "lucide-react";

import { AppStatus, AppSubmission, SecurityCheckItem } from "../types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "../components/ui";

import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi } from "../hooks/data/useAdmin/api";

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  // ✅ FETCH DATA THẬT
  const { data, isLoading } = useQuery({
    queryKey: ["submission-detail", id],
    queryFn: () => adminApi.getSubmissionDetail(id!),
    enabled: !!id,
  });

  // ✅ MAP DATA (QUAN TRỌNG)
  const mapSubmission = (item: any): AppSubmission => ({
    id: item.id,

    appId: item.app_id || item.id,
    appName: item.app_name || "",
    developerName: item.developer_name || "",
    developerId: item.developer_id || "",

    version: item.version_number || "1.0.0",
    submittedAt: item.submitted_at || new Date().toISOString(),

    status: item.status?.toUpperCase() || "IN_REVIEW",

    manifest: item.manifest || { permissions: [] },

    sourceUrl: item.source_url || "",
    previewUrl: item.preview_url || "",

    securityChecklist: item.security_checklist || [],
  });

  const submission: AppSubmission | null = data?.data
    ? mapSubmission(data.data)
    : null;

  const [checklist, setChecklist] = useState<SecurityCheckItem[]>(
    submission?.securityChecklist || [],
  );

  // ⚠️ FIX: sync checklist khi data load xong
  React.useEffect(() => {
    if (submission) {
      setChecklist(submission.securityChecklist || []);
    }
  }, [data]);

  // ✅ MUTATIONS
  const approveMutation = useMutation({
    mutationFn: () => adminApi.approveSubmission(submission!.id),
    onSuccess: () => navigate("/reviews"),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectSubmission(submission!.id, rejectReason),
    onSuccess: () => navigate("/reviews"),
  });

  const handleCheckToggle = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleApprove = () => {
    if (!submission) return;

    if (!checklist.every((i) => !i.required || i.checked)) {
      alert("Please complete all required security checks.");
      return;
    }

    approveMutation.mutate();
  };

  const handleReject = () => {
    if (!submission || !rejectReason) return;
    rejectMutation.mutate();
  };

  if (isLoading)
    return (
      <div className="p-10 flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );

  if (!submission)
    return <div className="p-10 text-center">Submission not found</div>;

  const allChecksPassed = checklist.every((i) => !i.required || i.checked);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/reviews")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {submission.appName}
              <Badge variant="outline" className="ml-3 text-sm">
                {submission.version}
              </Badge>
            </h1>
            <p className="text-sm text-slate-500">
              by {submission.developerName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Source
          </Button>

          <Button
            variant="destructive"
            onClick={() => setShowRejectModal(true)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>

          <Button
            variant="primary"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApprove}
            disabled={!allChecksPassed || approveMutation.isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* LEFT */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <ShieldAlert className="w-5 h-5 mr-2 text-blue-500" />
                Security Checklist
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckToggle(item.id)}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manifest</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs">
                {JSON.stringify(submission.manifest, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submission.manifest?.permissions?.map((p: string) => (
                <Badge key={p}>{p}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT (PREVIEW) */}
        <div className="lg:col-span-2">
          <iframe
            src={submission.previewUrl}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <Card className="w-96 p-4">
            <CardHeader>
              <CardTitle>Reject Submission</CardTitle>
            </CardHeader>

            <CardContent>
              <textarea
                className="w-full border p-2"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end mt-4 space-x-2">
                <Button onClick={() => setShowRejectModal(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
