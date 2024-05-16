"use client";
import { useState } from "react";
import legalmd from "../../../public/legal";
import ReactMarkdown from "react-markdown";

export default () => {
  const [lang, setLang] = useState<"en" | "fr">("en");

  return (
    <div className="px-6 py-12">
      <div className="flex justify-between items-center">
        <a className="flex items-center gap-2" href="/">
          <img src="/icon-rounded.svg" width={30} height={30} />
          <span className="text-spotify-200 font-medium text-xl">Sortify</span>
        </a>
        <select
          className="bg-spotify-800 px-4 py-2 rounded-sm"
          onChange={({ target: { value } }) =>
            setLang(value === "en" || value === "fr" ? value : "en")
          }
        >
          <option selected value="en">
            English
          </option>
          <option value="fr">Français</option>
        </select>
      </div>

      <ReactMarkdown
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
            <h1 className="text-4xl font-bold mt-9 mb-3" {...otherProps} />
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
    </div>
  );
};
