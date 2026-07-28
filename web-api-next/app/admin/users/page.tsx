import { handleAdminUsers, handleChangeUserRole, handleDeleteUser, handleSendPasswordRecovery, handleToggleUserActive } from "@/lib/actions/admin-action";

export default async function AdminUsersPage() {
  const result = await handleAdminUsers();
  const users = result.data;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="text-4xl font-bold">Users</h1>
      <p className="mt-2 text-neutral-600">View members, promote admins, disable accounts, or remove users.</p>
      <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-5 py-4 font-semibold">{user.fullName}</td>
                <td className="px-5 py-4 text-xs text-neutral-500">{user._id}</td>
                <td className="px-5 py-4 text-neutral-600">{user.email}</td>
                <td className="px-5 py-4 capitalize">{user.role}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <form action={handleChangeUserRole.bind(null, user._id, user.role === "admin" ? "user" : "admin")}>
                      <button className="rounded-lg border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">
                        {user.role === "admin" ? "Make user" : "Make admin"}
                      </button>
                    </form>
                    <form action={handleToggleUserActive.bind(null, user._id, !user.isActive)}>
                      <button className="rounded-lg border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">
                        {user.isActive ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form action={handleSendPasswordRecovery.bind(null, user._id)}>
                      <button className="rounded-lg border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">
                        Recover Password
                      </button>
                    </form>
                    <form action={handleDeleteUser.bind(null, user._id)}>
                      <button className="rounded-lg bg-red-600 px-3 py-2 font-semibold text-white">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
