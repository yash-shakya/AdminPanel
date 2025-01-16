import { useEffect, useState } from "react";
import { getAllUsers, type User, deleteUser, updateUser } from "@/app/actions/users";
import { FiTrash2, FiEdit } from "react-icons/fi";

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                const usersArray = Object.entries(usersData).map(([email, userData]) => ({
                    ...userData,
                    email 
                }));
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

    const handleDeleteClick = (email: string) => {
        setUserToDelete(email);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete);
                setUsers((prevUsers) => prevUsers.filter((user) => user.email !== userToDelete));
                setIsDeleteModalOpen(false);
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Failed to delete user.");
            }
        }
    };

    const handleEdit = (email: string) => {
        console.log("Edit user:", email);
    };

    if (loading) {
        return (
            <div className="w-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-center py-8 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto shadow-md rounded-lg bg-gray-900">
                <table className="w-full text-sm text-left text-white">
                    <thead className="text-xs uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">College</th>
                            <th scope="col" className="px-6 py-3">Phone</th>
                            <th scope="col" className="px-6 py-3">Year</th>
                            <th scope="col" className="px-6 py-3">Profile</th>
                            {/* <th scope="col" className="px-6 py-3">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.email} className={`border-b ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} border-gray-700`}>
                                <td className="px-6 py-4 font-medium whitespace-nowrap">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4">{user.college || '-'}</td>
                                <td className="px-5 py-4">{user.phone || '-'}</td>
                                <td className="px-6 py-4">{user.year || '-'}</td>
                                <td className="px-6 py-4">
                                    <img 
                                        src={user.picture} 
                                        alt={user.name} 
                                        className="w-10 h-10 rounded-full mb-5 ml-2"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-avatar.png';
                                        }}
                                    />
                                     <div className="flex space-x-2 mb-[-10px]">
                                        <button
                                            onClick={() => handleEdit(user.email)}
                                            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                                        >
                                            <FiEdit className="h-4 w-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user.email)}
                                            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                                        >
                                            <FiTrash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}   