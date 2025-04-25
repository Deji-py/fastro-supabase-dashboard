import React, { useState } from "react";
import { UseFormReturnType } from "@mantine/form";
import FastroInput from "@/utils/FastroInput";
import { Button, Stack } from "@mantine/core";
import { useFastroAuth } from "@/lib/Fastro";
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  form: UseFormReturnType<LoginFormValues>;
};

function LoginForm({ form }: LoginFormProps) {
  const { LOGIN } = useFastroAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (data: LoginFormValues) => {
    LOGIN(
      data,
      setLoading,
      () => {
        router.push("/dashboard");
      },
      () => router.push(`/verify-otp?email=${data.email}`)
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleLogin)}>
      <Stack>
        <FastroInput
          input_type="input"
          label="Email"
          name="email"
          form={form}
          placeholder="Enter your email"
        />
        <FastroInput
          input_type="password"
          label="Password"
          name="password"
          form={form}
          placeholder="Enter your password"
        />
        <Button loading={loading} type="submit" w="100%">
          Login
        </Button>
      </Stack>
    </form>
  );
}

export default LoginForm;
