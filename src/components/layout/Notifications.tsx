
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNotifications } from '@/lib/database';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

type Notification = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

export default function Notifications() {
  const [hasUnread, setHasUnread] = useState(false);
  
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  useEffect(() => {
    // Check if there are any unread notifications
    if (notifications && notifications.length > 0) {
      const unreadExists = notifications.some(
        (notification: Notification) => !notification.is_read
      );
      setHasUnread(unreadExists);
    }
  }, [notifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm">Notifications</h4>
        </div>
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${
                    !notification.is_read ? 'bg-secondary/20' : ''
                  }`}
                >
                  <div className="mb-1 font-medium text-sm">
                    {notification.title}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
