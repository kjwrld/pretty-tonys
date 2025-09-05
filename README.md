# 3D Clothing Website

A modern 3D clothing visualization platform built with React Three Fiber, featuring custom cloth simulations and shader animations.

## 🚀 Features

- **3D Clothing Models**: Interactive 3D clothing visualization with realistic rendering
- **Cloth Simulations**: Custom physics-based cloth simulation system
- **Shader Animations**: Advanced GLSL shaders for dynamic material effects
- **Real-time Interaction**: Mouse/touch controls for model manipulation
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Rendering**: React Three Fiber (@react-three/fiber)
- **3D Utilities**: React Three Drei (@react-three/drei)
- **3D Engine**: Three.js
- **Backend**: Supabase
- **Styling**: CSS3 + Custom Shaders

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd 3d-clothing-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 Usage

The application loads with a 3D polo shirt model centered on screen. Users can:

- **Rotate**: Click and drag to rotate the model
- **Zoom**: Scroll wheel or pinch to zoom in/out  
- **Pan**: Right-click and drag to pan the view

## 🎨 3D Assets

- Place your 3D models in the `/public/models/` directory
- Supported formats: GLB, GLTF
- The polo model is automatically loaded and centered on startup

## 🧪 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Scene.tsx       # Main 3D scene
│   └── models/         # 3D model components
├── lib/                # Utilities and configs
│   └── supabase.ts    # Supabase client setup
├── shaders/            # Custom GLSL shaders
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## 🔮 Roadmap

- [ ] Advanced cloth physics simulation
- [ ] Material editor with real-time preview
- [ ] Custom shader library expansion
- [ ] User authentication and saved configurations
- [ ] Shopping cart and e-commerce integration
- [ ] AR/VR support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for the amazing 3D engine
- React Three Fiber team for the React integration
- Supabase for the backend infrastructure
