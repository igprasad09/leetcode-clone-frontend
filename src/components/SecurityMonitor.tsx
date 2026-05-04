import  { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SecurityMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const hasViolated = useRef(false); 

  // 1. Load the AI Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl').catch(() => console.log("WebGL not supported, falling back to CPU"));
        await tf.ready();
        
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log("AI Model Loaded");
      } catch (err) {
        console.error("Failed to load AI model", err);
      }
    };
    loadModel();
  }, []);

  // 2. Setup Camera AND Cleanup on Unmount
  useEffect(() => {
    // Keep a reference to the active stream so we can shut it down later
    let activeStream: MediaStream | null = null;

    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 224, height: 224 }, 
            audio: false,
          });
          
          activeStream = stream; // Save the stream to our variable
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraReady(true);
          }
        } catch (err) {
          toast.error("Camera access is required.");
        }
      }
    }
    setupCamera();

    // 👉 THE FIX: React runs this return function when the component unmounts
    // (e.g., when the user gets kicked to the dashboard for switching tabs)
    return () => {
      if (activeStream) {
        console.log("Shutting down camera hardware...");
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 3. AI Detection Loop
  useEffect(() => {
    if (!model || !isCameraReady) return;

    const interval = setInterval(async () => {
      if (hasViolated.current || !videoRef.current) return;

      try {
        const predictions = await model.detect(videoRef.current);
        const phoneDetected = predictions.find(p => p.class === "cell phone");

        if (phoneDetected) {
          hasViolated.current = true;
          toast.error("Mobile device detected! Session terminated.");
          
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          
          // Note: We don't necessarily need to manually stop the stream here anymore
          // because navigating away will unmount the component and trigger the cleanup above!
          setTimeout(() => {
            navigate("/dashboard");
          }, 100); 
        }
      } catch (error) {
        console.error("Prediction error:", error);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [model, isCameraReady, navigate]);

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