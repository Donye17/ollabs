# Ollabs - Avatar Frame Studio

**One sentence goal:** A precision web tool for creating perfectly aligned, aesthetic circular avatar frames for Apple Contact Posters and social media profiles.

Ollabs is a React-based web application that allows users to upload profile photos, apply custom circular frames (including gradients, neon, and shapes), and preview how they look across various platforms like iOS Contacts, Instagram, and WhatsApp.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Advanced Frame Editor**: 
  - Drag, drop, zoom, and **rotate** functionality.
  - "Fit to Frame" auto-scaling.
  - High-resolution (1024x1024) export.
- **Customizable Frames**:
  - 10+ Presets including Gradients, Neon, and Geometric shapes.
  - Custom width and color controls (Solid, Dashed, Double, Memphis).
  - HEX color input and visual color pickers.
  - Shape support: Star, Heart, Hexagon.
- **Live Previews**:
  - **Apple**: iOS Contact Poster & List View.
  - **Social**: Instagram, X (Twitter), LinkedIn.
  - **Chat**: WhatsApp, Telegram, Slack.
- **Privacy First**: All image processing happens locally in the browser via HTML5 Canvas.

## Tech Stack

- **Language**: TypeScript
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build/Runtime**: ESBuild / Vite (implied by file structure)

## Setup & Running Locally

Since this project uses ESM imports via `index.html` (no-build setup compatible), you can run it with any static file server.

### Prerequisites
- Node.js (v18+)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ollabs.git
   cd ollabs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` (or your specific local port).

## Project Structure

```
ollabs/
├── components/          # React Components
│   ├── ContactPreview.tsx # Social media preview tabs
│   ├── Editor.tsx         # Canvas logic, drag/drop, rotation
│   ├── FrameCustomizer.tsx# Controls for colors, width, styles
│   └── FrameSelector.tsx  # Preset grid selection
├── App.tsx              # Main application layout and state
├── constants.ts         # Configuration constants and presets
├── types.ts             # TypeScript interfaces
├── index.html           # Entry point
├── index.tsx            # React root mount
└── metadata.json        # Project metadata
```

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.
