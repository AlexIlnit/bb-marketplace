import { deleteUser } from "../../api/adminApi";

export default function UsersTable({ users, reload }) {
  return (
    <div className="space-y-4">

      {users.map((u) => (
        <div
          key={u._id}
          className="bg-white p-4 rounded-xl flex justify-between"
        >

          <div>
            <p className="font-bold">{u.name}</p>
            <p className="text-gray-500 text-sm">{u.email}</p>
            <p className="text-xs">{u.role}</p>
          </div>

          <button
            onClick={async () => {
              await deleteUser(u._id);
              reload();
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}