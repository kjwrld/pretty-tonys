import { useEffect, useRef } from 'react';
import { GUI } from 'lil-gui';
import * as THREE from 'three';

interface CentralizedGUIProps {
  // Light settings
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
  onLightChange: (settings: any) => void;

  // Camera settings
  cameraSettings: {
    basePosition: { x: number; y: number; z: number };
    sensitivity: { x: number; y: number };
    lerpFactor: number;
    lookAtTarget: { x: number; y: number; z: number };
    fov: number;
    enableMouseControl: boolean;
  };
  onCameraChange: (settings: any) => void;

  // Model settings
  modelSettings: {
    scale: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  };
  onModelChange: (settings: any) => void;

}

export default function CentralizedGUI({
  lightSettings,
  onLightChange,
  cameraSettings,
  onCameraChange,
  modelSettings,
  onModelChange
}: CentralizedGUIProps) {
  const guiRef = useRef<GUI | null>(null);

  useEffect(() => {
    // Create single GUI instance
    const gui = new GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '10px';
    gui.domElement.style.right = '10px';
    gui.domElement.style.zIndex = '1000';
    guiRef.current = gui;
    
    // Create a mutable reference object for GUI to work with
    const settings = {
      // Light settings
      pointLightIntensity: lightSettings.pointLight.intensity,
      pointLightX: lightSettings.pointLight.position[0],
      pointLightY: lightSettings.pointLight.position[1],
      pointLightZ: lightSettings.pointLight.position[2],
      pointLightColor: lightSettings.pointLight.color,
      ambientIntensity: lightSettings.ambientIntensity,
      directionalIntensity: lightSettings.directionalIntensity,
      backgroundColor: lightSettings.backgroundColor,
      
      // Camera settings
      basePositionX: cameraSettings.basePosition.x,
      basePositionY: cameraSettings.basePosition.y,
      basePositionZ: cameraSettings.basePosition.z,
      sensitivityX: cameraSettings.sensitivity.x,
      sensitivityY: cameraSettings.sensitivity.y,
      lookAtTargetX: cameraSettings.lookAtTarget.x,
      lookAtTargetY: cameraSettings.lookAtTarget.y,
      lookAtTargetZ: cameraSettings.lookAtTarget.z,
      lerpFactor: cameraSettings.lerpFactor,
      fov: cameraSettings.fov,
      enableMouseControl: cameraSettings.enableMouseControl,
      
      // Model settings
      modelScale: modelSettings.scale,
      modelPositionX: modelSettings.position.x,
      modelPositionY: modelSettings.position.y,
      modelPositionZ: modelSettings.position.z,
      modelRotationX: modelSettings.rotation.x,
      modelRotationY: modelSettings.rotation.y,
      modelRotationZ: modelSettings.rotation.z,
    };

    // === BACKGROUND CONTROLS ===
    const backgroundFolder = gui.addFolder('Background');
    
    backgroundFolder
      .addColor(settings, 'backgroundColor')
      .name('Background Color')
      .onChange((value: string) => {
        onLightChange({ ...lightSettings, backgroundColor: value });
        // Also update the canvas background color immediately
        document.body.style.backgroundColor = value;
      });

    backgroundFolder.open();

    // === CAMERA CONTROLS ===
    const cameraFolder = gui.addFolder('Camera');
    
    // Base Position
    const basePositionFolder = cameraFolder.addFolder('Base Position');
    basePositionFolder
      .add(cameraSettings.basePosition, 'x', -5, 5, 0.1)
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          basePosition: { ...cameraSettings.basePosition, x: value }
        });
      });
      
    basePositionFolder
      .add(cameraSettings.basePosition, 'y', -5, 5, 0.1)
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          basePosition: { ...cameraSettings.basePosition, y: value }
        });
      });
      
    basePositionFolder
      .add(cameraSettings.basePosition, 'z', 1, 10, 0.1)
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          basePosition: { ...cameraSettings.basePosition, z: value }
        });
      });

    // Mouse Sensitivity
    const sensitivityFolder = cameraFolder.addFolder('Mouse Sensitivity');
    sensitivityFolder
      .add(cameraSettings.sensitivity, 'x', 0, 2, 0.1)
      .name('X Sensitivity')
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          sensitivity: { ...cameraSettings.sensitivity, x: value }
        });
      });
      
    sensitivityFolder
      .add(cameraSettings.sensitivity, 'y', 0, 2, 0.1)
      .name('Y Sensitivity')
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          sensitivity: { ...cameraSettings.sensitivity, y: value }
        });
      });

    // Look At Target
    const lookAtFolder = cameraFolder.addFolder('Look At Target');
    lookAtFolder
      .add(cameraSettings.lookAtTarget, 'x', -2, 2, 0.1)
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          lookAtTarget: { ...cameraSettings.lookAtTarget, x: value }
        });
      });
      
    lookAtFolder
      .add(cameraSettings.lookAtTarget, 'y', -2, 2, 0.1)
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          lookAtTarget: { ...cameraSettings.lookAtTarget, y: value }
        });
      });
      
    lookAtFolder
      .add(cameraSettings.lookAtTarget, 'z', -2, 2, 0.1)
      .onChange((value: number) => {
        onCameraChange({
          ...cameraSettings,
          lookAtTarget: { ...cameraSettings.lookAtTarget, z: value }
        });
      });

    // Camera Settings
    cameraFolder
      .add(cameraSettings, 'lerpFactor', 0.01, 0.5, 0.01)
      .name('Smoothness')
      .onChange((value: number) => {
        onCameraChange({ ...cameraSettings, lerpFactor: value });
      });
      
    cameraFolder
      .add(cameraSettings, 'fov', 10, 120, 1)
      .name('Field of View')
      .onChange((value: number) => {
        onCameraChange({ ...cameraSettings, fov: value });
      });
      
    cameraFolder
      .add(cameraSettings, 'enableMouseControl')
      .name('Mouse Control')
      .onChange((value: boolean) => {
        onCameraChange({ ...cameraSettings, enableMouseControl: value });
      });

    cameraFolder.open();

    // === MODEL CONTROLS ===
    const modelFolder = gui.addFolder('Polo Model');
    
    modelFolder
      .add(modelSettings, 'scale', 0.01, 1.0, 0.001)
      .onChange((value: number) => {
        onModelChange({ ...modelSettings, scale: value });
      });

    // Position
    const positionFolder = modelFolder.addFolder('Position');
    positionFolder
      .add(modelSettings.position, 'x', -5, 5, 0.1)
      .onChange((value: number) => {
        onModelChange({
          ...modelSettings,
          position: { ...modelSettings.position, x: value }
        });
      });
      
    positionFolder
      .add(modelSettings.position, 'y', -5, 5, 0.1)
      .onChange((value: number) => {
        onModelChange({
          ...modelSettings,
          position: { ...modelSettings.position, y: value }
        });
      });
      
    positionFolder
      .add(modelSettings.position, 'z', -5, 5, 0.1)
      .onChange((value: number) => {
        onModelChange({
          ...modelSettings,
          position: { ...modelSettings.position, z: value }
        });
      });

    // Rotation
    const rotationFolder = modelFolder.addFolder('Rotation');
    rotationFolder
      .add(modelSettings.rotation, 'x', -Math.PI, Math.PI, 0.1)
      .onChange((value: number) => {
        onModelChange({
          ...modelSettings,
          rotation: { ...modelSettings.rotation, x: value }
        });
      });
      
    rotationFolder
      .add(modelSettings.rotation, 'y', -Math.PI, Math.PI, 0.1)
      .onChange((value: number) => {
        onModelChange({
          ...modelSettings,
          rotation: { ...modelSettings.rotation, y: value }
        });
      });
      
    rotationFolder
      .add(modelSettings.rotation, 'z', -Math.PI, Math.PI, 0.1)
      .onChange((value: number) => {
        onModelChange({
          ...modelSettings,
          rotation: { ...modelSettings.rotation, z: value }
        });
      });

    modelFolder.open();


    // Cleanup
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, []);

  return null;
}