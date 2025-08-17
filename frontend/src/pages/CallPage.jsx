import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";

import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { Vortex } from "../components/ui/vortex";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Single global active client per tab
let activeClient = null;
let activeCall = null;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();

  // Fetch token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!authUser || !tokenData?.token || !callId) return;

      // Leave previous call if exists
      if (activeCall) {
        try {
          await activeCall.leave();
        } catch (err) {
          console.error("Error leaving previous call:", err);
        }
        activeCall = null;
      }

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        // Reuse client or create new
        const clientInstance =
          activeClient ||
          new StreamVideoClient({
            apiKey: STREAM_API_KEY,
            user,
            token: tokenData.token,
          });

        const callInstance = clientInstance.call("default", callId);
        await callInstance.join({ create: true });

        // Save global references
        activeClient = clientInstance;
        activeCall = callInstance;

        setClient(clientInstance);
        setCall(callInstance);
      } catch (err) {
        console.error("Error joining call:", err);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      // Leave call on unmount
      const cleanup = async () => {
        if (activeCall) {
          try {
            await activeCall.leave();
          } catch (err) {
            console.error("Error leaving call:", err);
          } finally {
            activeCall = null;
          }
        }
        setCall(null);
        setClient(null);
      };
      cleanup();
    };
  }, [authUser, tokenData, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <Vortex
          backgroundColor="black"
          className="flex items-center justify-center w-full h-full"
        />
      </div>

      <div className="relative w-full h-full z-10 flex items-center justify-center">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent navigate={navigate} callId={callId} call={call} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = ({ navigate, callId, call }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      if (call) call.leave();
      activeCall = null;
      navigate("/");
    }
  }, [callingState, call, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/call/${callId}`);
    toast.success("Invite link copied!");
  };

  return (
    <StreamTheme>
      <div className="flex flex-col items-center w-full h-full mt-10 relative">
        <button
          onClick={handleCopyLink}
          className="fixed top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition z-50"
        >
          Invite Friends!
        </button>

        <div className="w-[80%] max-w-4xl rounded-xl overflow-hidden shadow-2xl">
          <SpeakerLayout className="w-full h-full" />
        </div>

        <div className="mt-4">
          <CallControls
            call={call}
            onLeave={() => {
              if (call) call.leave();
              activeCall = null;
              navigate("/");
            }}
          />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;
