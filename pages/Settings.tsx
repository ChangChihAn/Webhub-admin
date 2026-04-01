import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";

const Settings: React.FC = () => {
  const [enable2FA, setEnable2FA] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("enable2FA");
    if (saved !== null) {
      setEnable2FA(saved === "true");
    }
  }, []);

  const handleToggle = () => {
    const newValue = !enable2FA;
    setEnable2FA(newValue);
    localStorage.setItem("enable2FA", String(newValue));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        {/* <p className="text-slate-500">Manage system preferences</p> */}
        <p className="text-slate-500">Settings not included in MVP</p>
      </div>

      {/* CARD */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">
              Two-Factor Authentication (2FA)
            </p>
            <p className="text-sm text-slate-500">
              Enable or disable OTP verification on login
            </p>
          </div>

          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
              enable2FA ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                enable2FA ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Settings;
