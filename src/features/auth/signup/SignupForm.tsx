import React, { useState } from "react";
import { UseFormReturnType } from "@mantine/form";
import FastroInput, { FastroInputProps } from "@/utils/FastroInput";
import { Button, Stack } from "@mantine/core";
import { useFastroAuth } from "@/lib/Fastro";
import { useRouter } from "next/navigation";

type SignupFormValues = {
  email: string;
  password: string;
  confirm_password: string;
};

type SignupProps = {
  form: UseFormReturnType<SignupFormValues>;
};

const formInput = (form: any): FastroInputProps[] => [
  {
    form: form,
    input_type: "input",
    label: "Email",
    name: "email",
    placeholder: "enter your emails",
  },
  {
    form: form,
    input_type: "password",
    label: "Paasword",
    name: "password",
  },
  {
    form: form,
    input_type: "input",
    label: "Confirm Password",
    name: "confirm_password",
  },
];

function SignupForm({ form }: SignupProps) {
  // handle Provider here

  const { SIGNUP } = useFastroAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = (data: SignupFormValues) => {
    SIGNUP(data, setLoading, () => {
      router.push(`/verify-otp?email=${data.email}`);
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSignup)}>
      <Stack>
        {/* Fetch Form  */}
        {formInput(form).map((props, index) => (
          <FastroInput {...props} key={index} />
        ))}
        <Button loading={loading} type="submit" w={"100%"}>
          Signup
        </Button>
      </Stack>
    </form>
  );
}

export default SignupForm;
