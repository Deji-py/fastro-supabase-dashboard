import {
  logout,
  resend_otp,
  supabase_login_with_email,
  supabase_signup_with_mail,
  verify_otp_code,
} from "@/services/api/supabase/auth";

import { AUTH_ACTIONS, loginParam, PROVIDER_TYPE } from "@/types/auth_types";
import { FastroNotification } from "@/utils/FastroNotification";

function AuthProvider(provider: PROVIDER_TYPE): AUTH_ACTIONS {
  switch (provider) {
    case "supabase":
      return {
        // Login
        LOGIN: async (
          data: loginParam,
          setLoading: (value: boolean) => void,
          onSuccess?: () => void,
          verifyOTPRedirect?: () => void
        ) => {
          try {
            setLoading(true);

            await supabase_login_with_email(data);

            FastroNotification({
              type: "success",
              title: "Welcome Admin",
              message: "Sign in successful.",
            });

            onSuccess?.();
          } catch (error: any) {
            const isEmailNotConfirmed =
              error.message?.includes("Email not confirmed") ||
              error.message?.includes("email hasn't been confirmed") ||
              error.status === 403;

            if (isEmailNotConfirmed) {
              const result = await resend_otp({ email: data.email });

              FastroNotification({
                type: "success",
                title: "Please Verify your Account",
                message: "OTP sent to your email",
              });

              if (result) {
                verifyOTPRedirect?.();
              }
              return;
            }

            if (error.status === 500) {
              FastroNotification({
                type: "error",
                title: error?.message || "Sign-in failed",
                message: "Please try again.",
              });
              return;
            }

            FastroNotification({
              type: "error",
              title: error?.message || "Sign-in failed",
              message: "Please try again.",
            });
          } finally {
            setLoading(false);
          }
        },

        // Signup
        SIGNUP: async (
          data: loginParam,
          setLoading: (value: boolean) => void,
          onSuccess?: () => void
        ) => {
          try {
            setLoading(true);
            await supabase_signup_with_mail(data);

            FastroNotification({
              type: "success",
              title: "Account Created",
              message: "Check your email to verify your account.",
            });

            onSuccess?.();
          } catch (error: any) {
            FastroNotification({
              type: "error",
              title: error?.message || "Sign-up failed",
              message: "Please try again.",
            });
          } finally {
            setLoading(false);
          }
        },
        // Verify OTP
        VERIFY_OTP: async (
          email: string,
          token: string,
          setLoading: (value: boolean) => void,
          onSuccess?: () => void
        ) => {
          try {
            setLoading(true);
            await verify_otp_code({ email, token });

            FastroNotification({
              type: "success",
              title: "Account Verified",
              message: "You can now log in.",
            });

            onSuccess?.();
          } catch (error: any) {
            FastroNotification({
              type: "error",
              title: error?.message || "Verification failed",
              message: "Please try again.",
            });
          } finally {
            setLoading(false);
          }
        },

        //LOGOUT
        LOGOUT: async (onSuccess?: () => void) => {
          try {
            FastroNotification({
              type: "info",
              title: "Logging Out Admin User",
              message: "Please wait while we log you out",
            });
            await logout();

            onSuccess?.();
          } catch (error: any) {
            FastroNotification({
              type: "error",
              title: error?.message || "Logout failed",
              message: "Please try again.",
            });
          }
        },
      };

    case "rest":
    default:
      return {
        LOGIN: async () => {
          console.log("Sign-in with rest not implemented yet");
        },
        SIGNUP: async () => {
          console.log("Sign-up with rest not implemented yet");
        },
        VERIFY_OTP: async () => {
          console.log("OTP verification with rest not implemented yet");
        },
        LOGOUT: async () => {
          console.log("OTP verification with rest not implemented yet");
        },
      };
  }
}

export default AuthProvider;
