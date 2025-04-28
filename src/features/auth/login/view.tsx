"use client";

import { z } from "zod";
import Link from "next/link";
import {
  Paper,
  Title,
  Text,
  Container,
  Box,
  Group,
  Divider,
  Center,
  useMantineTheme,
  Stack,
  Image,
} from "@mantine/core";
import NextImage from "next/image";
import FormValidator from "@/utils/FormValidator";
import LoginForm from "./LoginForm";
import { APP_NAME } from "@/app_meta/constants";
import { APP_LOGO_BLACK } from "@/app_meta/brand";

// Define schema for login
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function View() {
  const theme = useMantineTheme();

  return (
    <Container w={420} py={40}>
      <Paper radius="md" p="xl" withBorder>
        <Stack mb="lg">
          <Group>
            <Image
              component={NextImage}
              src={APP_LOGO_BLACK}
              alt="app logo"
              w="auto"
              h={35}
              fit="contain"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Group>
          <Title c={"black"} order={2}>
            {APP_NAME}
          </Title>
          <Text size="sm" c="dimmed">
            Enter your credentials to access the dashboard
          </Text>
        </Stack>

        <Divider my="md" />

        <FormValidator schema={loginSchema}>
          {({ form }) => <LoginForm form={form} />}
        </FormValidator>

        <Divider my="md" />

        <Center mt="sm">
          <Text size="sm" c="dimmed">
            Don't have an account?{" "}
            <Link
              href="/signup"
              style={{
                color: theme.colors[theme.primaryColor][6],
                marginLeft: 4,
              }}
            >
              Sign up
            </Link>
          </Text>
        </Center>
      </Paper>
    </Container>
  );
}
