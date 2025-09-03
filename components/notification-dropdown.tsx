'use client'

import { Bell, Check, X, ExternalLink, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications, type Notification } from '@/lib/notifications-context'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

function NotificationIcon({ type }: { type: Notification['type'] }) {
  const iconClasses = "h-4 w-4 mr-3 mt-1 flex-shrink-0"
  
  switch (type) {
    case 'success':
      return <div className={`${iconClasses} bg-green-100 text-green-600 rounded-full p-1`}>✓</div>
    case 'warning':
      return <div className={`${iconClasses} bg-yellow-100 text-yellow-600 rounded-full p-1`}>!</div>
    case 'error':
      return <div className={`${iconClasses} bg-red-100 text-red-600 rounded-full p-1`}>×</div>
    default:
      return <div className={`${iconClasses} bg-blue-100 text-blue-600 rounded-full p-1`}>i</div>
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead, removeNotification } = useNotifications()

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    markAsRead(notification.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeNotification(notification.id)
  }

  return (
    <div 
      className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors relative group ${
        !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
      }`}
    >
      <NotificationIcon type={notification.type} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium truncate">{notification.title}</h4>
          {!notification.read && (
            <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-primary" />
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {notification.message}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
          
          {notification.actionUrl && (
            <Link 
              href={notification.actionUrl}
              className="text-xs text-primary hover:underline flex items-center gap-1"
              onClick={() => markAsRead(notification.id)}
            >
              {notification.actionLabel || 'View'}
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-green-100"
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-100"
          onClick={handleRemove}
          title="Remove notification"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications ({unreadCount} unread)</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end" sideOffset={5}>
        <div className="flex items-center justify-between p-3 pb-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 px-3 pb-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={clearAll}
            >
              Clear all
            </Button>
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs">You're all caught up!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
              />
            ))}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <div className="p-2">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" className="w-full justify-center text-sm">
              View all notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
