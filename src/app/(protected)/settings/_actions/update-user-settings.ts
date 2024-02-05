"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { update } from "@/auth";
import db from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { getCurrentUser } from "@/auth/utils";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mail";
import UserSettingsSchema from "../_schemas/user-settings-schema";

export type ActionResponse = {
  success?: string;
  errors?: z.ZodIssue[];
  user?: any;
};

export type FormValues = z.infer<typeof UserSettingsSchema>;

function createRootErrorForReactHookForm(error: string): z.ZodIssue[] {
  return [
    {
      code: "custom",
      path: ["root"],
      message: error,
    },
  ];
}

export default async function updateUserSettings(
  formValues: FormValues,
): Promise<ActionResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      errors: createRootErrorForReactHookForm("Unauthorized"),
    };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      errors: createRootErrorForReactHookForm("Unauthorized"),
    };
  }

  if (user.isOAuth) {
    // formValues.email = undefined;
    formValues.password = undefined;
    formValues.newPassword = undefined;
    formValues.isTwoFactorEnabled = undefined;
  }

  const validationResult = UserSettingsSchema.safeParse(formValues);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.errors,
    };
  }

  //   if (formValues.email && formValues.email !== user.email) {
  //     const existingUser = await getUserByEmail(formValues.email);

  //     if (existingUser && existingUser.id !== user.id) {
  //       return { error: "Email already in use!" }
  //     }

  //     const verificationToken = await generateVerificationToken(
  //       formValues.email
  //     );
  //     await sendVerificationEmail(
  //       verificationToken.email,
  //       verificationToken.token,
  //     );

  //     return { success: "Verification email sent!" };
  //   }

  if (formValues.password && formValues.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      formValues.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return {
        errors: createRootErrorForReactHookForm("Incorrect password"),
      };
    }

    const hashedPassword = await bcrypt.hash(formValues.newPassword, 10);
    formValues.password = hashedPassword;
    formValues.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...validationResult.data,
    },
  });

  await update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  });

  return {
    success: "Settings Updated",
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  };
}
