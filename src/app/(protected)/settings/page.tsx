import { getCurrentUser } from "@/auth/utils";
import { SettingsForm } from "./_components";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Settings</h1>
      <SettingsForm user={user} />
    </div>
  );
}
