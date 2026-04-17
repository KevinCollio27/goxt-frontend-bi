"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link2, Trash2 } from "lucide-react";

import { Modal }   from "@/components/ui/Modal";
import { Button }  from "@/components/ui/Button";
import { Input }   from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { IntegrationsService } from "@/services/integrations.service";
import type { IntegrationSource } from "@/services/integrations.service";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  url: z
    .string()
    .min(1, "La URL es requerida")
    .refine(
      (val) => !IntegrationsService.validate("looker_studio", val),
      "Debe ser una URL de embed: lookerstudio.google.com/embed/reporting/..."
    ),
});

type FormValues = z.infer<typeof schema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface LookerConnectModalProps {
  workspaceId: number;
  source:      IntegrationSource;
  currentUrl?: string;
  onSuccess:   () => void;
  onClose:     () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LookerConnectModal({
  workspaceId, source, currentUrl, onSuccess, onClose,
}: LookerConnectModalProps) {
  const isEditing = !!currentUrl;
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [removing, setRemoving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: currentUrl ?? "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await IntegrationsService.upsert(workspaceId, source, "looker_studio", data.url.trim());
      reset();
      onSuccess();
    } catch {
      setError("root", { message: "No se pudo guardar la integración. Intentá de nuevo." });
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await IntegrationsService.remove(workspaceId, source, "looker_studio");
      onSuccess();
    } catch {
      setError("root", { message: "No se pudo desconectar. Intentá de nuevo." });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <Modal
        open={true}
        onClose={handleClose}
        title={isEditing ? "Editar Looker Studio" : "Conectar Looker Studio"}
        subtitle={isEditing ? "Actualizá la URL de tu reporte" : "Pegá la URL de embed de tu reporte"}
        size="md"
        footer={
          <>
            {isEditing ? (
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
                onClick={() => setConfirmDisconnect(true)}
                disabled={removing}
              >
                <Trash2 size={14} /> Desconectar
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancelar
              </Button>
            )}
            <div className="flex items-center gap-2">
              {isEditing && (
                <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" form="looker-form" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Conectar"}
              </Button>
            </div>
          </>
        }
      >
        <form id="looker-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.url}>
              <FieldLabel>URL del reporte</FieldLabel>
              <Input
                {...register("url")}
                type="url"
                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                autoComplete="off"
                aria-invalid={!!errors.url}
              />
              <FieldError>{errors.url?.message}</FieldError>
              {!errors.url && (
                <FieldDescription>
                  Debe ser una URL de embed de Looker Studio
                </FieldDescription>
              )}
            </Field>

            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}
          </FieldGroup>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmDisconnect}
        onOpenChange={setConfirmDisconnect}
        icon={Trash2}
        title="¿Desconectar Looker Studio?"
        description="Se eliminará la integración y el reporte dejará de estar disponible."
        confirmLabel="Desconectar"
        variant="destructive"
        onConfirm={handleRemove}
      />
    </>
  );
}
