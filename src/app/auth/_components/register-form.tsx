"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { RegisterSchema } from "@/auth/schemas";
import registerUser, { FormValues } from "@/auth/actions/register";
import { Alert, Button, Input, LoadingIndicator } from "@/components";
import { getErrorsForReactHookFormFromServerResponse } from "@/lib/utils";

export default function RegisterForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearSuccessMessage();
    const response = await registerUser(data);

    if (response?.success) {
      setSuccessMessage(response?.success || null);
      reset();
    }

    // set errors from server response
    flow(
      getErrorsForReactHookFormFromServerResponse,
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
          type="name"
          placeholder="name"
          autoComplete="given-name"
          {...register("name")}
        />
        <ErrorMessage errors={errors} name="name" />
      </div>

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
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Register
      </Button>
    </form>
  );
}
