# GarmentDraftAI ✂️  
Open-source Tailoring Drafting App for Dawoodi Bohra Garments

GarmentDraftAI is a React Native (Expo + TypeScript) application that converts
traditional tailor paper-drafting methods into accurate, printable SVG garment
patterns using body measurements.

> The goal is to preserve traditional drafting knowledge while removing manual
> errors through geometry-based software.

---

## 🎯 Purpose

This project aims to:
- Digitize tailor paper drafting methods
- Generate accurate, ready-to-cut patterns
- Ensure consistent results across tailors
- Reduce dependence on expensive paid pattern software

**Target:** An open-source alternative for garment drafting.

---

## 📋 Garments Supported (In Progress)

1. **Kurta** – Men’s tunic  
2. **Izar** – Loose trousers / pyjama  
3. **Jhabla** – Baby girls’ dress  
4. **Pehran** – Overgarment  
5. **Rida** – Women’s outer garment  

---

## 🧭 Project Maturity

This project is in **early active development**.

Core functionality is implemented, but:
- Draft accuracy
- Scaling
- Print calibration  

still require validation by tailoring and geometry experts.

This is my **first software project**, and guidance is very welcome.

---

## 🏗 Architecture Overview

```

Measurements
↓
Input Screen
↓
Draft Logic (geometry + formulas)
↓
SVG generation
↓
WebView Preview
↓
Save / Export (PDF – WIP)

```

### Folder Structure
```

src/features/[garment]/
├── screens/
│   ├── [Garment]DraftInput.tsx    # Measurement form
│   ├── [Garment]DraftPreview.tsx  # SVG preview
│   └── [Garment]Menu.tsx
├── logic/
│   └── [Garment]Logic.ts          # Draft calculations
└── svg/
└── [Garment]SVG.ts            # SVG plotting

```

---

## 🧠 Data Flow (Izar Example)

```

IzarDraftInput
→ { waist, hip, length, mori, crotch } (numbers)
→ plotIzarDraftSVG(measurements)
→ SVG string
→ WebView preview with labels
→ Save draft (AsyncStorage)
→ Export to PDF (planned)

```

---

## ✅ What’s Working

- Measurement input screens (8+ fields per garment)
- TypeScript throughout (DraftData, Measurement types)
- SVG preview rendering
- Izar geometric drafting logic
- Draft saving to local storage
- Navigation flow
- Measurement validation

---

## 🚧 What Needs Work

- SVG geometry calibration vs real paper drafts
- Pinch-zoom & scaling in WebView
- SVG → PDF export (print-accurate)
- Formula validation for all garments
- 100% print scale accuracy testing

---

## 📐 Drafting Method (Izar – Example)

```

Coordinate system: (0,0) top-left

W  = hip / 4 + 3"
Xc = hip / 4 + 1"

Points:
A(0,0), B(0,L), C(W,0), D(W,L)
E(0,C), F(W,C), G(W+Xc,C)

Crotch curve: Quadratic Bézier F → G
Mori: measured at hem line

```

---

## 🛠 Tech Stack

- React Native (Expo)
- TypeScript
- SVG rendering
- Geometry-based drafting logic

---

## 🆘 Help Needed (Very Welcome)

### Tailors / Pattern Makers
- Validate SVG drafts vs paper drafts
- Confirm exact drafting formulas (inch math)
- Test print accuracy at 100% scale

### React Native Developers
- Implement WebView pinch-zoom
- SVG → PNG → PDF export pipeline
- Print scaling calibration

### SVG / Geometry Experts
- Bézier curves for crotch & armholes
- Coordinate scaling consistency
- Pattern mirroring (left/right)

Even advice or conceptual guidance is appreciated.

---
## 🌱 Beginner Note

This is my **first software project**.

I am actively learning and building in public, and I’m looking for
**guidance, feedback, and mentorship** from experienced developers,
tailors, and drafting experts.

Corrections, suggestions, and best-practice advice are genuinely appreciated.

## 🧪 Testing a Garment

```

npx expo start
Garments → Izar → New Draft
hip=40", length=38", mori=15", crotch=12"
Compare SVG preview with paper draft
Print at 100% and measure with ruler

```

---

## 🚀 Quick Start for Contributors

```

git clone <repo-url>
npm install
npx expo start

```

> `node_modules` and build files are intentionally ignored.

---

## 📈 Roadmap

```

Phase 1 ✅ Core flow (input → SVG preview)
Phase 2 🚧 Draft accuracy & calibration
Phase 3 ⏳ PDF export & print readiness
Phase 4 ⏳ Multi-language & measurement database

```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Focus on **one garment or one feature**
4. Test with real measurements
5. Open a Pull Request or Issue

---

## 🌱 Vision

To bridge traditional tailoring knowledge and modern software,
making accurate drafting accessible, consistent, and affordable.

