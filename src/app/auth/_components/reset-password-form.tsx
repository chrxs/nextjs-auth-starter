"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { ResetPasswordSchema } from "@/auth/schemas";
import resetPassword, { FormValues } from "@/auth/actions/reset-password";
import { Alert, Button, Input, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearSuccessMessage();
    const response = await resetPassword(data, token);

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
          type="password"
          placeholder="password"
          autoComplete="new-password"
          {...register("password")}
        />
        <ErrorMessage errors={errors} name="password" />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Reset password
      </Button>
    </form>
  );
}
