'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications, type Notification } from '@/lib/notifications-context'
import { formatDistanceToNow, format } from 'date-fns'
import { Bell, Search, Filter, Check, X, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'

function NotificationCard({ notification, onMarkAsRead, onRemove }: {
  notification: Notification
  onMarkAsRead: () => void
  onRemove: () => void
}) {
  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✓'
      case 'warning': return '⚠'
      case 'error': return '✕'
      default: return 'ℹ'
    }
  }

  return (
    <Card className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-primary/20 bg-primary/2' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge className={`${getTypeColor(notification.type)} text-xs px-2 py-1`}>
              <span className="mr-1">{getTypeIcon(notification.type)}</span>
              {notification.type}
            </Badge>
            {!notification.read && (
              <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-green-100"
                onClick={onMarkAsRead}
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-100"
              onClick={onRemove}
              title="Remove notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg">{notification.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{notification.message}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">
              {format(notification.timestamp, 'MMM dd, yyyy')}
            </span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
          </div>
          {notification.actionUrl && (
            <Link href={notification.actionUrl}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {notification.actionLabel || 'View'}
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (activeTab) {
      case 'unread':
        return matchesSearch && !notification.read
      case 'read':
        return matchesSearch && notification.read
      default:
        return matchesSearch
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your latest activities and announcements
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Notification Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Badge variant="destructive" className="h-6 w-6 p-0 text-xs rounded-full">
              {unreadCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            Read ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm 
                    ? 'No notifications found' 
                    : activeTab === 'unread' 
                      ? 'No unread notifications' 
                      : activeTab === 'read' 
                        ? 'No read notifications' 
                        : 'No notifications yet'
                  }
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : activeTab === 'unread' 
                      ? "You're all caught up!" 
                      : activeTab === 'read' 
                        ? 'Read notifications will appear here' 
                        : 'New notifications will appear here'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onRemove={() => removeNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
