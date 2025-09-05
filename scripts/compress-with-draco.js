import fs from 'fs/promises';
import path from 'path';
import { DRACOExporter } from 'three-stdlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

const INPUT_PATH = './public/models/CORE TIPPED POLO PINK_gltf_thick/CORE TIPPED POLO PINK_gltf_thick_optimized.gltf';
const OUTPUT_DIR = './public/models/CORE TIPPED POLO PINK_gltf_thick/';

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return (stats.size / 1024 / 1024).toFixed(2);
  } catch (error) {
    return 0;
  }
}

async function compressWithDraco() {
  console.log('🚀 Starting Draco compression...');
  
  try {
    // Load the original glTF file
    console.log('📂 Loading original glTF file...');
    const loader = new GLTFLoader();
    const gltf = await new Promise((resolve, reject) => {
      loader.load(INPUT_PATH, resolve, undefined, reject);
    });
    
    console.log('✅ glTF file loaded successfully');
    console.log(`📊 Scene has ${gltf.scene.children.length} children`);
    
    // Set up Draco exporter
    const dracoExporter = new DRACOExporter();
    
    // Get original binary size
    const originalBinPath = INPUT_PATH.replace('.gltf', '.bin');
    const originalSize = await getFileSize(originalBinPath);
    console.log(`📏 Original binary size: ${originalSize}MB`);
    
    // Extract geometry from the scene
    const geometries = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        geometries.push(child.geometry);
      }
    });
    
    console.log(`🔍 Found ${geometries.length} geometries to compress`);
    
    if (geometries.length === 0) {
      console.warn('⚠️ No geometries found in the model');
      return;
    }
    
    // Compress each geometry with Draco
    let totalCompressedSize = 0;
    
    for (let i = 0; i < geometries.length; i++) {
      const geometry = geometries[i];
      console.log(`🔄 Compressing geometry ${i + 1}/${geometries.length}...`);
      
      try {
        const compressed = dracoExporter.parse(geometry, {
          decodeSpeed: 5,
          encodeSpeed: 5,
          encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
          quantization: [14, 12, 12, 12, 10] // position, normal, color, tex, generic
        });
        
        // Save compressed geometry
        const outputPath = path.join(OUTPUT_DIR, `draco_geometry_${i}.drc`);
        await fs.writeFile(outputPath, Buffer.from(compressed));
        
        const compressedSize = await getFileSize(outputPath);
        totalCompressedSize += parseFloat(compressedSize);
        
        console.log(`   ✅ Geometry ${i + 1}: ${compressedSize}MB`);
      } catch (error) {
        console.error(`   ❌ Failed to compress geometry ${i + 1}:`, error.message);
      }
    }
    
    // Create a new glTF with Draco extension
    const dracoGltf = {
      ...gltf.scene.toJSON(),
      extensionsUsed: ['KHR_draco_mesh_compression'],
      extensionsRequired: ['KHR_draco_mesh_compression']
    };
    
    // Save the Draco-compressed glTF
    const outputGltfPath = INPUT_PATH.replace('_optimized.gltf', '_draco.gltf');
    await fs.writeFile(outputGltfPath, JSON.stringify(dracoGltf, null, 2));
    
    const compressionRatio = ((originalSize - totalCompressedSize) / originalSize * 100).toFixed(1);
    
    console.log('\\n📊 DRACO COMPRESSION SUMMARY:');
    console.log(`   Original size: ${originalSize}MB`);
    console.log(`   Compressed size: ${totalCompressedSize.toFixed(2)}MB`);
    console.log(`   Compression ratio: ${compressionRatio}%`);
    console.log(`   Space saved: ${(originalSize - totalCompressedSize).toFixed(2)}MB`);
    
    console.log('\\n✨ Draco compression complete!');
    console.log('👉 Update your model path to use the _draco.gltf file for testing');
    
  } catch (error) {
    console.error('❌ Draco compression failed:', error);
  }
}

// Alternative: Use gltf-pipeline CLI tool (more reliable)
async function useGltfPipeline() {
  console.log('\\n🔧 Alternative: Using gltf-pipeline CLI tool');
  console.log('📝 Run these commands manually for reliable Draco compression:');
  console.log('');
  console.log('npm install -g gltf-pipeline');
  console.log(`gltf-pipeline -i "${INPUT_PATH}" -o "${INPUT_PATH.replace('_optimized.gltf', '_draco.gltf')}" --draco.compressionLevel=7`);
  console.log('');
  console.log('This will create a properly Draco-compressed glTF file.');
}

// Run compression
console.log('🚀 Draco Compression Tool');
console.log('========================\\n');

compressWithDraco().catch(() => {
  console.log('\\n⚠️ Three.js Draco export had issues. Showing CLI alternative:');
  useGltfPipeline();
});