"use client";

import AuthLayout from "@/components/layout/AuthLayout";
import SuperAdmins from "@/components/super-admins/SuperAdmins";

export default function SuperAdminsPage() {
  return (
    <AuthLayout>
      <SuperAdmins />
    </AuthLayout>
  );
}
