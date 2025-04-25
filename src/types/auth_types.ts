import { Session, User, WeakPassword } from "@supabase/supabase-js";

export type PROVIDER_TYPE = "supabase" | "rest";

export type loginParam = {
  password: string;
  email: string;
  username?: string;
  captchaToken?: string;
  [key: string]: any;
};

export type supabase_session = {
  user: User;
  session: Session;
  weakPassword?: WeakPassword;
};

export type FASTRO_USER = {
  role: string;
  email: string;
  profile_pic?: string;
};

export type AUTH_ACTIONS = {
  LOGIN: (
    data: loginParam,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess?: () => void,
    verifyOTPRedirect?: () => void
  ) => Promise<void>;
  SIGNUP: (
    data: loginParam,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess?: () => void
  ) => Promise<void>;
  VERIFY_OTP: (
    email: string,
    token: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess?: () => void
  ) => Promise<void>;
  LOGOUT: (onSuccess?: () => void) => Promise<void>;
};
