"use client";

import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map, get } from "lodash/fp";

import { RegisterSchema } from "@/auth/schemas";
import registerUser, { FormValues } from "@/auth/actions/register";
import { Button, Input, LoadingIndicator } from "@/components";
import { getErrorsFromServerResponse } from "../_utils";

const mapWithIndex = (map as any).convert({ cap: false });

export default function RegisterForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { submitCount, isValid, errors, isSubmitting },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await registerUser(data);

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
