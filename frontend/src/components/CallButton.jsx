import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="absolute top-3 right-3 z-20">
      <button
        onClick={handleVideoCall}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md"
      >
        <VideoIcon className="size-6" />
      </button>
    </div>
  );
}

export default CallButton;
