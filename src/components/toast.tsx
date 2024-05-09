import { useEffect, useState } from "react";

type ToastProps = {
  type?: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
};

type ToastContainerProps = {
  children: React.ReactNode;
};

export function ToastContainer(props: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-4 w-80">
      {props.children}
    </div>
  );
}

export function Toast(props: ToastProps) {
  const { type, title, message } = props;
  const [isVisible, setVisible] = useState(true);
  const [isUnmounting, setIsUnmounting] = useState(false);

  const generateToastStyle = () => {
    let color = "";

    switch (type) {
      case "success":
        color += "bg-green-500/50 text-green-100";
        break;
      case "error":
        color += "bg-red-500/50 text-green-100";
        break;
      case "warning":
        color += "bg-yellow-500/50 text-green-100";
        break;
      default:
        color += "bg-blue-500/50 text-green-100";
        break;
    }
    return `w-full px-4 py-2 rounded-lg flex flex-col items-start justify-center ${color}`;
  };

  useEffect(() => {
    setTimeout(() => {
      setIsUnmounting(true);
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }, 2500);
  }, []);

  return isVisible ? (
    <div
      className={`${generateToastStyle()} ${
        isUnmounting && "translate-x-[150%] transition-transform duration-500"
      }`}
    >
      <span className="font-semibold text-sm opacity-85">{title}</span>
      {message && (
        <span className="font-normal text-xs opacity-60">{message}</span>
      )}
    </div>
  ) : (
    <></>
  );
}
