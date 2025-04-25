"use client";
import type { z, ZodTypeAny } from "zod";
import { useForm } from "@mantine/form";
import type { ReactNode } from "react";

type FormValidatorProps<T extends ZodTypeAny> = {
  schema: T;
  initialValues?: Partial<z.infer<T>>;
  children: (props: {
    form: ReturnType<typeof useForm<z.infer<T>>>;
  }) => ReactNode;
};

export default function FormValidator<T extends ZodTypeAny>({
  schema,
  initialValues,
  children,
}: FormValidatorProps<T>) {
  // Use provided initialValues or create empty default values
  const defaultValues = initialValues || ({} as z.infer<T>);

  const form = useForm<z.infer<T>>({
    initialValues: defaultValues,
    validate: (values) => {
      const result = schema.safeParse(values);

      if (result.success) {
        return {};
      }

      // Format Zod errors into Mantine's expected format
      const errors: Record<string, string> = {};

      if (result.error) {
        result.error.errors.forEach((error) => {
          const path = error.path.join(".");
          if (path) {
            errors[path] = error.message;
          }
        });
      }

      return errors;
    },
  });

  return <>{children({ form })}</>;
}
