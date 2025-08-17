import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";

import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import Navbar from "@/components/ui/navbar";
import CallButton from "../components/CallButton";
import ChatLoader from "../components/ChatLoader";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// ✅ Create client ONCE globally (not inside component)
const client = StreamChat.getInstance(STREAM_API_KEY);

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        // Disconnect previous user only if different
        if (client.userID && client.userID !== authUser._id) {
          await client.disconnectUser();
        }

        // Connect user
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // Create unique channel id (sorted to avoid duplicates)
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
    // 🔹 No disconnect on unmount
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !channel) return <ChatLoader />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Shader Bg addition here */}
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=1.1&cAzimuthAngle=180&cDistance=3.9&cPolarAngle=115&cameraZoom=1&color1=%23000092&color2=%23a9546e&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=-0.5&positionY=0.1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=235&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.1&uFrequency=5.5&uSpeed=0.1&uStrength=2.4&uTime=0.2&wireframe=false"
        />
      </ShaderGradientCanvas>
      <Navbar className="relative z-20" />

      {/* Chat container */}
      <div className="flex-1 flex justify-center items-center p-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-5xl h-[80vh] overflow-hidden mt-20">
          <Chat client={client}>
            <Channel channel={channel}>
              <div className="w-full relative h-full">
                <CallButton handleVideoCall={handleVideoCall} />

                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput focus />
                </Window>
              </div>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
