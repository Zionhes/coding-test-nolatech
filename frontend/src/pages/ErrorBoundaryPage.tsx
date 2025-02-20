import { useRouteError } from "react-router";

interface Error {
  status: number;
}

export function ErrorBoundaryPage() {
  const error: Error | any = useRouteError();

  const statusMessages: Record<number, string> = {
    404: "Page not found",
    500: " An error has occurred on the server ",
  };

  const message = statusMessages[error?.status] || "Ha ocurrido un error inesperado";

  return (
    <div className="bg-gray-100 px-2 text-center">
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-8xl font-extrabold text-red-500">{error?.status}</h1>
        <p className="text-4xl font-medium text-gray-800">{message}</p>
        <p className="mt-4 text-xl text-gray-800">We apologize for the inconvenience. Please try again later.</p>
      </div>
    </div>
  );
}
