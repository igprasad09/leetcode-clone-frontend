import { useEffect, useRef, useState } from "react";
import { ObjectDetector, FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SecurityMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  const [objectDetector, setObjectDetector] = useState<ObjectDetector | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const hasViolated = useRef(false); 
  const missingStrikes = useRef(0);
  const lastStrikeTime = useRef(0);

  // 1. Load Only Essential, High-Speed Models
  useEffect(() => {
    const initializeModels = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        // Object Detector (Mobile Phones)
        const objDetector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
            delegate: "GPU" // Force hardware acceleration
          },
          scoreThreshold: 0.5,
          runningMode: "VIDEO"
        });
        setObjectDetector(objDetector);

        // Basic Face Detector (Count faces, no heavy 3D tracking)
        const faceDetector = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 2, // Only need to know if there's 1 or 2+ faces
          // outputFacialBlendshapes removed to fix TS2561 error and optimize performance
        });
        setFaceLandmarker(faceDetector);
        
        console.log("Optimized Security Models Loaded");
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };
    initializeModels();
  }, []);

  // 2. Setup Low-Resolution Camera (Faster Processing)
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 }, // Keeps CPU load very low
            audio: false,
          });
          activeStream = stream; 
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraReady(true);
          }
        } catch (err) {
          toast.error("Camera access is required for proctoring.");
        }
      }
    }
    setupCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 3. High-Speed, Lightweight Detection Loop
  useEffect(() => {
    if (!objectDetector || !faceLandmarker || !isCameraReady || !videoRef.current) return;

    const video = videoRef.current;
    let animationFrameId: number;
    let lastVideoTime = -1;

    const predict = async () => {
      if (hasViolated.current) return;

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const startTimeMs = performance.now();

        // --- RULE 1: NO PHONES ---
        const objResults = objectDetector.detectForVideo(video, startTimeMs);
        const phoneDetected = objResults.detections.find(d => d.categories[0].categoryName === "cell phone");
        
        if (phoneDetected) {
          triggerTermination("Mobile device detected!");
          return;
        }

        // --- FACE TRACKING RULES ---
        const faceResults = faceLandmarker.detectForVideo(video, startTimeMs);
        const faceCount = faceResults.faceLandmarks ? faceResults.faceLandmarks.length : 0;

        // RULE 2: NO FRIENDS (Multiple People)
        if (faceCount > 1) {
          triggerTermination("Multiple people detected in the frame!");
          return;
        }

        // RULE 3: STAY IN YOUR SEAT (Face Missing)
        if (faceCount === 0) {
          const now = Date.now();
          if (now - lastStrikeTime.current > 5000) { // 5-second grace period
            missingStrikes.current += 1;
            lastStrikeTime.current = now;

            if (missingStrikes.current === 1) {
              toast.warning("Warning 1: Face not detected! Please stay in your seat.");
            } else if (missingStrikes.current === 2) {
              toast.warning("Warning 2: Please return to the frame. Final warning.");
            } else if (missingStrikes.current >= 3) {
              triggerTermination("Exam Terminated: User left the testing area.");
              return;
            }
          }
        } else {
          // Reset strikes if they are sitting normally in frame for a while
          // (Optional: You can remove this if you want strikes to be permanent)
          if (Date.now() - lastStrikeTime.current > 10000) {
             missingStrikes.current = 0;
          }
        }
      }
      
      // Syncs perfectly with the browser's refresh rate
      animationFrameId = requestAnimationFrame(predict);
    };

    predict();

    return () => cancelAnimationFrame(animationFrameId);
  }, [objectDetector, faceLandmarker, isCameraReady, navigate]);

  // --- TERMINATION HANDLER ---
  const triggerTermination = (message: string) => {
    hasViolated.current = true;
    toast.error(message);
    
    // Exit Fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    
    // Kill Camera hardware
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    // Instant Redirect
    setTimeout(() => {
      navigate("/dashboard");
    }, 100);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      <div className="relative group">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-24 h-24 rounded-lg border-2 border-zinc-800 bg-black object-cover opacity-20 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute top-1 left-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-white uppercase shadow-black drop-shadow-md">Proctor</span>
        </div>
      </div>
    </div>
  );
}