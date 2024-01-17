"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { ForgotPasswordSchema } from "@/auth/schemas";
import forgotPassword, { FormValues } from "@/auth/actions/forgot-password";
import { Button, Input, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await forgotPassword(data);

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

      {errors?.root?.message && <p>{errors.root.message}</p>}

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
