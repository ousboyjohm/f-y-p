type AlertProps = {
  type?: "success" | "error" | "info";
  message: string;
};

export default function Alert({ type = "info", message }: AlertProps) {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className={`border p-3 rounded-md text-sm mb-4 ${colors[type]}`}>
      {message}
    </div>
  );
}