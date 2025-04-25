"use client";

import AuthProvider from "@/providers/auth-provider";
import { fetchUser } from "@/services/api/supabase/auth";
import { AUTH_ACTIONS, FASTRO_USER, PROVIDER_TYPE } from "@/types/auth_types";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { supabaseClient } from "@/services/supabase/client";
import dataProvider from "@/providers/data_provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type FastroContextType = AUTH_ACTIONS & {
  user: FASTRO_USER | null;
};

const FastroContext = createContext<FastroContextType | undefined>(undefined);

type FastroProviderProps = {
  provider_type: PROVIDER_TYPE;
  children: ReactNode;
};

// Create context
const FastroDataContext = createContext<typeof dataProvider | undefined>(
  undefined
);

export const queryClient = new QueryClient();

export default function Fastro({
  children,
  provider_type,
}: FastroProviderProps) {
  const [user, setUser] = useState<FASTRO_USER | null>(null);

  const authActions = useMemo(
    () => AuthProvider(provider_type),
    [provider_type]
  );

  const handleFetchUser = async () => {
    try {
      const supabaseUser = await fetchUser();

      if (!supabaseUser) {
        setUser(null);
        return;
      }

      const { data: profile, error } = await supabaseClient
        .from("admin")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .single();

      if (error) {
        console.log(error);
        throw error;
      }

      setUser({
        ...supabaseUser,
        role: profile.role,
        profile_pic: profile.profile_pic,
        email: supabaseUser.user_metadata.email,
      });
    } catch (error: any) {
      setUser(null);
    }
  };

  useEffect(() => {
    handleFetchUser();
  }, [provider_type]);

  const contextValue: FastroContextType = {
    ...authActions,
    user,
  };

  return (
    <FastroContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <FastroDataContext.Provider value={dataProvider}>
          {children}
        </FastroDataContext.Provider>
      </QueryClientProvider>
    </FastroContext.Provider>
  );
}

export const useFastroAuth = (): FastroContextType => {
  const context = useContext(FastroContext);
  if (!context) {
    throw new Error("useFastroAuth must be used within a <Fastro /> provider");
  }
  return context;
};

// Hook to use the data provider
export const useFastroData = () => {
  const context = useContext(FastroDataContext);
  if (!context) {
    throw new Error(
      "useFastroData must be used within a <FastroDataProvider /> provider"
    );
  }
  return context;
};
