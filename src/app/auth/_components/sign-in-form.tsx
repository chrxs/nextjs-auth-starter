"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { SignInSchema } from "@/auth/schemas";
import signInWithCredentials, {
  FormValues,
} from "@/auth/actions/sign-in-with-credentials";
import { Alert, Button, Input, Link, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

export default function SignInForm() {
  const [showTwoFactorCode, setShowTwoFactorCode] = useState(false);
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
    // resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearSuccessMessage();
    const response = await signInWithCredentials(data);

    setSuccessMessage(response?.success || null);

    if (response?.errors) {
      reset();
    }

    if (response?.twoFactor) {
      setShowTwoFactorCode(true);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {isSubmitting && <LoadingIndicator />}

      {successMessage && <Alert type="success">{successMessage}</Alert>}

      {errors?.root?.message && (
        <Alert type="error">{errors?.root?.message}</Alert>
      )}

      {showTwoFactorCode && (
        <div className="flex flex-col gap-2">
          <Input {...register("code")} />
          <ErrorMessage errors={errors} name="code" />
        </div>
      )}

      {!showTwoFactorCode && (
        <>
          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="email"
              autoComplete="username"
              {...register("email")}
            />
            <ErrorMessage errors={errors} name="email" />
          </div>

          <div className="flex flex-col gap-2">
            <Input
              type="password"
              placeholder="password"
              autoComplete="current-password"
              {...register("password")}
            />
            <ErrorMessage errors={errors} name="password" />

            <Link href="/auth/forgot-password">Forgot password?</Link>
          </div>
        </>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {showTwoFactorCode ? "Submit" : "Sign In"}
      </Button>
    </form>
  );
}
