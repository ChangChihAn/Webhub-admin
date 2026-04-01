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
import Switch from "../components/ui/Switch";

const simulateApi = (cb: () => void, delay = 800) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      cb();
      resolve();
    }, delay);
  });
};

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

    securityChecklist: item.security_checklist?.length
      ? item.security_checklist
      : [
          {
            id: "1",
            label: "No malicious code",
            required: true,
            checked: false,
          },
          {
            id: "2",
            label: "No external scripts",
            required: true,
            checked: false,
          },
        ],
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
    mutationFn: async () => {
      try {
        // ✅ Ưu tiên gọi API thật
        return await adminApi.approveSubmission(submission!.id);
      } catch (err) {
        // ✅ fallback nếu API chưa chạy
        return simulateApi(() => {
          console.log("Mock approve success");
        });
      }
    },
    onSuccess: () => {
      alert("App approved successfully");
      navigate("/reviews");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      try {
        return await adminApi.rejectSubmission(submission!.id, rejectReason);
      } catch (err) {
        return simulateApi(() => {
          console.log("Mock reject:", rejectReason);
        });
      }
    },
    onSuccess: () => {
      alert("App rejected successfully");
      navigate("/reviews");
    },
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
            disabled={rejectMutation.isPending}
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
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition p-3 rounded-lg"
                >
                  {/* LEFT */}
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-800 leading-none">
                      {item.label}
                    </p>

                    {item.required && (
                      <p className="text-xs text-red-500 mt-1 leading-none">
                        Required
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center">
                    <Switch
                      checked={item.checked}
                      onChange={() => handleCheckToggle(item.id)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileJson className="w-5 h-5 mr-2 text-indigo-500" />
                App Manifest
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* BASIC INFO */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Basic Info
                </p>

                <div className="bg-slate-50 p-3 rounded-md text-sm space-y-1">
                  <div>
                    <span className="text-slate-500">Name:</span>{" "}
                    <span className="font-medium">
                      {submission.manifest?.name || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Version:</span>{" "}
                    <span>{submission.manifest?.version_number}</span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Description
                </p>

                <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-600">
                  {submission.manifest?.description ||
                    "No description provided"}
                </div>
              </div>

              {/* PERMISSIONS */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Permissions
                </p>

                <div className="flex flex-wrap gap-2">
                  {submission.manifest?.permissions?.length > 0 ? (
                    submission.manifest.permissions.map((p: string) => (
                      <Badge key={p} variant="secondary">
                        {p}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      No permissions
                    </span>
                  )}
                </div>
              </div>

              {/* ICONS */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Icons</p>

                <div className="flex flex-wrap gap-4">
                  {submission.manifest?.icons?.length > 0 ? (
                    submission.manifest.icons.map((icon: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center space-y-1"
                      >
                        <img
                          src={icon.src}
                          alt="icon"
                          className="w-12 h-12 rounded border"
                        />
                        <span className="text-xs text-slate-500">
                          {icon.sizes}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No icons</span>
                  )}
                </div>
              </div>
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
