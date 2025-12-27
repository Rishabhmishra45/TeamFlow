import { useEffect, useState } from "react";
import api from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // 🔁 REAL TIME

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex-1 text-white">Loading users...</div>
    );
  }

  return (
    <div className="p-8 flex-1 text-white">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="bg-gray-800 rounded-2xl p-4">
        {users.length === 0 ? (
          <p className="text-gray-400">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center py-3 border-b border-gray-700 last:border-none"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-gray-700 text-sm">
                {user.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
