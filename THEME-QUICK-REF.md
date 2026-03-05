# Starry Night Theme - Quick Reference

## 🎨 Color Palette

```css
/* Primary Colors */
--night-sky: #0f172a      /* slate-900 */
--midnight-blue: #1e3a8a   /* blue-900 */
--deep-indigo: #312e81     /* indigo-900 */
--golden-star: #fbbf24     /* amber-400 */
--soft-gold: #fcd34d       /* amber-300 */
--violet-accent: #7c3aed   /* violet-600 */

/* Text Colors */
--gold-text: #fef3c7       /* amber-100 */
--gold-light: #fde68a      /* amber-200 */
--gold-dark: #f59e0b       /* amber-500 */
```

## ⭐ Star Icon SVG

```html
<!-- 5-point star -->
<svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
</svg>
```

## 🎭 Common Classes

### Backgrounds
```html
<!-- Main background -->
class="bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900"

<!-- Card background -->
class="bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md"

<!-- Overlay -->
class="bg-slate-800/30 backdrop-blur-sm"
```

### Text
```html
<!-- Gradient heading -->
class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400"

<!-- Body text -->
class="text-amber-100"

<!-- Secondary text -->
class="text-amber-200/80"
```

### Buttons
```html
<!-- Primary button (gold) -->
class="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-amber-500/50"

<!-- Secondary button (glass) -->
class="bg-slate-800/50 backdrop-blur-md text-amber-100 border border-amber-400/30"
```

### Borders & Shadows
```html
<!-- Border -->
class="border border-amber-400/30"

<!-- Shadow with glow -->
class="shadow-lg shadow-amber-500/50"

<!-- Hover shadow -->
class="hover:shadow-xl hover:shadow-amber-500/60"
```

## 🌟 Quick Copy-Paste Components

### Star Decoration
```vue
<svg class="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
</svg>
```

### Elegant Card
```vue
<div class="bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-8">
    <!-- Your content -->
</div>
```

### Golden Button
```vue
<button class="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-full font-semibold hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/50">
    Button Text
</button>
```

## 📋 Theme Checklist

- [x] Night sky gradient background
- [x] Animated twinkling stars
- [x] Shooting star animations
- [x] Golden star icons
- [x] Amber/gold color scheme
- [x] Glass-morphism effects
- [x] Elegant serif typography
- [x] Gradient text headings
- [x] Golden glow shadows
- [x] Consistent theming

## 🎯 Design Rules

1. **Always use stars** (not hearts) for decorative icons
2. **Dark backgrounds** (slate-900, blue-900, indigo-900)
3. **Golden accents** (amber-400 primary, amber-200/300/500 variations)
4. **Glass effects** (backdrop-blur-md with transparency)
5. **Gradient text** for main headings
6. **Serif fonts** for elegance
7. **Hover animations** with golden glow
8. **Star bullet points** in lists

---

**Quick tip**: All theme colors are centralized in `config/wedding.php`!
