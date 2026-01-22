import { JSX } from "react";

type IconName =
  | "search"
  | "bell"
  | "settings"
  | "menu"
  | "close"
  | "logout"
  | "edit"
  | "plus"
  | "check"
  | "calendar"
  | "calendar-days"
  | "map-pin"
  | "arrow-left"
  | "arrow-right"
  | "plane"
  | "lock"
  | "phone"
  | "success"
  | "warning"
  | "error"
  | "file"
  | "image"
  | "cloud-upload"
  | "download"
  | "share"
  | "trash"
  | "list"
  | "clipboard"
  | "folder-open"
  | "chevron-down"
  | "refresh"
  | "paperclip";

type IconProps = {
  name: IconName;
  className?: string;
  label?: string;
  strokeWidth?: number;
};

const paths: Record<IconName, JSX.Element[]> = {
  search: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 1 0-14 0 7 7 0 0 0 14 0z" />],
  bell: [
    <path
      key="a"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
    />,
  ],
  settings: [
    <path
      key="a"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 0 0 2.572-1.065z"
    />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />,
  ],
  menu: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />],
  close: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />],
  logout: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="m17 16 4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />],
  edit: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="m16.586 4.586 2.828 2.828a2 2 0 0 1 0 2.828L12 17H9v-3l7.414-7.414a2 2 0 0 1 2.828 0z" />,
  ],
  plus: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />],
  check: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />],
  calendar: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />,
  ],
  "calendar-days": [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />,
  ],
  "map-pin": [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="m17.657 16.657-4.243 4.243a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />,
  ],
  "arrow-left": [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="m10 19-7-7m0 0 7-7m-7 7h18" />],
  "arrow-right": [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="m14 5 7 7-7 7M21 12H3" />],
  plane: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v3" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 1 0 4 0 2 2 0 0 1 2-2h1.064" />,
    <path key="c" strokeLinecap="round" strokeLinejoin="round" d="M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  ],
  lock: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M16 9V7a4 4 0 0 0-8 0v4h8z" />,
  ],
  phone: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />,
  ],
  success: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M9 12 11 14 15 10m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  ],
  warning: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  ],
  error: [
    <path key="a" fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.293-6.707a1 1 0 1 1 1.414-1.414L10 10.586l1.293-1.293a1 1 0 1 1 1.414 1.414L11.414 12l1.293 1.293a1 1 0 0 1-1.414 1.414L10 13.414l-1.293 1.293a1 1 0 0 1-1.414-1.414L8.586 12l-1.293-1.293z" clipRule="evenodd" />,
  ],
  file: [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />],
  image: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M4 16 8.586 11.414a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />,
  ],
  "cloud-upload": [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 0 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12" />,
  ],
  download: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M14 4h6m0 0v6m0-6L10 14" />,
  ],
  share: [
    <path
      key="a"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.684 13.342c.202-.404.316-.86.316-1.342 0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684 6.632 3.316m-6.632-6 6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.368 2.684 3 3 0 0 1-5.368-2.684z"
    />,
  ],
  trash: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M19 7 18.133 19.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M10 11v6m4-6v6M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />,
  ],
  list: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
  ],
  clipboard: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />,
    <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
  ],
  "folder-open": [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 0 1 2-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 0 0-2 2zm9-13.5V9" />,
  ],
  "chevron-down": [<path key="a" strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />],
  refresh: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4" />,
  ],
  paperclip: [
    <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M15.172 7 8.586 13.586a2 2 0 1 0 2.828 2.828l6.414-6.586a4 4 0 0 0-5.656-5.656L5.758 10.757a6 6 0 1 0 8.486 8.486L20.5 13" />,
  ],
};

export function Icon({ name, className = "", label, strokeWidth = 1.75 }: IconProps) {
  const iconPaths = paths[name];
  const accessibilityProps = label ? { role: "img", "aria-label": label } : { role: "img", "aria-hidden": true as const };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={["w-5 h-5", className].filter(Boolean).join(" ")}
      {...accessibilityProps}
    >
      {iconPaths}
    </svg>
  );
}
