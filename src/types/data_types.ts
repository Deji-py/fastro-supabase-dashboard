import { ReactNode } from "react";

export type PaymentHistory = {
  id: number;
  created_at: string; // ISO timestamp string
  user_id: string | null;
  amount: number | null;
  total_credits: number | null;
  status: string | null;
  order_id: string | null;
  disbursement_status: string | null;
  users: {
    firstname: string;
    lastname: string;
    profile_pic: string;
  };
};

export interface BulkActionType<T extends Record<string, unknown>> {
  label: string;
  icon: ReactNode;
  onClick: (rows: T[]) => void;
  color?: string;
}
