import db from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <main>
      <h1 className="font-bold">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </main>
  );
}
