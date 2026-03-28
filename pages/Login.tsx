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
          console.log("LOGIN RESPONSE:", res);
          // 🔥 Nếu cần 2FA
          if (res.requires_2fa) {
            setRequires2FA(true);
            setTempToken(res.temp_token);
            return;
          }

          // 🔥 Nếu login trực tiếp (không có 2FA)
          if (res.access_token) {
            localStorage.setItem("accessToken", res.access_token);
            setUser(res.data);

            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
          }
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
          // 🔥 LƯU TOKEN CHUẨN
          localStorage.setItem("accessToken", res.access_token);

          setUser(res.data);

          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
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
