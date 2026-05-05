import React, { useEffect, useRef, useState } from "react";
import { ObjectDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SecurityMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  const [objectDetector, setObjectDetector] = useState<ObjectDetector | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const hasViolated = useRef(false);

  // 1. Load Only the Object Detector (Lightning Fast)
  useEffect(() => {
    const initializeModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
            delegate: "GPU" // Uses the graphics card for zero lag
          },
          scoreThreshold: 0.55, // 55% confidence required to trigger
          runningMode: "VIDEO"
        });
        
        setObjectDetector(detector);
        console.log("Ultra-Fast Phone Detector Loaded");
      } catch (err) {
        console.error("Failed to load model", err);
      }
    };
    initializeModel();
  }, []);

  // 2. Setup Low-Res Camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 }, // Low res = fast processing
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

    // Turn off the camera when this component is destroyed
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 3. High-Speed Detection Loop
  useEffect(() => {
    if (!objectDetector || !isCameraReady || !videoRef.current) return;

    const video = videoRef.current;
    let animationFrameId: number;
    let lastVideoTime = -1;

    const predict = () => {
      if (hasViolated.current) return;

      // Only run math if the video actually produced a new frame
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const startTimeMs = performance.now();

        const results = objectDetector.detectForVideo(video, startTimeMs);
        const phoneDetected = results.detections.find(
          d => d.categories[0].categoryName === "cell phone"
        );

        if (phoneDetected) {
          hasViolated.current = true;
          toast.error("Mobile device detected! Session terminated.");
          
          // 1. Exit Fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          
          // 2. Turn off the camera instantly
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }

          // 3. Kick to dashboard
          setTimeout(() => {
            navigate("/dashboard");
          }, 100);
          
          return; // Stop the loop forever
        }
      }
      
      // Keep looping smoothly with the browser's refresh rate
      animationFrameId = requestAnimationFrame(predict);
    };

    predict();

    return () => cancelAnimationFrame(animationFrameId);
  }, [objectDetector, isCameraReady, navigate]);

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
