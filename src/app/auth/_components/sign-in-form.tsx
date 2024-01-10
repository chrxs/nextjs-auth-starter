"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";

import { SignInSchema } from "@/auth/schemas";
import signInWithCredentials, {
  FormValues,
} from "@/auth/actions/sign-in-with-credentials";
import { Button, Input, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

export default function SignInForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await signInWithCredentials(data);

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
        Sign In
      </Button>
    </form>
  );
}
