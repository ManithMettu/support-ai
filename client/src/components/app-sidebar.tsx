import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSessionsList } from "@/hooks/use-chat";
import { MessageSquare, Plus, Loader2, Settings, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface AppSidebarProps {
  currentSessionId: string;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
}

export function AppSidebar({ currentSessionId, onNewSession, onSelectSession }: AppSidebarProps) {
  const { data: sessions, isLoading } = useSessionsList();

  // Sort sessions by lastUpdated descending
  const sortedSessions = sessions
    ? [...sessions].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    : [];

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Support AI</span>
        </div>
        <Button 
          onClick={onNewSession} 
          variant="default" 
          className="w-full justify-start gap-2 h-10 shadow-sm hover-elevate active-elevate-2 font-medium rounded-xl"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="custom-scrollbar px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-2 opacity-60">
            Recent Activity
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-muted-foreground/50 italic">No conversations yet</p>
              </div>
            ) : (
              <SidebarMenu className="gap-1">
                {sortedSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton 
                      onClick={() => onSelectSession(session.id)}
                      isActive={session.id === currentSessionId}
                      className="gap-3 transition-all h-auto py-3 px-4 rounded-xl data-[active=true]:bg-primary/5 data-[active=true]:text-primary data-[active=true]:shadow-sm border border-transparent data-[active=true]:border-primary/10"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-50 group-data-[active=true]:opacity-100" />
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate text-sm font-semibold w-full">
                          Chat {session.id.substring(0, 8)}
                        </span>
                        <span className="text-[10px] opacity-50 font-medium">
                          {format(new Date(session.lastUpdated), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <Separator className="mb-4 opacity-50" />
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 h-10 rounded-xl text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Settings</span>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 h-10 rounded-xl text-muted-foreground hover:text-foreground">
            <User className="h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Profile</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
