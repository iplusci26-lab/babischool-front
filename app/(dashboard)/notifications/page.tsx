"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Trash2
} from "lucide-react";

import { api } from "@/lib/api";

import { useRouter } from "next/navigation";
import {
  useNotificationsSocket
}
from "@/lib/hooks/useNotificationsSocket"


import {
  useNotificationStore
}
from "@/lib/store/notificationStore";

export default function NotificationsPage() {

  const [
    nextPage,
    setNextPage
  ] = useState<string | null>(
    null
  );

  
  const clearReadNotifications =
  useNotificationStore(
    state =>
      state.clearReadNotifications
  );

  const notifications =
  useNotificationStore(
    state => state.notifications
  );

const setNotifications =
  useNotificationStore(
    state => state.setNotifications
  );

const storeMarkAsRead =
  useNotificationStore(
    state => state.markAsRead
  );

const storeMarkAllRead =
  useNotificationStore(
    state => state.markAllRead
  );

const deleteNotification =
  useNotificationStore(
    state => state.deleteNotification
  );

const appendNotifications =
  useNotificationStore(
    state =>
      state.appendNotifications
  );


  const router =
  useRouter();
  useState<any[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    filter,
    setFilter
  ] = useState("all");

  const loadNotifications =
    async () => {

      try {

        const res =
          await api.get(
            "/notifications/"
          );
       
        setNotifications(
          res.data.results || res.data
        );

        setNextPage(
          res.data.next
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadNotifications();

  }, []);

  const markAsRead =
    async (
      id: string
    ) => {

      try {

        await api.post(
          `/notifications/read/${id}/`
        );
        storeMarkAsRead(id);
        /*setNotifications(
          prev =>
            prev.map(
              (item: any) =>
                item.id === id
                  ? {
                      ...item,
                      is_read: true,
                    }
                  : item
            )
        );*/

       

      } catch (error) {

        console.error(error);
      }
    };

  const markAllRead =
    async () => {

      try {

        await api.post(
          "/notifications/read-all/"
        );
        storeMarkAllRead();
        /*setNotifications(
          prev =>
            prev.map(
              (item: any) => ({
                ...item,
                is_read: true
              })
            )
        );*/

      } catch (error) {

        console.error(error);
      }
    };
  
  const filteredNotifications =
    notifications?.filter(
      (item) => {

        if (
          filter === "all"
        ) {
          return true;
        }

        if (
          filter === "unread"
        ) {
          return !item.is_read;
        }

        return item.is_read;
      }
    );

  const unreadCount =
    notifications.filter(
      (n) =>
        !n.is_read
    ).length;

    useNotificationsSocket({
      onNotification: () => {
    
        loadNotifications();

      },
    });
  
    const removeNotification =
      async (
        id: string
      ) => {

        try {

          await api.delete(
            `/notifications/delete/${id}/`
          );

          deleteNotification(
            id
          );

        } catch (
          error
        ) {

          console.error(
            error
          );
        }
      };

      const loadMore =
        async () => {

          if (!nextPage) {
            return;
          }

          try {

            const res =
              await api.get(
                nextPage
              );

            setNotifications([
              res.data.results
            ]);

            setNextPage(
              res.data.next
            );

          } catch (
            error
          ) {

            console.error(
              error
            );
          }
        };

      const deleteReadNotifications =
        async () => {
          const confirmDelete =
          window.confirm(
            "Supprimer toutes les notifications lues ?"
          );

          if (!confirmDelete) {
            return;
          }
          try {
        
            await api.delete(
              "/notifications/delete-read/"
            );
        
            clearReadNotifications();
        
          } catch (
            error
          ) {
        
            console.error(
              error
            );
          }
        };

        const groupedNotifications =
          Object.values(

            filteredNotifications.reduce(
              (
                acc,
                notification
              ) => {

                const key =
                  notification.notification_type +

                  "-" +
        
                  (
                    notification.object_id ||
                    ""
                  );

                if (
                  !acc[key]
                ) {

                  acc[key] = [];
                }

                acc[key].push(
                  notification
                );

                return acc;

              },
              {} as Record<
                string,
                any[]
              >
            )
          );

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Notifications

          </h1>

          <p className="text-gray-500 mt-1">

            Centre de notifications

          </p>

        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (

            <button
              onClick={
                markAllRead
              }
              className="bg-indigo-600 text-white cursor-pointer px-5 py-3 rounded-2xl flex items-center gap-2"
            >

              <CheckCheck
                size={18}
              />

              Tout marquer lu

            </button>
          )}
          <button
            onClick={
              deleteReadNotifications
            }
            className="
            bg-red-500
            text-white
            px-5
            py-3
            rounded-2xl
            cursor-pointer
            "
          >

            Nettoyer les lues

          </button>
      </div>
    </div>

      {/* KPI */}

      <div className="grid md:grid-cols-3 gap-5">

        <Card
          title="Total"
          value={
            notifications.length
          }
        />

        <Card
          title="Non lues"
          value={
            unreadCount
          }
        />

        <Card
          title="Lues"
          value={
            notifications.length -
            unreadCount
          }
        />

      </div>

      {/* FILTERS */}

      <div className="flex gap-3">

        <FilterButton
          label="Toutes"
          value="all"
          current={filter}
          setFilter={setFilter}
        />

        <FilterButton
          label="Non lues"
          value="unread"
          current={filter}
          setFilter={setFilter}
        />

        <FilterButton
          label="Lues"
          value="read"
          current={filter}
          setFilter={setFilter}
        />

      </div>

      {/* LISTE */}

      {loading ? (

        <div className="bg-white border rounded-3xl p-6">

          Chargement...

        </div>

      ) : (

        <div className="bg-white border rounded-3xl overflow-hidden">

          {filteredNotifications.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              Aucune notification

            </div>

          ) : (

            groupedNotifications.map((group: any) => {

              const firstNotification = group[0];
            
              return (
            
                <div
                  key={firstNotification.id}
                  className="border-b"
                >
            
                  {group.length > 1 && (
            
                    <div className="
                      px-5
                      py-2
                      bg-gray-50
                      text-xs
                      text-gray-500
                      font-semibold
                    ">
                      {firstNotification.notification_type}
                      {" • "}
                      {group.length} notifications
                    </div>
            
                  )}
            
                  {group.map((notification: any) => (
            
                    <div
                      key={notification.id}
                      onClick={async () => {
            
                        if (!notification.is_read) {
            
                          await markAsRead(
                            notification.id
                          );
                        }
            
                        if (notification.url) {
            
                          router.push(
                            notification.url
                          );
                        }
                      }}
                      className={`
                        cursor-pointer
                        p-5
                        flex
                        justify-between
                        hover:bg-gray-50
                        ${
                          !notification.is_read
                            ? "bg-indigo-50"
                            : ""
                        }
                      `}
                    >
            
                      {/* CONTENU */}
            
                      <div className="flex-1">
            
                        <div className="flex items-center gap-2">
            
                          <Bell size={16} />
            
                          <h3 className="font-semibold">
            
                            {notification.title}
            
                          </h3>
            
                        </div>
            
                        <p className="text-gray-600 mt-2">
            
                          {notification.message}
            
                        </p>
            
                        <p className="text-sm text-gray-400 mt-2">
            
                          {notification.notification_type}
            
                          {" • "}
            
                          {new Date(
                            notification.created_at
                          ).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
            
                        </p>
            
                      </div>
            
                      {/* ACTIONS */}
            
                      <div
                        className="
                          flex
                          flex-col
                          items-end
                          gap-2
                          ml-4
                        "
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
            
                        {!notification.is_read && (
            
                          <button
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            className="
                              text-indigo-600
                              flex
                              items-center
                              gap-1
                              text-sm
                            "
                          >
            
                            <Check size={16} />
            
                            Lu
            
                          </button>
            
                        )}
            
                        <button
                          onClick={() =>
                            removeNotification(
                              notification.id
                            )
                          }
                          className="
                            text-red-500
                            hover:text-red-700
                            text-sm
                            cursor-pointer
                          "
                        >
            
                          <Trash2 size={18} />
            
                        </button>
            
                      </div>
            
                    </div>
            
                  ))}
            
                </div>
            
              );
            })
          )}

          {nextPage && (

            <div className="p-5 flex justify-center">

              <button
                onClick={loadMore}
                className="
                px-4
                py-2
                bg-indigo-600
                text-white
                rounded-xl
                "
              >

                Charger plus

              </button>

            </div>

            )}
        </div>
        
        
      )}

    </div>
  );
}

function Card({
  title,
  value
}: any) {

  return (

    <div className="bg-white border rounded-3xl p-5">

      <p className="text-gray-500 text-sm">

        {title}

      </p>

      <h3 className="text-3xl font-bold mt-2">

        {value}

      </h3>

    </div>
  );
}

function FilterButton({
  label,
  value,
  current,
  setFilter
}: any) {

  return (

    <button
      onClick={() =>
        setFilter(value)
      }
      className={`px-4 py-2 rounded-xl border cursor-pointer ${
        current === value
          ? "bg-indigo-600 text-white"
          : "bg-white"
      }`}
    >

      {label}

    </button>
  );
}