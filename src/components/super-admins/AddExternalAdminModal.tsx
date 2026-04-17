"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";

import { Modal }   from "@/components/ui/Modal";
import { Button }  from "@/components/ui/Button";
import { Input }   from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { superAdminService } from "@/services/super-admin.service";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  name:  z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Ingresá un email válido"),
});

type FormValues = z.infer<typeof schema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface AddExternalAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AddExternalAdminModal({ open, onClose, onSuccess }: AddExternalAdminModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await superAdminService.createExternal({ name: data.name, email: data.email });
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError("root", {
        message: e?.response?.data?.message ?? "Ocurrió un error al crear el admin.",
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Agregar admin externo"
      subtitle="Se enviará un email de invitación para configurar el acceso"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="external-admin-form" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Confirmar"}
          </Button>
        </>
      }
    >
      <form id="external-admin-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>

          <Field data-invalid={!!errors.name}>
            <FieldLabel>Nombre completo</FieldLabel>
            <Input
              {...register("name")}
              placeholder="Juan Pérez"
              autoComplete="off"
              aria-invalid={!!errors.name}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel>Email corporativo</FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="juan@empresa.com"
              autoComplete="off"
              aria-invalid={!!errors.email}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

        </FieldGroup>
      </form>
    </Modal>
  );
}
