import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";
import { getUsers } from "@/dal/users";

export default async function Home() {
  const { docs: users } = await getUsers();

  return (
    <div className="h-screen container mx-auto flex p-8 flex-col justify-center">
      <div className="grid grid-cols-4 gap-8">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
      <div className="p-6 rounded-2xl max-w-xl w-full mx-auto mt-14 bg-card border">
        <UserForm action="create" />
      </div>
    </div>
  );
}
