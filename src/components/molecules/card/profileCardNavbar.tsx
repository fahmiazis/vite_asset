import React, { useEffect, useRef, useState } from "react";
import Images from "../../atoms/images";
import { ArrowDown01Icon, CheckListIcon } from "hugeicons-react";
import { useLanguageStore } from "../../../stores/languageStore";

type Language = "en" | "id";

interface ProfileCardnavbarProps {
  name: string;
  email: string;
  avatarUrl: string;
  onActionClick?: () => void;
}

const ProfileCardnavbar: React.FC<ProfileCardnavbarProps> = ({
  name,
  email,
  avatarUrl,
  onActionClick,
}) => {

  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { setLanguage } = useLanguageStore()

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setOpen(false);
  };
  return (
    <div className="flex relative items-center justify-between rounded-xl bg-[#F4F7FB] dark:bg-gray-800 px-4 py-3">
      <div className="flex items-center gap-3">
        <Images
          src={avatarUrl}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="leading-tight">
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-white">{email}</p>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ArrowDown01Icon
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={16}
        />
      </button>

      {open && (
        <div className="absolute right-2 top-full z-50 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <button
            onClick={() => handleSelect("id")}
            className="flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Bahasa Indonesia
          </button>

          <button
            onClick={() => handleSelect("en")}
            className="flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            English
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCardnavbar;
