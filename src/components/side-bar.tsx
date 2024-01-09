import { Link, SignOut, UserImage } from "@/components";

export default function SideBar() {
  return (
    <aside>
      <UserImage />

      <nav>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
        </ul>
      </nav>

      <SignOut />
    </aside>
  );
}
