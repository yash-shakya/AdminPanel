import { useEffect, useState } from "react";
import { getAllUsers, type User, deleteUser } from "@/app/actions/users";
import BaseTable from "../base_table";
import { useRouter } from "next/navigation";
export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        const usersArray = Object.entries(usersData).map(
          ([email, userData]) => ({
            ...userData,
            email,
          }),
        );
        setUsers(usersArray);
      } catch (err) {
        setError("Failed to load users");
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (email: string) => {
    router.push(`/panel/view/admins/${email}`);
  };

  const handleDelete = async (email: string) => {
    try {
      await deleteUser(email);
      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      type: "badge" as const,
      badgeConfig: {
        colors: {
          admin: "bg-red-500",
          user: "bg-green-500",
        },
      },
    },
    { key: "college", header: "College" },
    { key: "phone", header: "Phone" },
    { key: "year", header: "Year" },
    {
      key: "picture",
      header: "Profile",
      type: "image" as const,
      imageConfig: {
        fallbackSrc: "/placeholder-avatar.png",
        width: "w-10",
        height: "h-10",
        rounded: true,
      },
    },
    {
      key: "actions",
      header: "Actions",
      type: "actions" as const,
    },
  ];

  const filteredUsers = users.filter((user) => user.role === "admin");
  return (
    <BaseTable
      columns={columns}
      data={filteredUsers}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      identifierKey="email"
      title="Users"
    />
  );
}
