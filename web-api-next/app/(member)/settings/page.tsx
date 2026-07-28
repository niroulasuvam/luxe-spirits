import { SettingsPanel } from "./_components/SettingsPanel";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="text-4xl font-bold">Settings</h1>
      <p className="mt-3 text-neutral-600">Manage display and notification preferences.</p>
      <SettingsPanel />
    </main>
  );
}
