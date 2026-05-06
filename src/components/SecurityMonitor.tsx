import { useEffect, useRef, useState } from "react";
import { ObjectDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SecurityMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  const [objectDetector, setObjectDetector] = useState<ObjectDetector | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isAiLoaded, setIsAiLoaded] = useState(false);
  const hasViolated = useRef(false);

  // 1. Initialize AI
  useEffect(() => {
    const initializeModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
            // SWITCHED TO CPU: GPU is highly unstable in production browsers
            delegate: "CPU" 
          },
          scoreThreshold: 0.5,
          runningMode: "VIDEO"
        });
        
        setObjectDetector(detector);
        setIsAiLoaded(true);
      } catch (err) {
        console.error("AI Initialization Failed:", err);
        toast.error("Failed to start security proctor. Please check connection.");
      }
    };
    initializeModel();
  }, []);

  // 2. Setup Camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        activeStream = stream; 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for the video metadata to load before marking as ready
          videoRef.current.onloadedmetadata = () => {
             setIsCameraReady(true);
          };
        }
      } catch (err) {
        toast.error("Camera access denied. Please allow camera permissions.");
      }
    }
    setupCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 3. Optimized detection loop
  useEffect(() => {
    if (!objectDetector || !isCameraReady || !videoRef.current) return;

    const video = videoRef.current;
    let animationFrameId: number;
    let lastVideoTime = -1;

    const predict = () => {
      if (hasViolated.current) return;

      // CRITICAL CHECK: Ensure video has dimensions and data before passing to AI
      if (video.currentTime !== lastVideoTime && video.videoWidth > 0 && video.readyState >= 2) {
        lastVideoTime = video.currentTime;
        const startTimeMs = performance.now();

        try {
            const results = objectDetector.detectForVideo(video, startTimeMs);
            const phoneDetected = results.detections.find(
              d => d.categories[0].categoryName === "cell phone"
            );
    
            if (phoneDetected) {
              hasViolated.current = true;
              toast.error("Security Violation: Mobile device detected!");
              
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              }
              
              if (video.srcObject) {
                (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
              }
    
              setTimeout(() => navigate("/dashboard"), 100);
              return; 
            }
        } catch (error) {
            console.warn("Detection frame skipped:", error);
        }
      }
      animationFrameId = requestAnimationFrame(predict);
    };

    predict();
    return () => cancelAnimationFrame(animationFrameId);
  }, [objectDetector, isCameraReady, navigate]);

  // Show a loading state instead of returning null to prevent the "black screen" illusion
  if (!isAiLoaded) {
      return (
        <div className="fixed bottom-4 right-4 z-[200] bg-zinc-900/80 border border-zinc-800 p-2 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Loading Proctor...</span>
        </div>
      );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      {/* Invisible video element that still performs detection */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '1px', height: '1px', opacity: 0.01 }} 
      />
      
      {/* Live indicator so user knows they are protected */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-lg flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-[10px] font-bold text-zinc-400 uppercase">AI Protected</span>
      </div>
    </div>
  );
}
