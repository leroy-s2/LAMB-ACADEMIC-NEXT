'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Bell, FileText, DollarSign, CheckCircle, Mail } from 'lucide-react';
import { Notification, NotificationType } from '@/shared/types/notification.types';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  // Cerrar al clickear fuera del panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
      case 'payment':
        return <DollarSign className={`${iconClass} text-green-600`} />;
      case 'grades':
        return <CheckCircle className={`${iconClass} text-blue-600`} />;
      case 'document':
        return <FileText className={`${iconClass} text-amber-600`} />;
      case 'message':
        return <Mail className={`${iconClass} text-purple-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    const labels: Record<NotificationType, string> = {
      payment: 'Cobros',
      grades: 'Notas',
      document: 'Documentos',
      message: 'Mensajes',
      system: 'Sistema',
    };
    return labels[type];
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Overlay suave - solo oscurece sin bloquear */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/5 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Panel deslizable */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header del panel */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-blue-600">
                  {unreadCount} sin leer
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filtros */}
        <div className="border-b border-gray-200 px-6 py-3 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('payment')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'payment'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cobros
            </button>
            <button
              onClick={() => setFilter('grades')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'grades'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Notas
            </button>
            <button
              onClick={() => setFilter('document')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'document'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Documentos
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 p-6">
              <Bell className="w-12 h-12 opacity-20" />
              <p className="text-center text-sm">
                No hay notificaciones en esta categoría
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  } animate-in fade-in slide-in-from-right-2 duration-300`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.action && (
                          <a
                            href={notification.action.href}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                            }}
                          >
                            {notification.action.label}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer del panel */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 shrink-0">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Ver todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function formatTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return time.toLocaleDateString('es-PE');
}
