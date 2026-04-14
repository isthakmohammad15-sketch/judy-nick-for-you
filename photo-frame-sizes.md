# Photo Frame Sizes

## Slide3Gallery.tsx (all 8 frames identical)
- **Container**: `aspect-[4/3]` (4:3 ratio)
- **Style**: `rounded-lg overflow-hidden`
- **Image/Video**: `w-full h-full object-cover`
- **Padding frame**: `p-1.5`
- **Layout**: `grid grid-cols-3 gap-5 md:gap-8`

**Frame 8 (bottom-right)**: Uses `<video>` element for memory 8.mp4 with `muted loop playsInline preload="metadata"` autoplay on reveal.

**No photo frames in other slides.**
