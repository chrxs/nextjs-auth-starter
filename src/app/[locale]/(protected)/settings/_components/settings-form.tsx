"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow, map } from "lodash/fp";
import { useSession } from "next-auth/react";

import updateUserSettings, {
  FormValues,
} from "../_actions/update-user-settings";
import UserSettingsSchema from "../_schemas/user-settings-schema";
import { type ExtendedUser } from "@/auth/config";

import { Alert, Button, Input, LoadingIndicator } from "@/components";
import { getErrorsForReactHookFormFromServerResponse } from "@/lib/utils";

interface Props {
  user: ExtendedUser;
}

export default function SettingsForm({ user }: Props) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const clearSuccessMessage = () => setSuccessMessage(null);
  const { data: session, update, status } = useSession();

  const isLoading = status === "loading";

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      // email: user?.email || undefined,
      // role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      password: undefined,
      newPassword: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearSuccessMessage();
    return updateUserSettings(data).then((response) => {
      if (response?.success) {
        setSuccessMessage(response?.success || null);
      }

      if (response?.user) {
        update({ user: response.user });
      }

      // set errors from server response
      flow(
        getErrorsForReactHookFormFromServerResponse,
        map(({ name, error, config }) => {
          setError(name, error, config);
        }),
      )(response);

      return response;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {(isSubmitting || isLoading) && <LoadingIndicator />}

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
          disabled
          value={user?.email || ""}
        />
      </div>

      <fieldset>
        <div className="flex flex-col gap-2">
          <Input
            type="password"
            placeholder="password"
            autoComplete="current-password"
            {...register("password")}
          />
          <ErrorMessage errors={errors} name="password" />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            type="password"
            placeholder="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          <ErrorMessage errors={errors} name="newPassword" />
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label>
          <input type="checkbox" {...register("isTwoFactorEnabled")} />
          Is two factor enabled?
        </label>
        <ErrorMessage errors={errors} name="isTwoFactorEnabled" />
      </div>

      <Button type="submit" disabled={isSubmitting || isLoading}>
        Update
      </Button>
    </form>
  );
}
