import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircleIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const RecommendedFriends = ({ currentUser }) => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: recommendedUsersRaw = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });
      const previousOutgoing = new Set(outgoingRequestsIds);
      setOutgoingRequestsIds((prev) => new Set(prev).add(userId));
      return { previousOutgoing };
    },
    onError: (err, variables, context) => {
      setOutgoingRequestsIds(context.previousOutgoing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  const recommendedUsers = useMemo(() => {
    if (!currentUser?.primaryInterests?.length)
      return recommendedUsersRaw.slice(0, 12);

    const myInterestsLower = currentUser.primaryInterests.map((i) =>
      i.trim().toLowerCase()
    );

    return recommendedUsersRaw
      .map((user) => {
        const commonInterests =
          user.primaryInterests?.filter((interest) =>
            myInterestsLower.includes(interest.trim().toLowerCase())
          ) || [];
        return {
          ...user,
          commonCount: commonInterests.length,
          commonInterests,
        };
      })
      .filter((user) => user.commonCount > 0)
      .sort((a, b) => b.commonCount - a.commonCount)
      .slice(0, 12);
  }, [recommendedUsersRaw, currentUser]);

  return (
    <section className="px-6 bg-black pt-0 pb-60 mt-0 mb-0">
      {loadingUsers ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : recommendedUsers.length === 0 ? (
        <div className="text-center text-white opacity-70 py-4">
          No friends recommendations available right now.
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {recommendedUsers.map((user, i) => {
            const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <CardSpotlight className="p-6 !mt-0 !mb-0">
                  <div className="flex items-center gap-8 text-white">
                    {/* Left: Profile Picture */}
                    <div className="flex-shrink-0 w-32 h-40 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-gray-800">
                      <img
                        src={user.profilePic || "/default-avatar.png"}
                        alt={user.fullName}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Right: User Details */}
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <h3 className="text-2xl font-semibold">{user.fullName}</h3>

                      <div className="flex flex-wrap gap-2">
                        {user.primaryInterests?.map((interest, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-sm ${
                              user.commonInterests?.includes(interest)
                                ? "bg-purple-600"
                                : "bg-purple-600/30"
                            }`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70 max-w-lg">{user.bio}</p>
                      )}

                      <button
                        className={`inline-flex items-center px-5 py-2 rounded-full border border-white transition-colors duration-200 w-max
                        ${
                          hasRequestBeenSent
                            ? "bg-transparent text-white cursor-not-allowed"
                            : "bg-white text-black hover:bg-transparent hover:text-white"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="w-4 h-4 mr-2" />
                            Add Friend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecommendedFriends;
