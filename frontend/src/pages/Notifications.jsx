"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UserCheckIcon
} from "lucide-react";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Navbar from "@/components/ui/Navbar";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isLoading: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];

  const UserCard = ({ user, actionBtn, statusBadge }) => (
    <div
      className="bg-gray-900/80 rounded-xl shadow hover:shadow-md transition-shadow p-4 flex items-center justify-between cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-4">
        <div className="avatar w-14 h-14 rounded-full overflow-hidden bg-gray-800/80">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt={user.fullName || user.username}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-md font-semibold text-white">
            {user.fullName || user.username}
          </h3>
          {user.username && (
            <p className="text-white/60 lowercase tracking-wide text-sm">
              @{user.username}
            </p>
          )}
        </div>
      </div>

      {/* Action button or status badge */}
      {actionBtn ? (
        actionBtn
      ) : statusBadge ? (
        <div className="badge badge-success flex items-center gap-1 px-3 py-1 text-sm">
          {statusBadge.icon}
          <span>{statusBadge.text}</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full">
      <BackgroundGradientAnimation />

      <Navbar className="relative z-20" />

      <main
        className={cn(
          "absolute top-20 bg-white/10 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl p-6 space-y-12 rounded-lg shadow-lg mt-8 min-h-[70vh]"
        )}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Notifications
          </span>
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Friend Requests Section */}
            <section className="space-y-6 mt-6">
              <h2 className="text-lg font-semibold flex items-center gap-3 text-white">
                <UserCheckIcon className="h-5 w-5 text-white" />
                Friend Requests
                {incomingRequests.length > 0 && (
                  <span className="badge badge-primary ml-2 text-base">
                    {incomingRequests.length}
                  </span>
                )}
              </h2>

              {incomingRequests.length > 0 ? (
                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <UserCard
                      key={request._id}
                      user={request.sender}
                      actionBtn={
                        <button
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isAccepting}
                          className={cn(
                            "btn btn-xs px-4 py-1 font-semibold transition-colors",
                            isAccepting
                              ? "bg-purple-600 opacity-70 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-800"
                          )}
                        >
                          {isAccepting ? "Accepting..." : "Accept"}
                        </button>
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-200 italic px-4 py-6">
                  No friend requests found.
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Notifications;
