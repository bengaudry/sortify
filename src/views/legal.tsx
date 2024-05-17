"use client";
import { useEffect, useState } from "react";
import legalmd from "../../public/legal";
import ReactMarkdown from "react-markdown";

export function LegalPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    document.body.classList.add("bg-spotify-800");
    if (navigator.language === "fr-FR") {
      setLang("fr");
    }
    return () => document.body.classList.remove("bg-spotify-800");
  }, []);

  return (
    <div className="pb-12 pt-8 bg-spotify-800">
      <div
        className={
          "flex justify-between items-center sticky h-20 top-0 px-6 transition-colors bg-spotify-800"
        }
      >
        <a className="flex items-center gap-2" href="/">
          <img src="/image/icon-rounded.svg" width={30} height={30} />
          <span className="text-spotify-200 font-medium text-xl">Sortify</span>
        </a>
        <div className="w-fit relative flex items-center">
          <select
            className="bg-spotify-700 pl-4 pr-10 py-2 rounded-md appearance-none"
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
          <i className="fi fi-rr-angle-down text-xs absolute right-3 translate-y-0.5 pointer-events-none" />
        </div>
      </div>

      <ReactMarkdown
        className="px-6 sm:px-12 max-w-screen-md mx-auto"
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
          h1: ({ className, children, ...otherProps }) => {
            const id = children
              ?.toString()
              .toLowerCase()
              .replaceAll("é", "e")
              .replaceAll(" ", "-");

            return (
              <h1
                className="block w-[calc(100%+72px)] -ml-6 sm:-ml-12 pl-6 sm:pl-12 text-3xl sm:text-4xl font-bold mt-6 py-3 bg-[#00000000] sticky top-20 backdrop-blur-md"
                {...otherProps}
                id={id}
                children={children}
              />
            );
          },
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
      <div className="w-full flex justify-end px-6 sm:px-12">
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
