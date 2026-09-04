"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const type = params.get("type");

    if (type === "magiclink" || type === "signup" || accessToken) {
      setStatus("success");
      setMessage("Email confirmed successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } else {
      setStatus("error");
      setMessage("Invalid confirmation link");
    }
  }, [router]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-canvas rounded-xl p-8 shadow-[0_0_0_1px_rgba(14,15,12,0.12)] text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-pale rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-ink" />
            </div>
            <h1 className="font-display text-display-sm text-ink mb-2">
              Confirming your email...
            </h1>
            <p className="text-body-md text-muted">Please wait</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-positive/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-positive" />
            </div>
            <h1 className="font-display text-display-sm text-ink mb-2">
              Email Confirmed!
            </h1>
            <p className="text-body-md text-muted mb-6">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-negative/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-negative" />
            </div>
            <h1 className="font-display text-display-sm text-ink mb-2">
              Confirmation Failed
            </h1>
            <p className="text-body-md text-muted mb-6">{message}</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 px-6 bg-primary text-on-primary font-button-md rounded-xl hover:scale-[1.05] active:scale-[0.95] transition-transform flex items-center justify-center gap-2"
            >
              Back to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
