"use client";
import React, { useState, useEffect } from "react";
import { Text, Button, Group, Stack, PinInput } from "@mantine/core";
import { useFastroAuth } from "@/lib/Fastro";
import { useRouter, useSearchParams } from "next/navigation";
import { resend_otp } from "@/services/api/supabase/auth";
import { FastroNotification } from "@/utils/FastroNotification";

function VerifyOTPForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const { VERIFY_OTP } = useFastroAuth();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
      handleResend();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleVerify = async () => {
    if (!email || otp.length !== 6) return;
    await VERIFY_OTP(email, otp, setLoading, () => {
      router.push("/dashboard");
    });
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      await resend_otp({ email });
      setCountdown(60);
      FastroNotification({
        type: "success",
        title: "Please Verify your Account",
        message: "OTP sent to your email",
      });
    } catch (error: any) {
      FastroNotification({
        type: "error",
        title: error?.message || "Unable to send OTP",
        message: "Please try again ",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Stack>
      <PinInput
        type="number"
        length={6}
        size="lg"
        value={otp}
        onChange={setOtp}
        oneTimeCode
      />

      <Button
        fullWidth
        size="md"
        onClick={handleVerify}
        loading={loading}
        disabled={otp.length !== 6}
      >
        Verify
      </Button>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Didn’t receive the code?
        </Text>

        <Button
          variant="transparent"
          size="xs"
          style={{ textDecoration: "underline" }}
          onClick={handleResend}
          disabled={countdown > 0}
          loading={resendLoading}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
        </Button>
      </Group>
    </Stack>
  );
}

export default VerifyOTPForm;
