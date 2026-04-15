import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PLACEHOLDER_AVATAR = "https://github.com/shadcn.png";

interface UserMenuProps {
  name?: string;
  email?: string;
  initials?: string;
  onLogout: () => void;
  onProfile: () => void;
}

export default function UserMenu({ name, email, initials, onLogout, onProfile }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-white/5 transition-colors outline-none">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={PLACEHOLDER_AVATAR} alt={name ?? ""} />
          <AvatarFallback className="bg-teal/30 text-teal text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold text-white truncate">{name}</p>
          <p className="text-[10px] text-ash/60 truncate">{email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mb-2 w-72" side="top" align="start">
        <DropdownMenuItem className="py-3">
          <Avatar>
            <AvatarImage src={PLACEHOLDER_AVATAR} />
            <AvatarFallback className="bg-teal/30 text-teal text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-1 flex flex-col">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfile}>
          <User className="mr-1" /> Mi Perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-1" /> Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
