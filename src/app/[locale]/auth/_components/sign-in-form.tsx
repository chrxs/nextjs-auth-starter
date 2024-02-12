"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { SignInSchema } from "@/auth/schemas";
import { AUTH_FORGOT_PASSWORD_PATH } from "@/auth/routes";
import signInWithCredentials, {
  FormValues,
} from "@/auth/actions/sign-in-with-credentials";
import resendTwoFactorToken from "@/auth/actions/resend-two-factor-token";
import { Alert, Button, Input, Link, LoadingIndicator } from "@/components";
import { getErrorsForReactHookFormFromServerResponse } from "@/lib/utils";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [showTwoFactorCode, setShowTwoFactorCode] = useState(false);
  const [isResendingTwoFactorToken, setIsResendingTwoFactorToken] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  const {
    handleSubmit,
    register,
    setError,
    getValues,
    formState: { errors, isSubmitting },
    reset,
    resetField,
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearSuccessMessage();
    const response = await signInWithCredentials(
      data,
      callbackUrl ?? undefined,
    );

    setSuccessMessage(response?.success || null);

    if (!response) {
      // to maintain isSubmitting state whilst redirecting
      return new Promise(() => {});
    }

    resetField("code");

    if (!response?.twoFactor) {
      resetField("password");
    }

    setShowTwoFactorCode(Boolean(response?.twoFactor));

    // set errors from server response
    flow(
      getErrorsForReactHookFormFromServerResponse,
      map(({ name, error, config }) => {
        setError(name, error, config);
      }),
    )(response);
  };

  const onResendTwoFactorToken = async () => {
    clearSuccessMessage();
    setIsResendingTwoFactorToken(true);
    const response = await resendTwoFactorToken({
      email: getValues("email"),
    });
    setSuccessMessage(response?.success || null);
    if (response?.error) {
      reset();
      setShowTwoFactorCode(false);
    }
    setIsResendingTwoFactorToken(false);
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

          <button
            type="button"
            disabled={isResendingTwoFactorToken}
            onClick={onResendTwoFactorToken}
          >
            {isResendingTwoFactorToken ? "loading..." : "Resend code"}
          </button>
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

            <Link href={AUTH_FORGOT_PASSWORD_PATH}>Forgot password?</Link>
          </div>
        </>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || isResendingTwoFactorToken}
      >
        {showTwoFactorCode ? "Submit" : "Sign In"}
      </Button>
    </form>
  );
}
