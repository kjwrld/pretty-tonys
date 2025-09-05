# Texture Optimization Guide

## Current Texture Analysis
- All textures: 4096x4096 PNG
- Normal map: 24MB (biggest problem!)
- Diffuse: 7.6MB 
- Total texture size: ~32MB

## Optimization Strategies

### 1. **Resize Textures** (Immediate 75% reduction)
```bash
# Resize to 2048x2048 (usually sufficient for web)
# This alone will reduce size by ~75%

# Using online tools:
# - tinypng.com (PNG compression)
# - squoosh.app (Google's image optimizer)
# - imagecompressor.com
```

### 2. **Convert to WebP/AVIF** (50-80% reduction)
```javascript
// Three.js supports WebP since R150
// Update glTF to reference .webp files instead of .png
{
  "uri": "texture_diffuse.webp"  // instead of .png
}
```

### 3. **Use Basis Universal** (Best for 3D)
```bash
# Install basis_universal encoder
npm install -g basis_universal

# Convert textures to .basis format
basisu -file texture.png -output_file texture.basis
```

### 4. **Smart Channel Packing**
```
Normal maps: 
- Store only RG channels (reconstruct B = sqrt(1 - R² - G²))
- 50% size reduction for normal maps

Metallic/Roughness:
- Already packed efficiently (R=metallic, G=roughness)
```

### 5. **KTX2 with Three.js** (Industry Standard)
```javascript
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

// KTX2 provides:
// - GPU texture compression (ASTC, ETC, S3TC)
// - Mipmaps included
// - 70-90% size reduction
```

## Quick Win Solutions

### Option A: Manual Optimization (Immediate)
1. Go to https://squoosh.app
2. Upload each texture
3. Resize to 2048x2048
4. Convert to WebP (85% quality)
5. Expected result: ~32MB → ~6-8MB

### Option B: Node.js Script (Automated)
Install sharp: `npm install sharp`

```javascript
const sharp = require('sharp');

async function optimizeTextures() {
  const textures = [
    'CORE TIPPED POLO PINK_gltf_thick_diffuse_1001.png',
    'CORE TIPPED POLO PINK_gltf_thick_normal_1001.png',
    'CORE TIPPED POLO PINK_gltf_thick_metallicroughness_1001.png'
  ];
  
  for (const texture of textures) {
    await sharp(`public/models/CORE TIPPED POLO PINK_gltf_thick/${texture}`)
      .resize(2048, 2048)
      .webp({ quality: 85 })
      .toFile(`public/models/CORE TIPPED POLO PINK_gltf_thick/${texture.replace('.png', '.webp')}`);
  }
}
```

## Recommendation
**Start with Option A** (Squoosh.app) for immediate 75-80% size reduction:
1. Resize: 4096→2048 (-75% size)
2. WebP conversion (-50% additional)
3. Total reduction: ~85-90%
4. 32MB → 3-5MB textures

Would you like me to create the Node.js optimization script?