"use client";

interface Props {
  url?: string;
}

export default function LookerDashboard({ url }: Props) {
  const src = url ?? process.env.NEXT_PUBLIC_LOOKER_SUPER_ADMIN_URL;

  if (!src) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        No hay un reporte de Looker Studio configurado.
      </div>
    );
  }

  return (
    <iframe
      src={src}
      className="w-full h-full border-0"
      allowFullScreen
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  );
}
