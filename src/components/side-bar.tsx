import { Link, SignOut, UserImage } from "@/components";

export default function SideBar() {
  return (
    <aside className="flex flex-col gap-4">
      <div className="flex-none">
        <UserImage />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <nav>
          <ul>
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <Link href="/users">Users</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-none">
        <SignOut />
      </div>
    </aside>
  );
}
