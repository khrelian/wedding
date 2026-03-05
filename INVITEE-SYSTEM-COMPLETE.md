# Invitee Management System with QR Codes 🎫✨

A secure invitation system where only you can add invitees, and each invitee gets a unique QR code to access their personalized RSVP page!

## ✅ System Complete!

### What's Been Built

1. **Invitee Management System**
   - Add/edit/delete invitees from admin panel
   - Track party size (e.g., couple = 2 people)
   - Add notes (table assignments, dietary restrictions, etc.)
   - View RSVP status for each invitee

2. **QR Code Generation**
   - Unique QR code for each invitee
   - Signed URLs (secure and time-limited)
   - Download QR codes as PNG
   - View QR codes inline

3. **Guest RSVP System**
   - Guests scan QR code to access personalized RSVP page
   - No registration required
   - Beautiful starry night themed RSVP form
   - Guests can update their RSVP anytime

4. **Security**
   - Signed URLs (expire after 6 months)
   - Only admin can manage invitees
   - Each invitee has unique token
   - No guest registration needed

## 🎯 How It Works

### For You (Admin):

1. **Login** at `http://localhost/login`
   - Email: `admin@wedding.com`
   - Password: `password`

2. **Go to Invitees page** in the navigation menu

3. **Add an invitee:**
   - Click "Add Invitee"
   - Enter name (e.g., "John & Jane Doe")
   - Optional: email, phone
   - Party size (how many people invited)
   - Optional: notes

4. **Get the QR code:**
   - Click the QR code icon next to the invitee
   - Download or view the QR code
   - Send it to your guest (via email, SMS, or print it)

### For Your Guests:

1. **Scan the QR code** with their phone camera

2. **Opens RSVP page** with their name already shown

3. **Fill out RSVP:**
   - Attend or decline
   - Song request
   - Special message

4. **Submit** - Done! Their RSVP is saved

## 📊 Admin Features

### Invitee Management Page (`/invitees`)

**Stats Dashboard:**
- Total Invitees
- Total Invited People
- RSVP Submitted count
- Attending count

**Invitee Table:**
- Name and contact info
- Party size
- RSVP status (No response, Attending, Not attending)
- Notes
- Actions (View QR, Copy URL, Edit, Delete)

### For Each Invitee:

1. **View QR Code** - Modal with QR code
2. **Download QR Code** - Downloads PNG image
3. **Copy URL** - Copy the RSVP URL to clipboard
4. **Edit** - Update invitee details
5. **Delete** - Remove invitee

## 🔗 URLs

### Admin URLs (require login):
```
http://localhost/invitees           - Manage invitees
http://localhost/rsvp-management    - View all RSVPs
http://localhost/dashboard          - Dashboard
```

### Guest URLs (no login required):
```
http://localhost/rsvp/guest/{token} - Unique RSVP page for each invitee
```

The `{token}` is automatically generated and included in the QR code.

## 📱 QR Code Example

When you generate a QR code for "John & Jane Doe", it contains a URL like:
```
http://localhost/rsvp/guest/abc123xyz456...?signature=...
```

When scanned, it opens a personalized RSVP page that says:
```
Hello, John & Jane Doe!
Your invitation is for 2 people.
```

## 🎨 Guest RSVP Page Features

- **Beautiful starry night theme** - Matches your wedding theme
- **Personalized greeting** - Shows guest's name
- **Party size info** - Shows how many people are invited
- **Simple form:**
  - Attendance (Yes/No)
  - Song request
  - Special message
- **Mobile-friendly** - Works great on phones
- **No login required** - Just scan and RSVP!

## 💾 Database Structure

### `invitees` table:
```
- id
- name (e.g., "John & Jane Doe")
- email (optional)
- phone (optional)
- token (unique, auto-generated)
- party_size (default: 1)
- rsvp_submitted (boolean)
- rsvp_status ('yes' or 'no')
- notes (admin notes)
- timestamps
```

### `rsvps` table (updated):
```
- id
- user_id (for admin RSVPs)
- invitee_id (for guest RSVPs) ← NEW!
- attendance ('yes' or 'no')
- song_request
- special_message
- timestamps
```

## 🔐 Security Features

1. **Signed URLs**
   - URLs include cryptographic signature
   - Cannot be guessed or forged
   - Expire after 6 months

2. **Token-based Access**
   - Each invitee has unique 32-character token
   - Impossible to guess other invitees' links

3. **Admin-only Management**
   - Only authenticated users can add/edit/delete invitees
   - Guests cannot see other guests' information

## 📋 Usage Examples

### Example 1: Couple Invitation

```
Name: John & Jane Doe
Email: johndoe@email.com
Phone: +1234567890
Party Size: 2
Notes: Table 5, Jane is vegetarian
```

QR code opens:
```
Hello, John & Jane Doe!
Your invitation is for 2 people.
```

### Example 2: Single Guest

```
Name: Alice Smith
Email: alice@email.com
Party Size: 1
Notes: Plus-one declined
```

QR code opens:
```
Hello, Alice Smith!
```

### Example 3: Family

```
Name: The Johnson Family
Email: johnsons@email.com
Party Size: 4
Notes: Table 8, 2 adults + 2 kids
```

## 🎯 Workflow

### Before the Wedding:

1. **Add all invitees** to the system
2. **Generate QR codes** for each invitee
3. **Send invitations:**
   - Print QR code on invitation card
   - Or email QR code to guests
   - Or send via WhatsApp/SMS

### As RSVPs Come In:

1. **Monitor responses** in "View RSVPs" page
2. **Track who responded** in "Invitees" page
3. **See real-time stats**:
   - Total invited
   - Total attending
   - Total not attending
   - Response rate

### After RSVP Deadline:

1. **Export guest list** (you can see all info in the table)
2. **Plan seating** using the notes field
3. **Contact non-responders** using their email/phone

## 💡 Pro Tips

### Sending QR Codes:

**Option 1: Email**
```
Subject: You're Invited to Our Wedding! 🌟

Dear John & Jane,

We're getting married! Please scan the QR code below to RSVP:

[QR Code Image]

Or visit: [copy URL link]

Love,
Ian Jay & Karen Kate
```

**Option 2: Physical Invitation**
- Print QR code on invitation card
- Add text: "Scan to RSVP"

**Option 3: WhatsApp/SMS**
- Download QR code image
- Send via messaging app
- Include: "Scan this to RSVP to our wedding!"

### Managing Large Guest Lists:

**Use the Notes Field:**
```
Table 3, near dance floor
Vegetarian meal
Close family - priority seating
Plus-one approved
```

**Party Size Tips:**
- Couple: `2`
- Family of 4: `4`
- Single guest: `1`
- Single + plus-one: `2`

## 🚀 Getting Started

1. **Make sure everything is running:**
   ```bash
   ./vendor/bin/sail up -d
   ./vendor/bin/sail npm run dev
   ```

2. **Login to admin:**
   ```
   http://localhost/login
   Email: admin@wedding.com
   Password: password
   ```

3. **Click "Invitees" in navigation**

4. **Add your first invitee!**

## 📊 Statistics Available

**In Invitees Page:**
- Total Invitees (number of invitation groups)
- Total Invited People (sum of all party sizes)
- RSVP Submitted (how many responded)
- Attending (how many said yes)

**In View RSVPs Page:**
- Total RSVPs
- Attending
- Not Attending

## 🎨 Customization

### Change QR Code Size:

Edit `InviteeController.php`:
```php
->size(400)  // Change to 300, 500, etc.
```

### Change URL Expiration:

Edit `Invitee.php` model:
```php
now()->addMonths(6)  // Change to addWeeks(2), addYear(), etc.
```

### Add More Fields:

1. Add column to migration
2. Add to `$fillable` in model
3. Add to forms in Vue components

## 🔧 Troubleshooting

### QR Code Not Showing:
- Make sure SimpleSoftwareIO/QRCode package is installed
- Check if GD or Imagick extension is enabled

### "Invalid Signature" Error:
- QR code URL may have expired
- Generate a new QR code

### Guest Can't Access RSVP:
- Check if URL has correct token
- Make sure URL is complete (with signature)
- Try generating new QR code

## 📱 Mobile Support

The guest RSVP page is fully responsive:
- ✅ Works on all phones
- ✅ Easy to scan QR codes
- ✅ Touch-friendly buttons
- ✅ Auto-zoom disabled for better UX

## 🎉 Success!

Your invitee management system is now complete! You can:

✅ Add invitees from admin panel  
✅ Generate unique QR codes  
✅ Send secure RSVP links  
✅ Track responses in real-time  
✅ No guest registration needed  
✅ Beautiful themed RSVP pages  

---

**Ready to send invitations? Login and start adding your guests!** 💑✨🎊
