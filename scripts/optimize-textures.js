import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const TEXTURES_DIR = './public/models/CORE TIPPED POLO PINK_gltf_thick/';
const OUTPUT_SIZE = 2048; // Resize to 2048x2048
const WEBP_QUALITY = 85;

const textureFiles = [
  'CORE TIPPED POLO PINK_gltf_thick_diffuse_1001.png',
  'CORE TIPPED POLO PINK_gltf_thick_normal_1001.png', 
  'CORE TIPPED POLO PINK_gltf_thick_metallicroughness_1001.png',
  'CORE TIPPED POLO PINK_gltf_thick_displacement_1001.png'
];

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return (stats.size / 1024 / 1024).toFixed(2); // MB
  } catch (error) {
    return 0;
  }
}

async function optimizeTexture(filename) {
  const inputPath = path.join(TEXTURES_DIR, filename);
  const outputPath = path.join(TEXTURES_DIR, filename.replace('.png', '_optimized.webp'));
  
  console.log(`🔄 Optimizing ${filename}...`);
  
  try {
    const originalSize = await getFileSize(inputPath);
    console.log(`   Original size: ${originalSize}MB`);
    
    // Optimize the texture
    await sharp(inputPath)
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover'
      })
      .webp({ 
        quality: filename.includes('normal') ? 95 : WEBP_QUALITY, // Higher quality for normal maps
        effort: 6 // Max compression effort
      })
      .toFile(outputPath);
    
    const optimizedSize = await getFileSize(outputPath);
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ Optimized size: ${optimizedSize}MB (-${reduction}%)`);
    console.log(`   📁 Saved as: ${path.basename(outputPath)}`);
    
    return {
      original: originalSize,
      optimized: optimizedSize,
      reduction: reduction
    };
  } catch (error) {
    console.error(`   ❌ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function updateGltfReferences() {
  const gltfPath = path.join(TEXTURES_DIR, 'CORE TIPPED POLO PINK_gltf_thick.gltf');
  
  try {
    const gltfContent = await fs.readFile(gltfPath, 'utf8');
    let updatedContent = gltfContent;
    
    // Update image URIs to point to optimized WebP files
    textureFiles.forEach(filename => {
      const originalUri = filename;
      const optimizedUri = filename.replace('.png', '_optimized.webp');
      updatedContent = updatedContent.replace(originalUri, optimizedUri);
    });
    
    // Save updated glTF
    const backupPath = gltfPath.replace('.gltf', '_backup.gltf');
    await fs.copyFile(gltfPath, backupPath);
    await fs.writeFile(gltfPath.replace('.gltf', '_optimized.gltf'), updatedContent);
    
    console.log('📝 Created optimized glTF file with WebP references');
    console.log('📄 Original glTF backed up');
  } catch (error) {
    console.error('❌ Error updating glTF:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting texture optimization...');
  console.log(`📏 Target size: ${OUTPUT_SIZE}x${OUTPUT_SIZE}`);
  console.log(`🎨 WebP quality: ${WEBP_QUALITY}%\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const filename of textureFiles) {
    const result = await optimizeTexture(filename);
    if (result) {
      totalOriginal += parseFloat(result.original);
      totalOptimized += parseFloat(result.optimized);
    }
    console.log(''); // Add spacing
  }
  
  const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
  
  console.log('📊 OPTIMIZATION SUMMARY:');
  console.log(`   Original total: ${totalOriginal.toFixed(2)}MB`);
  console.log(`   Optimized total: ${totalOptimized.toFixed(2)}MB`);
  console.log(`   Total reduction: ${totalReduction}%`);
  console.log(`   Space saved: ${(totalOriginal - totalOptimized).toFixed(2)}MB\n`);
  
  await updateGltfReferences();
  
  console.log('✨ Optimization complete!');
  console.log('👉 Update your PoloModel.tsx to use the _optimized.gltf file');
}

// Run the optimization
main().catch(console.error);