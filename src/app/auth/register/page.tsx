import Link from "next/link";

import { RegisterForm } from "../_components";

export default function Register() {
  return (
    <div>
      <RegisterForm />

      <Link href="/auth/sign-in">Sign in</Link>
    </div>
  );
}
