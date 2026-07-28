type IconProps = {
  className?: string;
};

export function Icon({
  name,
  className = "h-5 w-5",
}: IconProps & {
  name:
    | "bag"
    | "user"
    | "search"
    | "grid"
    | "list"
    | "home"
    | "box"
    | "orders"
    | "customers"
    | "analytics"
    | "settings"
    | "support"
    | "lock"
    | "mail"
    | "arrow"
    | "heart"
    | "card"
    | "check"
    | "shield"
    | "bell"
    | "moon"
    | "eye"
    | "eyeOff";
}) {
  const paths = {
    bag: "M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0",
    search: "m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z",
    grid: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
    list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
    home: "m3 11 9-8 9 8v9h-6v-6H9v6H3v-9Z",
    box: "m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7",
    orders: "M8 4h8l2 3v13H6V7l2-3Zm0 5h8",
    customers: "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 8a5 5 0 0 0-10 0m14 0a4 4 0 0 0-6-3.5",
    analytics: "M4 19V5m0 14h16M8 16v-5m5 5V8m5 8v-8",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-12v2m0 14v2m9-9h-2M5 12H3m15.4-6.4L17 7m-10 10-1.4 1.4m0-12.8L7 7m10 10 1.4 1.4",
    support: "M12 21a9 9 0 1 0-9-9m9 9v-5m0-10a3 3 0 0 1 3 3c0 2-3 2-3 5",
    lock: "M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v10H6V11Z",
    mail: "M4 6h16v12H4V6Zm0 0 8 7 8-7",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    heart: "M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z",
    card: "M3 6h18v12H3V6Zm0 4h18",
    check: "m5 12 4 4L19 6",
    shield: "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4",
    moon: "M21 14.5A8 8 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    eyeOff: "M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 4.2A10.7 10.7 0 0 1 12 4.0c6.5 0 10 8 10 8a18.6 18.6 0 0 1-3.1 4.3M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8a10.8 10.8 0 0 0 4.2-.8",
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
