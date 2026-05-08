import React, { useEffect, useRef, useState } from "react";
import Images from "../../atoms/images";
import { ArrowDown01Icon } from "hugeicons-react";
import { useLanguageStore } from "../../../stores/languageStore";

type Language = "en" | "id" | "zh" | "th" | "vn";

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English",          flag: "🇬🇧" },
  { code: "zh", label: "中文",              flag: "🇨🇳" },
  { code: "th", label: "ภาษาไทย",          flag: "🇹🇭" },
  { code: "vn", label: "Tiếng Việt",       flag: "🇻🇳" },
];

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
  const [open, setOpen] = useState(false);
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

  const { language, setLanguage } = useLanguageStore();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
  };

  const activeLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="flex relative items-center justify-between rounded-xl bg-[#F4F7FB] dark:bg-gray-800 px-4 py-3">
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
        <div className="absolute right-2 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === activeLang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors
                  ${isActive
                    ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileCardnavbar;