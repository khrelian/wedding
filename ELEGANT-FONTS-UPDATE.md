# Elegant Fonts Update 🎨✨

Your wedding website fonts have been updated to elegant, sophisticated typography!

## Google Fonts Added

### 1. **Playfair Display** (Display & Headings)
- Usage: Main headings, hero text, display text
- Style: Classic, elegant serif
- Weights: 400, 500, 600, 700, 800, 900
- Perfect for: Large wedding titles, "We're Getting Married!"

### 2. **Cormorant Garamond** (Elegant Serif)
- Usage: Secondary headings, elegant text
- Style: Refined, sophisticated serif
- Weights: 300, 400, 500, 600, 700
- Perfect for: Story sections, formal text, dates

### 3. **Montserrat** (Clean Sans-Serif)
- Usage: Body text, buttons, navigation
- Style: Modern, clean, readable
- Weights: 200, 300, 400, 500, 600
- Perfect for: General content, forms, UI elements

## Font Classes Available

Use these Tailwind CSS classes in your Vue files:

```css
font-serif      → Playfair Display (primary serif)
font-display    → Playfair Display (for large headings)
font-elegant    → Cormorant Garamond (refined serif)
font-sans       → Montserrat (clean sans-serif)
```

## Where to Use Each Font

### `font-display` (Playfair Display)
- Main page heading: "We're Getting Married!"
- Hero section titles
- Large, impactful headings
- "Save the Date" heading

### `font-elegant` (Cormorant Garamond)
- "Our Love Story" section
- Romantic quotes
- Event card headings
- Formal announcements
- Dates and venue names

### `font-sans` (Montserrat)
- Body paragraphs
- Form labels and inputs
- Button text
- Navigation menus
- Table content
- Admin dashboard

## Implementation Details

### Files Updated

1. **`resources/views/app.blade.php`**
   - Added Google Fonts preconnect
   - Loaded all three font families with multiple weights

2. **`tailwind.config.js`**
   - Extended fontFamily theme
   - Added custom font classes
   - Set up font stacks with fallbacks

3. **`package.json`**
   - Updated @vitejs/plugin-vue to v6.0.0 for Vite 7 compatibility

## Font Pairings

The three fonts work beautifully together:

```
HEADING (Playfair Display)
    ↓
Subheading (Cormorant Garamond)
    ↓
Body text content in clean, readable Montserrat
```

## Examples

### Hero Section
```vue
<h1 class="font-display text-8xl">
  We're Getting Married!
</h1>
<h2 class="font-elegant text-4xl">
  Ian Jay Broñola & Karen Kate Seronay
</h2>
<p class="font-sans text-lg">
  Join us for our special day
</p>
```

### Love Story
```vue
<h2 class="font-display text-6xl">
  Our Love Story
</h2>
<p class="font-elegant text-2xl italic">
  Like celestial bodies guided by an invisible force...
</p>
<p class="font-sans text-base">
  Supporting details and story content...
</p>
```

## Typography Scale

Recommended font sizes for each typeface:

**Playfair Display** (font-display):
- Hero: `text-8xl` (96px)
- Main headings: `text-6xl` (60px)
- Large titles: `text-5xl` (48px)

**Cormorant Garamond** (font-elegant):
- Section headings: `text-4xl` (36px)
- Subheadings: `text-3xl` (30px)
- Quotes: `text-2xl` (24px)

**Montserrat** (font-sans):
- Body: `text-base` (16px)
- Small text: `text-sm` (14px)
- Captions: `text-xs` (12px)

## Font Weights

### Playfair Display
- Regular (400): Standard headings
- Medium (500): Emphasized headings
- SemiBold (600): Strong headings
- Bold (700-900): Hero text, major titles

### Cormorant Garamond
- Light (300): Elegant, refined text
- Regular (400): Standard elegant text
- Medium (500): Slightly emphasized
- SemiBold (600-700): Strong elegant text

### Montserrat
- ExtraLight (200): Delicate text
- Light (300): Body text
- Regular (400): Standard text
- Medium (500): Emphasized text
- SemiBold (600): Buttons, labels

## Best Practices

1. **Hierarchy**: Use Playfair for main titles, Cormorant for subtitles, Montserrat for body
2. **Contrast**: Mix serif (elegant) with sans-serif (clean) for visual interest
3. **Readability**: Use Montserrat for long-form content and forms
4. **Impact**: Use Playfair Display for wow moments
5. **Romance**: Use Cormorant Garamond for love story and quotes

## Color Combinations

Your elegant fonts pair perfectly with the starry night theme:

```css
/* Golden elegant text */
class="font-elegant text-amber-200"

/* White display heading */
class="font-display text-white"

/* Light body text */
class="font-sans text-amber-50"
```

## Starry Night Theme + Elegant Fonts = Perfect! ✨

The combination of:
- 🌟 Elegant serif fonts (Playfair & Cormorant)
- ✨ Clean sans-serif (Montserrat)
- 🎨 Golden amber colors
- 💫 Deep blue night sky background
- ⭐ Star animations

...creates a sophisticated, memorable wedding website!

## View Your Elegant Fonts

Start your development server:

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

Visit **http://localhost** to see your beautiful new typography!

## Technical Notes

- All fonts loaded from Google Fonts CDN
- Fonts are preconnected for faster loading
- Multiple weights loaded for design flexibility
- Fallback fonts configured in Tailwind
- Font swap enabled for optimal performance

---

**Your wedding website now has elegant, professional typography that perfectly matches your starry night theme!** 🎨✨💑
