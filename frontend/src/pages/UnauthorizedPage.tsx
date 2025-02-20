export function UnauthorizedPage() {
  return (
    <div className="bg-gray-100 px-2 text-center">
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-8xl font-extrabold text-red-500">{401}</h1>
        <p className="text-4xl font-medium text-gray-800">Unauthorized</p>
        <p className="mt-4 text-xl text-gray-800">You don't have the permissions to see this page</p>
      </div>
    </div>
  );
}
