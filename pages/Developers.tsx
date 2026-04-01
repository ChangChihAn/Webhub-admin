import React from "react";
import { Mail, MoreVertical, ShieldBan, CheckCircle } from "lucide-react";
import { Button, Card, CardContent, Badge } from "../components/ui";
import { useDevelopers } from "../hooks/data/useAdmin/useDevelopers";
import { useUpdateUserRole } from "../hooks/data/useAdmin/useUpdateUserRole";
import { Developer } from "../types";

const Developers: React.FC = () => {
  const { data: developers = [], isLoading } = useDevelopers();

  const updateRoleMutation = useUpdateUserRole();

  const mapDeveloper = (item: any): Developer => ({
    id: item.id,
    email: item.email,
    fullName: item.full_name,
    isActive: item.is_active,
    createdAt: item.created_at,
    appCount: item.app_count,
    role: item.role,
  });

  const handleToggleRole = (dev: Developer) => {
    const newRole = dev.role === "admin" ? "developer" : "admin";

    updateRoleMutation.mutate({
      id: dev.id,
      role: newRole,
    });
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Developers</h1>
          <p className="text-slate-500">
            Manage registered developer accounts.
          </p>
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : developers.length === 0 ? (
          <div>No developers found</div>
        ) : (
          developers.map((dev) => (
            <Card key={dev.id} className="overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-500" />

              <CardContent className="p-6">
                {/* ================= HEADER ================= */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                      {dev.fullName?.charAt(0) || "U"}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {dev.fullName}
                      </h3>
                      <p className="text-xs text-slate-500">ID: {dev.id}</p>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>

                {/* ================= INFO ================= */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="w-4 h-4 mr-2 opacity-70" />
                    {dev.email}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={dev.isActive ? "success" : "destructive"}>
                      {dev.isActive ? "ACTIVE" : "SUSPENDED"}
                    </Badge>

                    <span className="text-xs text-slate-400">
                      {new Date(dev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 🔥 App Count */}
                  <div className="text-xs text-slate-500">
                    Total Apps:{" "}
                    <span className="font-semibold">{dev.appCount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">Role</span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleRole(dev)}
                  >
                    {dev.role === "admin" ? "Set Developer" : "Set Admin"}
                  </Button>
                </div>

                <Badge variant="secondary">{dev.role?.toUpperCase()}</Badge>

                {/* ================= ACTION ================= */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Apps
                  </Button>

                  {dev.isActive ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <ShieldBan className="w-3 h-3 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-green-500 hover:text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Developers;
