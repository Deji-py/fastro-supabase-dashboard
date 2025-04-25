"use client";
import { z } from "zod";
import Link from "next/link";
import {
  Paper,
  Title,
  Text,
  Container,
  Group,
  Divider,
  Center,
  useMantineTheme,
  Stack,
  Image,
} from "@mantine/core";
import NextImage from "next/image";
import FormValidator from "@/utils/FormValidator";
import SignupForm from "./SignupForm";
import { APP_NAME } from "@/app_meta/constants";
import { APP_LOGO_BLACK } from "@/app_meta/brand";

// Signup schema
export const signupschema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

//When implementing the View also ensure you implement verify-otp view as well and redierct there in signUPForm

export default function SignupView() {
  const theme = useMantineTheme();

  return (
    <Container w={420} py={40}>
      <Paper radius="md" p="xl" withBorder>
        <Stack mb="lg">
          <Stack mb="lg">
            <Group>
              <Image
                component={NextImage}
                src={APP_LOGO_BLACK}
                alt="app logo"
                w="auto"
                h={20}
                fit="contain"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </Group>
            <Title c={"black"} order={2}>
              {APP_NAME}
            </Title>
          </Stack>
          <Text size="sm" c="dimmed">
            Create an account to access the dashboard
          </Text>
        </Stack>

        <Divider my="md" />

        <FormValidator schema={signupschema}>
          {({ form }) => <SignupForm form={form} />}
        </FormValidator>

        <Divider my="md" />

        <Center mt="sm">
          <Text size="sm" c="dimmed">
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: theme.colors[theme.primaryColor][6],
                marginLeft: 4,
              }}
            >
              Log in
            </Link>
          </Text>
        </Center>
      </Paper>
    </Container>
  );
}
