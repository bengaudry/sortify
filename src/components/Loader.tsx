import { useEffect, useState } from "react";

export function Loader({ message }: { message?: string }) {
  const [loadingStuck, setLoadingStuck] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoadingStuck(true);
    }, 2000);
  });

  return (
    <div className="w-full h-screen grid place-content-center relative">
      <div className="loader mx-auto mb-4"></div>
      {message ?? "Loading..."}
      {loadingStuck && (
        <div className="text-xs text-spotify-200 text-center absolute bottom-12 left-1/2 -translate-x-1/2">
          <i className="fi fi-rr-plug-connection text-lg" />
          <p>Loading seems stuck :(</p>
          <p>
            You might want to check
            <br />
            your internet connection or
          </p>
          <a href="/" className="text-underline text-spotify-500">Go back home</a>
        </div>
      )}
    </div>
  );
}
