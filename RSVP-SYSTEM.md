# RSVP System Documentation

## Overview
Your wedding website now has a complete RSVP management system! Guests can submit their responses, and you can view and manage all RSVPs from the admin panel.

## Features

### For Guests (RSVP Form)
- **Attendance Confirmation**: Choose to joyfully accept or regretfully decline
- **Guest Count**: Specify number of guests attending (including themselves)
- **Dietary Restrictions**: Share any food allergies or dietary requirements
- **Song Request**: Request a song for the reception
- **Special Message**: Leave a personalized message for the couple
- **Update Capability**: Guests can update their RSVP anytime

### For You (RSVP Management)
- **Statistics Dashboard**: View at-a-glance stats:
  - Total responses received
  - Number attending
  - Number not attending
  - Total guest count
- **Detailed Guest List**: See all RSVP details in a table:
  - Guest name and email
  - Attendance status (✓ Attending / ✗ Not Attending)
  - Number of guests
  - Dietary restrictions
  - Song requests
  - Special messages
  - Submission date and time
- **Export Options**: (Coming soon) Export data to Excel or CSV

## How to Access

### RSVP Form
After logging in, guests can access the RSVP form at:
- Click "RSVP" in the navigation menu, or
- Visit: `http://localhost/rsvp`

### RSVP Management (Admin View)
To view all RSVPs:
- Click "View RSVPs" in the navigation menu, or
- Visit: `http://localhost/rsvp-management`

## Database Structure

The system uses a `rsvps` table with the following fields:
- `id` - Unique identifier
- `user_id` - Links to the guest's user account
- `attendance` - 'yes' or 'no'
- `guest_count` - Number of guests (1-10)
- `dietary_restrictions` - Text field for allergies/requirements
- `song_request` - Song title (max 255 characters)
- `special_message` - Personal message from the guest
- `created_at` - When the RSVP was submitted
- `updated_at` - Last time the RSVP was updated

## Technical Details

### Files Modified/Created
1. **Database**
   - `database/migrations/2026_03_05_171307_create_rsvps_table.php` - Database structure
   - `app/Models/Rsvp.php` - RSVP model

2. **Backend**
   - `app/Http/Controllers/RsvpController.php` - Handles RSVP logic
   - `routes/web.php` - Added RSVP routes

3. **Frontend**
   - `resources/js/Pages/RSVP.vue` - RSVP form (updated with working form)
   - `resources/js/Pages/RsvpManagement.vue` - Admin view (NEW)
   - `resources/js/Layouts/AuthenticatedLayout.vue` - Added navigation links

### Routes
```php
GET  /rsvp               - Show RSVP form
POST /rsvp               - Submit/update RSVP
GET  /rsvp-management    - View all RSVPs (admin)
```

## Guest Management Tips

### Viewing RSVPs
- The management page shows responses in order (most recent first)
- Color-coded status badges make it easy to scan:
  - Green = Attending
  - Red = Not Attending
- Hover over table rows for better readability

### Planning Your Event
Use the stats at the top to:
- Track response rate
- Calculate seating arrangements (total guests)
- Plan catering (dietary restrictions column)
- Create reception playlist (song requests)

### Important Notes
- Each user can only submit ONE RSVP (they can update it)
- All RSVPs are tied to user accounts (login required)
- Current max guest count is 10 per RSVP
- Export functionality is planned for future updates

## Next Steps (Optional Enhancements)

### Recommended Additions
1. **Email Notifications**: Get notified when someone RSVPs
2. **RSVP Deadline**: Set a cutoff date for responses
3. **Guest Categories**: Tag guests (family, friends, colleagues)
4. **Seating Assignments**: Plan table arrangements
5. **Excel Export**: Download RSVP data for offline planning
6. **Plus-One Management**: Better handle +1 invitations
7. **QR Code Check-in**: Generate QR codes for event check-in

### Current Status
✅ RSVP form working and themed  
✅ Database storing responses  
✅ Admin management page  
✅ Statistics dashboard  
✅ Navigation integrated  
⏳ Export to Excel/CSV (coming soon)  
⏳ Email notifications (optional)

## Design
The RSVP system maintains your elegant starry night theme with:
- Amber/gold accent colors
- Gradient backgrounds (slate-800 to blue-900)
- Star icons throughout
- Glass-morphism effects
- Responsive design for mobile devices

Enjoy tracking your wedding guests! ✨
