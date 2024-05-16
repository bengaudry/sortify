"use client";
import { useEffect, useState } from "react";
import legalmd from "../../public/legal";
import ReactMarkdown from "react-markdown";

export function LegalPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    if (navigator.language === "fr-FR") {
      setLang("fr");
    }
  }, []);

  return (
    <div className="pb-12 pt-8 bg-spotify-800">
      <div className="flex justify-between items-center sticky h-20 top-0 px-6 bg-spotify-800">
        <a className="flex items-center gap-2" href="/">
          <img src="/icon-rounded.svg" width={30} height={30} />
          <span className="text-spotify-200 font-medium text-xl">Sortify</span>
        </a>
        <select
          className="bg-spotify-700 px-4 py-2 rounded-sm"
          onChange={({ target: { value } }) =>
            setLang(value === "en" || value === "fr" ? value : "en")
          }
        >
          <option selected={lang === "en"} value="en">
            English
          </option>
          <option selected={lang === "fr"} value="fr">
            Français
          </option>
        </select>
      </div>

      <ReactMarkdown
        className="px-12"
        components={{
          a: ({ className, target, ...otherProps }) => (
            <a
              target="_blank"
              className={
                "text-spotify-500 font-medium underline underline-offset-2 hover:text-spotify-400 active:text-spotify-600 transition-colors"
              }
              {...otherProps}
            />
          ),
          h1: ({ className, ...otherProps }) => (
            <h1
              className="block w-screen -ml-12 pl-12 text-4xl font-bold mt-6 py-3 bg-spotify-800/50 sticky top-20 backdrop-blur-md"
              {...otherProps}
            />
          ),
          h2: ({ className, ...otherProps }) => (
            <h2 className="text-xl font-semibold mt-6" {...otherProps} />
          ),
          ul: ({ className, ...otherProps }) => (
            <ul className="py-4 flex flex-col gap-1" {...otherProps} />
          ),
          strong: ({ className, ...otherProps }) => (
            <strong className="font-semibold" {...otherProps} />
          ),
        }}
      >
        {lang in legalmd ? legalmd[lang] : legalmd["en"]}
      </ReactMarkdown>
      <div className="w-full flex justify-end px-12">
        <button
          className="bg-spotify-700 aspect-square w-14 rounded-xl"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          <i className="fi fi-rr-angle-up" />
        </button>
      </div>
    </div>
  );
}
