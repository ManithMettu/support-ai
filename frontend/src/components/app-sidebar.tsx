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
  useSidebar,
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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const sortedSessions = sessions
    ? [...sessions].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    : [];

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-xl">
      <SidebarHeader className={`${isCollapsed ? "p-2 flex flex-col items-center" : "p-4"}`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? "justify-center w-full" : "px-2"}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="font-bold text-lg tracking-tight">Support AI</span>}
        </div>
        {/* New Chat Button */}
        <Button
          onClick={onNewSession}
          variant="default"
          className={`gap-2 h-10 shadow-sm font-medium rounded-xl transition-all ${
            isCollapsed ? "w-10 px-0 justify-center" : "w-full justify-start"
          }`}
          title={isCollapsed ? "New Chat" : undefined}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>New Chat</span>}
        </Button>
      </SidebarHeader>

      <SidebarContent className={`custom-scrollbar ${isCollapsed ? "px-0" : "px-2"}`}>
        <SidebarGroup className={isCollapsed ? "flex flex-col items-center px-0" : ""}>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-2 opacity-60">
              Recent Activity
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className={isCollapsed ? "w-full flex flex-col items-center" : "w-full"}>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
              </div>
            ) : sortedSessions.length === 0 ? (
              !isCollapsed && (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-muted-foreground/50 italic">No conversations yet</p>
                </div>
              )
            ) : (
              <SidebarMenu className={`gap-1 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
                {sortedSessions.map((session) => (
                  <SidebarMenuItem key={session.id} className={isCollapsed ? "w-10" : "w-full"}>
                    <SidebarMenuButton
                      onClick={() => onSelectSession(session.id)}
                      isActive={session.id === currentSessionId}
                      tooltip={isCollapsed ? `Chat ${session.id.substring(0, 8)}` : undefined}
                      className={`rounded-xl transition-all border border-transparent
                        data-[active=true]:bg-primary/5 data-[active=true]:text-primary
                        data-[active=true]:shadow-sm data-[active=true]:border-primary/10
                        ${isCollapsed
                          ? "w-10 h-10 p-0 flex items-center justify-center"
                          : "w-full flex items-center gap-3 h-auto py-3 px-4"
                        }`}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />
                      {!isCollapsed && (
                        <div className="flex flex-col items-start overflow-hidden min-w-0">
                          <span className="truncate text-sm font-semibold w-full">
                            Chat {session.id.substring(0, 8)}
                          </span>
                          <span className="text-[10px] opacity-50 font-medium">
                            {format(new Date(session.lastUpdated), "MMM d, h:mm a")}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      
    </Sidebar>
  );
}