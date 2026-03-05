# Names & Font Update ✨

Updated your wedding website with simplified names and elegant script font!

## ✅ Changes Made

### 1. Fixed "G" Being Cut Off
- Reduced heading sizes slightly for better fit
- Changed from `text-8xl` to `text-7xl` (still very large!)
- Added `tracking-wide` for better letter spacing
- Changed `leading-tight` to `leading-relaxed` for more breathing room
- Adjusted padding to `px-4` for consistent spacing

### 2. Simplified Names
**Old**: Ian Jay Broñola & Karen Kate Seronay  
**New**: **Ian Jay & Karen Kate**

This makes the names:
- ✨ More focused and elegant
- 💑 Personal and intimate
- 📱 Better for mobile displays
- 🎨 Easier to style beautifully

### 3. Added Beautiful Script Font

**Great Vibes** - An elegant, flowing script font perfect for wedding names!

```
Ian Jay & Karen Kate
```

The script font:
- 🌟 Romantic and sophisticated
- 💫 Flowing, handwritten style
- ✨ Makes names stand out as special
- 💍 Perfect for wedding aesthetics

## Font Classes Available

You now have 4 beautiful fonts:

| Class | Font | Best For |
|-------|------|----------|
| `font-display` | Playfair Display | Main headings ("We're Getting Married!") |
| `font-script` | Great Vibes | Your names (romantic script) |
| `font-elegant` | Cormorant Garamond | Elegant text, quotes, dates |
| `font-sans` | Montserrat | Body text, buttons, forms |

## Typography Hierarchy

```
We're Getting Married!
    ↓ (font-display, large, bold)

Ian Jay & Karen Kate
    ↓ (font-script, extra large, flowing)

July 17, 2026
    ↓ (font-display, medium)

Butuan City Cathedral
    ↓ (font-elegant, smaller)
```

## Where Names Appear

1. **Hero Section**: Large script font - `Ian Jay & Karen Kate`
2. **Love Story Section**: Display font at the bottom with stars
3. **Configuration**: Updated in `config/wedding.php`

## Script Font Details

**Great Vibes** characteristics:
- Cursive, handwritten style
- Elegant swashes and flourishes
- Connects letters beautifully
- High contrast between thick and thin strokes
- Perfect for romantic occasions

## Size Adjustments

### "We're Getting Married!"
- Mobile: `text-4xl` (36px)
- Small: `text-5xl` (48px)
- Medium: `text-6xl` (60px)
- Large: `text-7xl` (72px)

### "Ian Jay & Karen Kate"
- Mobile: `text-4xl` (36px)
- Small: `text-5xl` (48px)
- Medium: `text-6xl` (60px)
- Large: `text-7xl` (72px)

Both headings now have similar importance visually!

## Color & Effects

### Main Heading
- Gradient: Amber-200 → Amber-100 → Amber-300
- Effect: Text gradient with drop shadow
- Font weight: Bold

### Names (Script)
- Color: Amber-50 (soft white-gold)
- Effect: Drop shadow for elegance
- Font weight: Normal (script fonts look best at regular weight)

## Benefits of Script Font for Names

1. **Visual Hierarchy**: Names stand out separately from the heading
2. **Romance**: Script fonts convey love and elegance
3. **Focus**: Draws attention to who's getting married
4. **Sophistication**: Adds a touch of class and formality
5. **Memorability**: Unique styling makes it memorable

## Example Usage

If you want to use the script font elsewhere:

```vue
<p class="font-script text-5xl text-amber-50">
    Ian Jay & Karen Kate
</p>
```

## Comparison: Before & After

### Before
```
WE'RE GETTING MARRIED!
(Playfair Display, huge)

Ian Jay Broñola & Karen Kate Seronay
(Cormorant Garamond, medium)
```

### After
```
We're Getting Married!
(Playfair Display, large)

Ian Jay & Karen Kate
(Great Vibes script, large, flowing)
```

## Technical Details

### Files Updated

1. **`resources/views/app.blade.php`**
   - Added Great Vibes font from Google Fonts

2. **`tailwind.config.js`**
   - Added `font-script: ['Great Vibes', 'cursive']`

3. **`resources/js/Pages/Welcome.vue`**
   - Updated names to first names only
   - Applied script font to names
   - Fixed heading sizes to prevent cutoff
   - Adjusted spacing and tracking

### Google Fonts Loaded

```html
Playfair Display (400, 500, 600, 700, 800, 900)
Cormorant Garamond (300, 400, 500, 600, 700)
Montserrat (200, 300, 400, 500, 600)
Great Vibes (400) ← NEW!
```

## Design Philosophy

The combination creates perfect visual hierarchy:

1. **Attention** - "We're Getting Married!" (Display serif, bold)
2. **Focus** - "Ian Jay & Karen Kate" (Script, romantic)
3. **Details** - Date, venue, etc. (Elegant serif/sans)

This follows classic wedding invitation design principles!

## Responsive Behavior

All text scales beautifully:
- **Mobile**: Readable sizes, no cutoff
- **Tablet**: Larger, elegant presence
- **Desktop**: Full impact with perfect spacing

## View Your Updates

Your changes are already live with the dev server!

Visit **http://localhost** to see:
- ✨ "G" no longer cut off
- 💑 Beautiful "Ian Jay & Karen Kate" in script font
- 🎨 Perfect hierarchy and spacing
- 🌟 Elegant, romantic design

---

**Your wedding website now has a perfect balance of elegance, romance, and readability!** 💍✨
