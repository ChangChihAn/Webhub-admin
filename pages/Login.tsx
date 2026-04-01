import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../App";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/atoms";
import { useLogin, useVerify2FA } from "../hooks/data/useAuth";
import { AxiosError } from "axios";
import { ApiError } from "../types";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const { mutate: login, isPending } = useLogin();
  const { mutate: verify2FA, isPending: isVerifying } = useVerify2FA();

  const [email, setEmail] = useState("admin@webhub.com");
  const [password, setPassword] = useState("Admin@123");

  const [error, setError] = useState("");

  // 🔥 2FA STATE
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [code, setCode] = useState("");

  // =========================
  // STEP 1: LOGIN
  // =========================
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("SUBMIT LOGIN");

    login(
      { email, password },
      {
        onSuccess: (res: any) => {
          console.log("LOGIN RESPONSE FULL:", res);

          // ===== 2FA =====
          const enable2FA = localStorage.getItem("enable2FA") !== "false";

          if (res.requires_2fa && enable2FA) {
            setRequires2FA(true);
            setTempToken(res.temp_token!);
            return;
          }

          if (res.requires_2fa && !enable2FA) {
            setError("2FA is required by server. Cannot bypass.");
            return;
          }

          // ===== FLEXIBLE PARSE =====
          const token = res.data?.access_token || res.access_token || res.token;

          const user = res.data?.user || res.user || res.data;

          if (!token || !user) {
            console.error("INVALID RESPONSE:", res);
            setError("Invalid response from server");
            return;
          }

          if (token) localStorage.setItem("accessToken", token);
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
          }

          navigate("/dashboard");
        },
        onError: (err) => {
          const axiosError = err as AxiosError<ApiError>;
          setError(
            axiosError.response?.data?.message ||
              "Invalid credentials or server error",
          );
        },
      },
    );
  };

  // =========================
  // STEP 2: VERIFY 2FA
  // =========================
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    verify2FA(
      {
        temp_token: tempToken,
        code: code,
      },
      {
        onSuccess: (res: any) => {
          const token = res.data?.access_token || res.access_token;

          const user = res.data?.user || res.user;

          if (!token || !user) {
            setError("Invalid 2FA response");
            return;
          }

          localStorage.setItem("accessToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);

          navigate("/dashboard");
        },
        onError: (err) => {
          const axiosError = err as AxiosError<ApiError>;
          setError(
            axiosError.response?.data?.message || "Invalid verification code",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-full">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">WebHub Admin</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {!requires2FA ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@webhub.com"
                disabled={isPending}
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isPending}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          ) : (
            /* ================= 2FA FORM ================= */
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <p className="text-sm text-slate-500 text-center">
                Enter 2FA verification code
              </p>

              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••••"
                disabled={isVerifying}
              />

              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
