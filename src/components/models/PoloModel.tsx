import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

interface PoloModelProps {
    modelSettings: {
        scale: number;
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number };
    };
}

export default function PoloModel({ modelSettings }: PoloModelProps) {
    const gltf = useGLTF(
        "/models/CORE TIPPED POLO PINK_gltf_thick/CORE TIPPED POLO PINK_gltf_thick_optimized.gltf"
    );
    const modelRef = useRef();

    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.scale.setScalar(modelSettings.scale);
            modelRef.current.position.set(
                modelSettings.position.x,
                modelSettings.position.y,
                modelSettings.position.z
            );
            modelRef.current.rotation.set(
                modelSettings.rotation.x,
                modelSettings.rotation.y,
                modelSettings.rotation.z
            );
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={gltf.scene}
            scale={modelSettings.scale}
            position={[
                modelSettings.position.x,
                modelSettings.position.y,
                modelSettings.position.z,
            ]}
            rotation={[
                modelSettings.rotation.x,
                modelSettings.rotation.y,
                modelSettings.rotation.z,
            ]}
        />
    );
}

useGLTF.preload(
    "/models/CORE TIPPED POLO PINK_gltf_thick/CORE TIPPED POLO PINK_gltf_thick_optimized.gltf"
);