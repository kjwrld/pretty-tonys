import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface SmoothCameraControlsProps {
    cameraSettings: {
        basePosition: { x: number; y: number; z: number };
        sensitivity: { x: number; y: number };
        lerpFactor: number;
        lookAtTarget: { x: number; y: number; z: number };
        fov: number;
        enableMouseControl: boolean;
    };
}

export default function SmoothCameraControls({ cameraSettings }: SmoothCameraControlsProps) {
    const { camera, size } = useThree();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Set initial camera position
        camera.position.set(
            cameraSettings.basePosition.x,
            cameraSettings.basePosition.y,
            cameraSettings.basePosition.z
        );
        camera.lookAt(
            cameraSettings.lookAtTarget.x,
            cameraSettings.lookAtTarget.y,
            cameraSettings.lookAtTarget.z
        );

        const handleMouseMove = (event: MouseEvent) => {
            if (!cameraSettings.enableMouseControl) return;

            // Normalize mouse coordinates to -1 to 1
            const x = (event.clientX / size.width) * 2 - 1;
            const y = -(event.clientY / size.height) * 2 + 1;

            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [camera, size, cameraSettings.enableMouseControl]);

    useFrame(() => {
        // Calculate target position based on mouse and base position
        const targetX =
            cameraSettings.basePosition.x +
            (cameraSettings.enableMouseControl
                ? mousePos.x * cameraSettings.sensitivity.x
                : 0);
        const targetY =
            cameraSettings.basePosition.y +
            (cameraSettings.enableMouseControl
                ? mousePos.y * cameraSettings.sensitivity.y
                : 0);
        const targetZ = cameraSettings.basePosition.z;

        // Lerp camera position smoothly
        camera.position.x +=
            (targetX - camera.position.x) * cameraSettings.lerpFactor;
        camera.position.y +=
            (targetY - camera.position.y) * cameraSettings.lerpFactor;
        camera.position.z +=
            (targetZ - camera.position.z) * cameraSettings.lerpFactor;

        // Update FOV
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = cameraSettings.fov;
            camera.updateProjectionMatrix();
        }

        // Look at target
        camera.lookAt(
            cameraSettings.lookAtTarget.x,
            cameraSettings.lookAtTarget.y,
            cameraSettings.lookAtTarget.z
        );
    });

    return null;
}