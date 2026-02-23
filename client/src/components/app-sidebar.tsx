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
} from "@/components/ui/sidebar";
import { useSessionsList } from "@/hooks/use-chat";
import { MessageSquare, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Button 
          onClick={onNewSession} 
          variant="outline" 
          className="w-full justify-start gap-2 shadow-sm hover-elevate active-elevate-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground/40" />
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-sidebar-foreground/50">
                No recent conversations
              </div>
            ) : (
              <SidebarMenu>
                {sortedSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton 
                      onClick={() => onSelectSession(session.id)}
                      isActive={session.id === currentSessionId}
                      className="gap-3 transition-colors h-auto py-2.5"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate text-sm font-medium w-full">
                          {/* We don't have titles in the schema, using ID snippet as fallback */}
                          Chat {session.id.substring(0, 8)}
                        </span>
                        <span className="text-[10px] text-sidebar-foreground/50">
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
    </Sidebar>
  );
}
