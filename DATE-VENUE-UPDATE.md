# Wedding Date & Venue Updated! 📅⛪

Your wedding website now displays the official date and venue!

## 📅 Wedding Date

**July 17, 2026**

### Time Details (in config)
- **Ceremony**: 3:00 PM (configurable)
- **Reception**: 6:00 PM (configurable)
- **Timezone**: Asia/Manila

## ⛪ Venue

### Ceremony
**Butuan City Cathedral**
- Address: Montilla Boulevard
- City: Butuan City
- Province: Agusan del Norte
- Postal Code: 8600
- Country: Philippines

### Reception
**To be announced**
- Will follow the ceremony
- Venue details to be added later

## ✨ What Was Updated

### Welcome Page (`resources/js/Pages/Welcome.vue`)

**Save the Date Card:**
```
Save the Date
★ July 17, 2026 ★
Butuan City Cathedral
Under the Starry Sky
```

**Ceremony Card:**
```
⭐ Ceremony
July 17, 2026
Butuan City Cathedral
Time to be announced
```

**Reception Card:**
```
⭐ Reception
July 17, 2026
Venue to be announced
Following the ceremony
```

### Configuration File (`config/wedding.php`)

Updated with complete details:
- Wedding date: July 17, 2026
- Ceremony time: 3:00 PM (adjustable)
- Reception time: 6:00 PM (adjustable)
- Timezone: Asia/Manila
- Venue: Butuan City Cathedral
- Location: Butuan City, Agusan del Norte

## 📝 Next Steps

### 1. Update Ceremony Time
When you know the exact ceremony time, update in `config/wedding.php`:

```php
'date' => [
    'ceremony' => '2026-07-17 15:00:00', // Change 15:00:00 to actual time
    'reception' => '2026-07-17 18:00:00', // Adjust reception time
    'timezone' => 'Asia/Manila',
],
```

### 2. Update Reception Venue
When you have the reception venue, update in `config/wedding.php`:

```php
'reception' => [
    'name' => 'Your Reception Venue Name',
    'address' => 'Complete Address',
    'city' => 'Butuan City',
    // ... other details
],
```

Then update `Welcome.vue` to show the venue name.

### 3. Add Google Maps Link
Get the Google Maps link for the cathedral:

1. Go to Google Maps
2. Search for "Butuan City Cathedral"
3. Click "Share" → "Embed a map" or copy the URL
4. Add to `config/wedding.php`:

```php
'google_maps_url' => 'https://goo.gl/maps/YOUR_MAP_LINK',
```

### 4. Add Map Section (Optional)
Create a new section in `Welcome.vue` to display the map:

```vue
<div class="py-20 px-6 bg-gradient-to-b from-indigo-950 to-slate-900">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-serif text-center text-amber-200 mb-12">
            Location
        </h2>
        <iframe 
            src="YOUR_GOOGLE_MAPS_EMBED_URL"
            class="w-full h-96 rounded-lg border border-amber-400/30"
            loading="lazy"
        ></iframe>
    </div>
</div>
```

## 🎯 Current Display

When visitors view your website, they'll see:

### Hero Section
```
★ ⭐ ★

We're Getting Married!

Your Name & Partner's Name

━━━━━━━━━━━━━━━━━━
★ Save the Date ★
July 17, 2026
Butuan City Cathedral
Under the Starry Sky
━━━━━━━━━━━━━━━━━━

[RSVP Now] [Our Story] [Event Details]
```

### Event Details Section
```
★ Ceremony                    ★ Reception
July 17, 2026                July 17, 2026
Butuan City Cathedral        Venue to be announced
Time to be announced         Following the ceremony
```

## 📱 Mobile Display

All date and venue information is fully responsive and displays beautifully on mobile devices with the elegant starry night theme.

## 🔄 Making Changes

### To Change the Date
1. Edit `resources/js/Pages/Welcome.vue`
2. Find "July 17, 2026" (appears 3 times)
3. Replace with your new date
4. Run `npm run build` or `sail npm run build`

### To Change the Venue
1. Edit `resources/js/Pages/Welcome.vue`
2. Find "Butuan City Cathedral"
3. Replace with new venue name
4. Run `npm run build` or `sail npm run build`

### To Update Configuration
1. Edit `config/wedding.php`
2. Update the date and venue details
3. These can be used programmatically in future features

## 🌟 Suggested Enhancements

### 1. Countdown Timer
Add a countdown to July 17, 2026:

```vue
<script setup>
import { ref, onMounted } from 'vue';

const daysUntil = ref(0);

onMounted(() => {
    const weddingDate = new Date('2026-07-17');
    const today = new Date();
    const diff = weddingDate - today;
    daysUntil.value = Math.ceil(diff / (1000 * 60 * 60 * 24));
});
</script>

<template>
    <div class="text-amber-300 text-lg">
        {{ daysUntil }} days until our special day!
    </div>
</template>
```

### 2. Calendar Download
Add "Add to Calendar" buttons for:
- Google Calendar
- Apple Calendar
- Outlook

### 3. Directions Link
Add a button to get directions:

```vue
<a 
    href="https://maps.google.com/?q=Butuan+City+Cathedral"
    target="_blank"
    class="text-amber-400 hover:text-amber-300"
>
    Get Directions →
</a>
```

## ✅ Verification

To verify your updates:

1. **Start your development server:**
   ```bash
   ./vendor/bin/sail up -d
   ./vendor/bin/sail npm run dev
   ```

2. **Visit your site:**
   ```
   http://localhost
   ```

3. **Check these sections:**
   - [ ] Save the Date card shows "July 17, 2026"
   - [ ] Save the Date card shows "Butuan City Cathedral"
   - [ ] Ceremony card shows correct date
   - [ ] Ceremony card shows "Butuan City Cathedral"
   - [ ] Reception card shows correct date
   - [ ] Starry night theme is intact

## 📍 Butuan City Cathedral Details

**Official Name:** San Joseph Cathedral (Butuan City Cathedral)  
**Location:** Montilla Boulevard, Butuan City  
**Known For:** Historic cathedral, beautiful architecture  
**Capacity:** Check with cathedral office  
**Booking:** Contact the parish office for booking details  

## 📞 Next Actions

1. **Confirm ceremony time** with the cathedral
2. **Book reception venue** in Butuan City
3. **Get directions link** for Google Maps
4. **Take photos** of the cathedral for your website
5. **Update RSVP deadline** when you have all details

---

**Your wedding date and venue are now live on your website!** 📅⛪✨

Guests can now mark their calendars for **July 17, 2026** at the beautiful **Butuan City Cathedral**!
