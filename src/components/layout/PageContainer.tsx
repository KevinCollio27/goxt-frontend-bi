import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper estándar de página: ocupa todo el espacio del main,
 * agrega padding consistente y habilita scroll vertical por defecto.
 * Usá className para sobreescribir overflow cuando la página
 * maneja su propio scroll interno (ej: dashboard → overflow-hidden).
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("h-full overflow-y-auto flex flex-col p-6", className)}>
      {children}
    </div>
  );
}

/**
 * Card blanca estándar que crece para llenar el espacio disponible
 * dentro de PageContainer. Usá className para agregar flex-col u
 * otros modificadores según el contenido de la página.
 */
export function PageCard({ children, className }: PageContainerProps) {
  return (
    <div className={cn("flex-1 rounded-xl border bg-white overflow-hidden", className)}>
      {children}
    </div>
  );
}
