import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface SceneLightsProps {
    lightSettings: {
        pointLight: {
            position: [number, number, number];
            intensity: number;
            color: string;
        };
        ambientIntensity: number;
        directionalIntensity: number;
        backgroundColor: string;
    };
}

export default function SceneLights({ lightSettings }: SceneLightsProps) {
    const { scene } = useThree();
    const pointLightRef = useRef<THREE.PointLight>(null);
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const directionalLightRef = useRef<THREE.DirectionalLight>(null);

    useFrame(() => {
        if (pointLightRef.current) {
            pointLightRef.current.position.set(...lightSettings.pointLight.position);
            pointLightRef.current.intensity = lightSettings.pointLight.intensity;
            pointLightRef.current.color.set(lightSettings.pointLight.color);
        }

        if (ambientLightRef.current) {
            ambientLightRef.current.intensity = lightSettings.ambientIntensity;
        }

        if (directionalLightRef.current) {
            directionalLightRef.current.intensity = lightSettings.directionalIntensity;
        }

        scene.background = new THREE.Color(lightSettings.backgroundColor);
    });

    return (
        <>
            <ambientLight
                ref={ambientLightRef}
                intensity={lightSettings.ambientIntensity}
            />
            <directionalLight
                ref={directionalLightRef}
                position={[10, 10, 5]}
                intensity={lightSettings.directionalIntensity}
            />
            <pointLight
                ref={pointLightRef}
                position={lightSettings.pointLight.position}
                intensity={lightSettings.pointLight.intensity}
                color={lightSettings.pointLight.color}
                castShadow
            />
        </>
    );
}