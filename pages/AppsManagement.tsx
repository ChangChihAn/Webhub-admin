import React, { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
} from "../components/ui";

import { useApps, useUpdateAppStatus } from "../hooks/data/useAdmin/useApps";

// ========================
// MAPPING
// ========================
const mapApp = (item: any) => ({
  id: item.id,
  name: item.name,
  developerName: item.developer_name || "Unknown",
  status: item.status,
  createdAt: item.created_at,
  isFeatured: item.is_featured,
});

// ========================
// COMPONENT
// ========================
const AppsManagement: React.FC = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useApps();
  const updateStatus = useUpdateAppStatus();

  const apps = data?.data?.map(mapApp) || [];

  const filteredApps = apps.filter(
    (a: any) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.developerName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleStatus = (app: any) => {
    const newStatus = app.status === "published" ? "suspended" : "published";

    updateStatus.mutate({
      appId: app.id,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Apps Management</h1>
          <p className="text-slate-500">
            Manage all applications in the system
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search apps..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Apps</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No apps found</div>
          ) : (
            <div className="divide-y">
              {filteredApps.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50"
                >
                  {/* LEFT */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center font-bold">
                      {app.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">{app.name}</p>
                      <p className="text-xs text-slate-500">
                        by {app.developerName}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        app.status === "published" ? "success" : "destructive"
                      }
                    >
                      {app.status.toUpperCase()}
                    </Badge>

                    {app.isFeatured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(app)}
                      disabled={updateStatus.isPending}
                    >
                      {app.status === "published" ? "Suspend" : "Publish"}
                    </Button>

                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
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

export default AppsManagement;
