import VerifyOTPView from "@/features/auth/verify-otp/view";
import React, { Suspense } from "react";

function VerifyOTP() {
  return (
    <Suspense fallback="loading">
      <VerifyOTPView />;
    </Suspense>
  );
}

export default VerifyOTP;
