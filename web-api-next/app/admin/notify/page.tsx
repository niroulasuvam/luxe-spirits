import { NotifyUsersForm } from "./_components/NotifyUsersForm";

export default function AdminNotifyPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="text-4xl font-bold">Notify Users</h1>
      <p className="mt-2 text-neutral-600">Send a message to every active customer. Image is optional.</p>
      <NotifyUsersForm />
    </main>
  );
}
