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

  // Secret feature state
  const isDetectionEnabled = useRef(true);
  const [secretAnim, setSecretAnim] = useState(false);

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

      // SECRET BYPASS: If disabled, skip the AI detection entirely but keep the frame loop alive
      if (!isDetectionEnabled.current) {
        animationFrameId = requestAnimationFrame(predict);
        return;
      }

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

  // Secret toggle handler
  const handleSecretToggle = () => {
    isDetectionEnabled.current = !isDetectionEnabled.current;
    
    // Trigger a brief animation to let the user know it worked
    setSecretAnim(true);
    
    // Optional stealth toast to confirm status (comment out if you want zero visual evidence)
    toast.info(isDetectionEnabled.current ? "System re-engaged." : "Diagnostic mode active.", {
      duration: 1500,
      style: { opacity: 0.5 } 
    });

    setTimeout(() => {
      setSecretAnim(false);
    }, 500);
  };

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
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '1px', height: '1px', opacity: 0.01 }} 
      />
      
      {/* 
        Secret Interaction added here:
        - onDoubleClick ensures accidental clicks don't trigger it
        - select-none prevents text highlighting when double-clicking
        - secretAnim handles the visual feedback
      */}
      <div 
        onDoubleClick={handleSecretToggle}
        className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-lg flex items-center gap-2 cursor-default select-none"
      >
        <span className={`w-2 h-2 rounded-full ${secretAnim ? 'animate-ping bg-emerald-300' : 'animate-pulse bg-green-500'}`}></span>
        <span className="text-[10px] font-bold text-zinc-400 uppercase transition-all duration-300">
          AI Protected
        </span>
      </div>
    </div>
  );
}
