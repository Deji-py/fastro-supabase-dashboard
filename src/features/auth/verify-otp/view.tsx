import { Container, Divider, Paper, Stack, Text, Title } from "@mantine/core";
import { Lock } from "lucide-react";
import React from "react";
import VerifyOTPForm from "./VerifyOTPForm";

function VerifyOTPView() {
  return (
    <Container w={420} py={40}>
      <Paper radius="md" p="xl" withBorder>
        <Stack mb="lg">
          <Lock size={22} />
          <Title order={2}>Verify OTP</Title>

          <Text size="sm" c="dimmed">
            We have sent an OTP to your email address
          </Text>
        </Stack>
        <Divider my="md" />
        <VerifyOTPForm />
      </Paper>
    </Container>
  );
}

export default VerifyOTPView;
