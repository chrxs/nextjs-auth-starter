"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { ForgotPasswordSchema } from "@/auth/schemas";
import forgotPassword, { FormValues } from "@/auth/actions/forgot-password";
import { Alert, Button, Input, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearSuccessMessage();
    const response = await forgotPassword(data);

    if (response?.success) {
      setSuccessMessage(response?.success || null);
      reset();
    }

    // set errors from server response
    flow(
      getErrorsFromServerResponse,
      map(({ name, error, config }) => {
        setError(name, error, config);
      }),
    )(response);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {isSubmitting && <LoadingIndicator />}

      {successMessage && <Alert type="success">{successMessage}</Alert>}

      {errors?.root?.message && (
        <Alert type="error">{errors.root.message}</Alert>
      )}

      <div className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="email"
          autoComplete="username"
          {...register("email")}
        />
        <ErrorMessage errors={errors} name="email" />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Send reset email
      </Button>
    </form>
  );
}
