"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BriefcaseIcon, ChevronLeft, ChevronRight, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { PageContainer, PageCard } from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import type { Workspace } from "@/store/auth.store";

const PLACEHOLDER_AVATAR = "https://github.com/shadcn.png";

export default function Profile() {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <PageContainer>
      <PageCard className="flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-8 p-8 max-[24rem]:gap-4">
          <Avatar className="size-28 border max-[24rem]:size-20 sm:size-36 shrink-0">
            <AvatarImage alt={user?.name ?? ""} src={PLACEHOLDER_AVATAR} />
            <AvatarFallback className="font-medium text-2xl bg-teal/20 text-teal">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <span className="font-medium text-lg tracking-tight sm:text-2xl">{user?.name}</span>
            <span className="text-muted-foreground sm:text-lg">{user?.email}</span>
            <span className={cn(
              "mt-1 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
              user?.isSuperAdmin ? "bg-teal/15 text-teal" : "bg-gray-100 text-gray-600"
            )}>
              {user?.isSuperAdmin ? "Super Admin" : "Usuario"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="perfil" className="w-full gap-0 flex-1 flex flex-col">
          <div className="border-t border-b px-6">
            <TabsList className={cn(
              "h-auto rounded-none bg-transparent p-0",
              "*:rounded-none *:border-0 *:border-b-2 *:border-transparent *:px-4 *:py-3",
              "*:text-muted-foreground *:shadow-none *:transition-colors",
              "*:data-active:border-foreground *:data-active:bg-transparent *:data-active:text-foreground"
            )}>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab: Perfil */}
          <TabsContent value="perfil">
            <div className="flex items-center gap-2.5 bg-muted/50 px-6 py-3 border-b border-dashed">
              <h2 className="flex items-center gap-2.5 font-medium">
                <UserIcon className="size-4 text-muted-foreground" />
                Información Personal
              </h2>
            </div>
            <div className="grid grid-cols-1 *:border-b *:border-dashed *:px-6 *:py-4 md:grid-cols-2 *:md:odd:border-r last:*:border-b-0">
              <UserInfo label="Nombre completo" value={user?.name ?? "—"} />
              <UserInfo label="Email" value={user?.email ?? "—"} />
            </div>

            <div className="flex items-center gap-2.5 bg-muted/50 px-6 py-3 border-y border-dashed">
              <h2 className="flex items-center gap-2.5 font-medium">
                <BriefcaseIcon className="size-4 text-muted-foreground" />
                Accesos
              </h2>
            </div>
            <div className="grid grid-cols-1 *:border-b *:border-dashed *:px-6 *:py-4 md:grid-cols-2 *:md:odd:border-r last:*:border-b-0">
              <UserInfo label="Módulo CRM" value={user?.hasCRM ? "✓ Activo" : "✗ Sin acceso"} />
              <UserInfo label="Módulo Cargo" value={user?.hasCargo ? "✓ Activo" : "✗ Sin acceso"} />
              <UserInfo label="Rol" value={user?.isSuperAdmin ? "Super Administrador" : "Usuario estándar"} />
            </div>
          </TabsContent>

          {/* Tab: Workspaces */}
          <TabsContent value="workspaces" className="flex flex-col flex-1">
            <WorkspaceCarousel
              crmWorkspaces={user?.crmWorkspaces ?? []}
              cargoWorkspaces={user?.cargoWorkspaces ?? []}
            />
          </TabsContent>
        </Tabs>

      </PageCard>
    </PageContainer>
  );
}

function WorkspaceCarousel({ crmWorkspaces, cargoWorkspaces }: { crmWorkspaces: Workspace[]; cargoWorkspaces: Workspace[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const slides = [
    { label: "CRM", workspaces: crmWorkspaces },
    { label: "Cargo", workspaces: cargoWorkspaces },
  ];

  return (
    <Carousel setApi={setApi} className="flex flex-col flex-1">
      {/* Header con navegación inline */}
      <div className="flex items-center justify-between bg-muted/50 px-6 py-3 border-b border-dashed shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{slides[current].label}</h2>
          <span className="text-xs text-muted-foreground">
            {slides[current].workspaces.length} workspace(s)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => api?.scrollPrev()}
            className="p-1 rounded-md hover:bg-muted transition-colors disabled:opacity-30"
            disabled={current === 0}
          >
            <ChevronLeft className="size-4" />
          </button>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "size-2 rounded-full border-2 transition-colors",
                current === i ? "border-foreground bg-foreground" : "border-muted-foreground"
              )}
            />
          ))}
          <button
            onClick={() => api?.scrollNext()}
            className="p-1 rounded-md hover:bg-muted transition-colors disabled:opacity-30"
            disabled={current === slides.length - 1}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Slides */}
      <CarouselContent className="flex-1 ml-0">
        {slides.map((slide) => (
          <CarouselItem key={slide.label} className="pl-0 flex flex-col">
            <div className="overflow-y-auto max-h-[calc(100dvh-22rem)]">
              {slide.workspaces.length ? (
                slide.workspaces.map((ws) => (
                  <WorkspaceRow key={ws.id} name={ws.name} logo={ws.logo} />
                ))
              ) : (
                <p className="px-6 py-8 text-sm text-muted-foreground text-center">Sin workspaces</p>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function UserInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="mb-1 text-xs text-muted-foreground">{label}</h3>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function WorkspaceRow({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex items-center gap-3 border-b border-dashed px-6 py-3 last:border-b-0">
      <div className="size-7 rounded-lg bg-gray-50 border overflow-hidden flex items-center justify-center shrink-0">
        {logo ? (
          <Image src={logo} alt={name} width={28} height={28} className="w-full h-full object-contain" />
        ) : (
          <span className="text-[10px] font-bold text-gray-500">{name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <p className="text-sm font-medium truncate">{name}</p>
    </div>
  );
}
