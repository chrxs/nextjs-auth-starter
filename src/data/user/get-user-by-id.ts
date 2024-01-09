import db from "@/lib/db";

export default async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
}
