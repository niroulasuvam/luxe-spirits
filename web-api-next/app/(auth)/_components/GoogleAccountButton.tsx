"use client";

import { useEffect, useRef } from "react";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleButtonProps = {
  text?: "signin_with" | "continue_with";
  disabled?: boolean;
  onCredential: (credential: string) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | boolean | number>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleAccountButton({ text = "continue_with", disabled = false, onCredential }: GoogleButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId) return;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) callbackRef.current(response.credential);
        },
      });
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 390,
        text,
        shape: "rectangular",
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);
  }, [clientId, text]);

  return (
    <div className="space-y-2">
      <div className="relative h-12 overflow-hidden rounded-lg">
      <button
        type="button"
        disabled={disabled || !clientId}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xl font-bold text-[#4285f4]">G</span>
        {text === "signin_with" ? "Google मार्फत रिकभर गर्नुहोस्" : "Google मार्फत जारी राख्नुहोस्"}
      </button>
      {clientId ? <div ref={googleButtonRef} className="absolute inset-0 opacity-0" /> : null}
      </div>
      {!clientId ? (
        <p className="text-center text-xs text-neutral-500">
          Google Client ID is missing. Add it in `.env.local` to enable this button.
        </p>
      ) : null}
    </div>
  );
}
