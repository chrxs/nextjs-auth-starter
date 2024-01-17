"use client";

import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { ResetPasswordSchema } from "@/auth/schemas";
import resetPassword, { FormValues } from "@/auth/actions/reset-password";
import { Button, Input, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await resetPassword(data, token);

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
          type="password"
          placeholder="password"
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
