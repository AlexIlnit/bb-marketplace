// import { deleteUser } from "../../api/adminApi";

// export function UsersTable({ users, reload }) {
//   return (
//     <div className="space-y-4">

//       {users.map((u) => (
//         <div
//           key={u._id}
//           className="bg-white p-4 rounded-xl flex justify-between"
//         >

//           <div>
//             <p className="font-bold">{u.name}</p>
//             <p className="text-gray-500 text-sm">{u.email}</p>
//             <p className="text-xs">{u.role}</p>
//           </div>

//           <button
//             onClick={async () => {
//               await deleteUser(u._id);
//               reload();
//             }}
//             className="bg-red-600 text-white px-3 py-1 rounded"
//           >
//             Delete
//           </button>

//         </div>
//       ))}

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/userApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await getAllUsers();
    setUsers(data);
  };

  const remove = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Users
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">

                <td className="p-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>

                <td className="p-3">
                  <button
                    onClick={() => remove(u._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}