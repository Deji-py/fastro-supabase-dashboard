"use server";

import { createClient } from "@/services/supabase/server";
import { loginParam } from "@/types/auth_types";

// Login
export async function supabase_login_with_email({
  email,
  password,
}: loginParam) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data || true;
  } catch (error) {
    throw error;
  }
}

// Signup
export async function supabase_signup_with_mail({
  email,
  password,
}: loginParam) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return data || true;
  } catch (error) {
    throw error;
  }
}

// Resend OTP
export async function resend_otp({ email }: { email: string }) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) error;
    return data || true;
  } catch (error) {
    throw error;
  }
}

// ✅ Verify OTP
export async function verify_otp_code({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      type: "signup",
      email,
      token,
    });

    if (error) throw new Error(error.message);

    return data || true;
  } catch (error) {
    throw error;
  }
}

// get user
export const fetchUser = async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return data.user;
  } catch (error) {
    throw error;
  }
};

//logout user
export async function logout() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);
  } catch (error) {
    throw error;
  }
}
