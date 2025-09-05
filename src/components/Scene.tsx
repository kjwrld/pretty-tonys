import { Canvas } from "@react-three/fiber";
import { Environment, Center, Html, useProgress } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import Stats from "stats.js";
import { DRACOLoader } from "three-stdlib";
import { GLTFLoader } from "three-stdlib";
import PoloModel from "./models/PoloModel";
import SceneLights from "./SceneLights";
import SmoothCameraControls from "./SmoothCameraControls";
import CentralizedGUI from "./CentralizedGUI";

// Loading component
function Loader() {
    const { progress, loaded, total } = useProgress();
    const [loadStartTime] = useState(() => Date.now());
    const [loadTime, setLoadTime] = useState<number | null>(null);

    useEffect(() => {
        if (progress === 100 && !loadTime) {
            const time = Date.now() - loadStartTime;
            setLoadTime(time);
            console.log(`🚀 Model loaded in ${time}ms`);
            console.log(`📊 Total size: ${(total / 1024 / 1024).toFixed(2)}MB`);
        }
    }, [progress, loadStartTime, loadTime, total]);

    return (
        <Html center>
            <div
                style={{
                    color: "white",
                    fontSize: "24px",
                    fontFamily: "Arial, sans-serif",
                    textAlign: "center",
                }}
            >
                <div>Loading Polo...</div>
                <div style={{ fontSize: "18px", marginTop: "10px" }}>
                    {Math.round(progress)}%
                </div>
                <div
                    style={{ fontSize: "14px", marginTop: "5px", opacity: 0.8 }}
                >
                    {(loaded / 1024 / 1024).toFixed(1)}MB /{" "}
                    {(total / 1024 / 1024).toFixed(1)}MB
                </div>
                {loadTime && (
                    <div
                        style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color: "#4ade80",
                        }}
                    >
                        Loaded in {loadTime}ms
                    </div>
                )}
            </div>
        </Html>
    );
}

// Performance stats component
function PerformanceStats() {
    const statsRef = useRef<Stats>();

    useEffect(() => {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        stats.dom.style.position = "absolute";
        stats.dom.style.top = "10px";
        stats.dom.style.left = "10px";
        stats.dom.style.zIndex = "1000";
        document.body.appendChild(stats.dom);
        statsRef.current = stats;

        return () => {
            if (stats.dom && stats.dom.parentNode) {
                stats.dom.parentNode.removeChild(stats.dom);
            }
        };
    }, []);

    // Update stats using requestAnimationFrame instead of useFrame for better compatibility
    useEffect(() => {
        const updateStats = () => {
            if (statsRef.current) {
                statsRef.current.update();
            }
            requestAnimationFrame(updateStats);
        };
        updateStats();
    }, []);

    return null;
}

export default function Scene() {

    // Centralized state management
    const [lightSettings, setLightSettings] = useState({
        pointLight: {
            position: [1.4, 1.4, 1.4] as [number, number, number],
            intensity: 5,
            color: "#ffffff",
        },
        ambientIntensity: 0.8,
        directionalIntensity: 1,
        backgroundColor: "#ffffff",
    });

    const [cameraSettings, setCameraSettings] = useState({
        basePosition: { x: 0, y: 1, z: 5 },
        sensitivity: { x: -2, y: 0.4 },
        lerpFactor: 0.1,
        lookAtTarget: { x: 0, y: 0, z: 0 },
        fov: 12,
        enableMouseControl: true,
    });

    const [modelSettings, setModelSettings] = useState({
        scale: 0.01,
        position: { x: 0, y: -1.2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
    });


    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <PerformanceStats />
            
            {/* Centralized GUI */}
            <CentralizedGUI
                lightSettings={lightSettings}
                onLightChange={setLightSettings}
                cameraSettings={cameraSettings}
                onCameraChange={setCameraSettings}
                modelSettings={modelSettings}
                onModelChange={setModelSettings}
            />

            <Canvas
                camera={{ position: [0, 1, 5], fov: 12 }}
                shadows
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => {
                    // Set up Draco loader for the scene
                    const dracoLoader = new DRACOLoader();
                    dracoLoader.setDecoderPath('/draco/');
                    dracoLoader.setDecoderConfig({ type: 'js' });
                    
                    // Store globally for useGLTF
                    (window as any).dracoLoader = dracoLoader;
                }}
            >
                <SmoothCameraControls cameraSettings={cameraSettings} />
                <Suspense fallback={<Loader />}>
                    <Environment preset="studio" />
                    {/* <SceneLights lightSettings={lightSettings} /> */}
                    <Center>
                        <PoloModel modelSettings={modelSettings} />
                    </Center>
                </Suspense>
            </Canvas>
        </div>
    );
}