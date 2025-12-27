import { useEffect, useState } from "react";
import api from "../api/axios";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/notifications").then((res) => {
      setNotifications(res.data);
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center
                   hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-200 group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-pink-600 text-white 
                         text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center
                         animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 
                        shadow-2xl shadow-black/50 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-gray-200">Notifications</h3>
              <p className="text-xs text-gray-500 mt-1">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🔕</span>
                  </div>
                  <p className="text-gray-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-200
                              ${!n.read ? 'bg-blue-900/10' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">📌</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-gray-800 bg-gray-900/50">
              <button className="text-sm text-gray-400 hover:text-gray-300 transition-colors w-full text-center py-2">
                Mark all as read
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;