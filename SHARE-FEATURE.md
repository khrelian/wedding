# Share Invitation Feature 📤✨

A complete sharing system to send your wedding invitations digitally via multiple channels!

## ✅ What's New

### Share Button Added!

Now when you click the **Share** button (green icon) next to any invitee, you get 5 sharing options:

### 1. 📥 **Download Invitation Image**
- Generates a beautiful invitation card with embedded QR code
- Features:
  - Starry night theme background
  - Your names and wedding details
  - Guest's name
  - QR code (400x400px)
  - "Scan to RSVP" instruction
  - RSVP deadline
- Perfect for:
  - Printing physical invitations
  - Sharing on social media (Instagram, Facebook, etc.)
  - Sending via any messaging app
  - Email attachments

**Image Specs:**
- Size: 1200 x 1600 pixels
- Format: PNG
- File name: `invitation-guest-name.png`

### 2. 💬 **Share via WhatsApp**
- Opens WhatsApp with pre-filled message
- Includes:
  - Wedding announcement
  - Date, time, location
  - RSVP link
  - Personal touch
- Works on both mobile and desktop
- Message template:
  ```
  You're invited to Ian Jay & Karen Kate's Wedding! 🌟

  July 17, 2026 at 7:00 AM
  Butuan City Cathedral

  Please RSVP here: [unique link]
  ```

### 3. 💙 **Share via Facebook Messenger**
- Opens Messenger app with the RSVP link
- Quick and easy for Facebook users
- Works on mobile devices

### 4. 📧 **Share via Email**
- Opens email client with pre-filled invitation
- Includes:
  - Subject: "You're Invited to Our Wedding! 🌟"
  - Personalized message
  - All wedding details
  - RSVP link
  - Professional formatting
- Guest's email pre-filled if available

**Email Template:**
```
Dear [Guest Name],

We're getting married and we'd love for you to join us!

Date: July 17, 2026
Time: 7:00 AM
Location: Butuan City Cathedral
Theme: Elegant Starry Night

Please RSVP by visiting: [unique link]

We can't wait to celebrate with you!

Love,
Ian Jay & Karen Kate
```

### 5. 📋 **Copy RSVP Link**
- Copies the unique RSVP URL to clipboard
- Share via any app or platform
- Simple and universal

## 🎨 Invitation Image Design

The generated invitation image includes:

### Visual Elements:
- **Background**: Beautiful gradient (slate → blue → indigo)
- **Stars**: 50 randomly placed twinkling stars
- **Title**: "You're Invited!" in golden amber
- **Names**: "Ian Jay & Karen Kate" in elegant script
- **Date**: "July 17, 2026 • 7:00 AM"
- **Location**: "Butuan City Cathedral"
- **Guest Name**: Prominently displayed
- **QR Code**: Large 400x400px QR code with white background
- **Instructions**: "Scan to RSVP"
- **Footer**: "Under the Starry Sky" + RSVP deadline

### Color Scheme:
- Gold/Amber accents (#fbbf24, #fcd34d)
- White text (#ffffff)
- Elegant and professional
- Matches your starry night theme

## 📱 How to Use

### From Admin Panel:

1. **Go to Invitees page** (`/invitees`)

2. **Find the invitee** you want to send to

3. **Click the Share button** (green share icon)

4. **Choose your sharing method:**

   **Option A: Download Image**
   - Click "Download Invitation Image"
   - Image saves to your computer
   - Share it anywhere:
     - WhatsApp: Send as image
     - Instagram Stories/Posts
     - Facebook Posts
     - Email attachment
     - Print it

   **Option B: Share Directly**
   - Click WhatsApp/Messenger/Email
   - App opens with pre-filled message
   - Add personal note if desired
   - Send!

   **Option C: Copy Link**
   - Click "Copy RSVP Link"
   - Paste anywhere you want

## 🌟 Use Cases

### 1. Social Media Announcements
```
Download invitation image
→ Post on Instagram/Facebook
→ Tag guests
→ Add caption about wedding
```

### 2. WhatsApp Groups
```
Click "Share via WhatsApp"
→ Paste in family/friends group
→ Everyone gets personalized link
```

### 3. Printed Invitations
```
Download invitation image
→ Print on photo paper or cardstock
→ Hand deliver or mail
→ Guests scan QR code on their phone
```

### 4. Email Blast
```
Download invitation images for all guests
→ Create email campaign
→ Attach personalized invitation
→ Send batch emails
```

### 5. Text Messages
```
Copy RSVP Link
→ Open phone messaging
→ Send with personal note
```

## 💡 Pro Tips

### For WhatsApp:
- Send the invitation image first (visual impact)
- Follow up with the text message (link for easy access)
- Add a voice note for personal touch

### For Instagram:
- Post invitation image as story
- Use "Link" sticker with RSVP URL
- Add countdown sticker for wedding date

### For Email:
- Download invitation image
- Use email template button OR
- Attach downloaded image to custom email

### For Printing:
- Download at full resolution (1200x1600)
- Print on glossy photo paper (4x6" or 5x7")
- Add to physical invitation cards
- Guests scan QR code when they receive it

## 🔄 Sharing Workflow Example

### Scenario: Sending to 50 Guests

**Week 1: Close Family (10 people)**
```
1. Create invitees in system
2. Download invitation images
3. Print on nice cardstock
4. Hand deliver with personal note
```

**Week 2: Friends (30 people)**
```
1. Create invitees in system
2. Share via WhatsApp:
   - Click share button
   - Send via WhatsApp
   - Add personal message
3. Post invitation image on Instagram story
```

**Week 3: Distant Relatives (10 people)**
```
1. Create invitees in system
2. Share via Email:
   - Click share button
   - Send via email
   - Include travel info
```

## 📊 Tracking

After sharing:
- Monitor responses in "Invitees" page
- See who RSVPed in "View RSVPs" page
- Track stats:
  - Total sent
  - Total responded
  - Attending count
  - Not attending count

## 🎯 Best Practices

### Timing:
- Send save-the-dates: 3-6 months before
- Send formal invitations: 6-8 weeks before
- RSVP deadline: 2-3 weeks before wedding

### Follow-up:
- 1 week after sending: Check response rate
- 1 week before deadline: Remind non-responders
- After deadline: Call/text those who haven't responded

### Personalization:
- Add personal note when sharing
- Mention specific details (how you know them, etc.)
- Express excitement about them attending

## 📱 Mobile Optimization

All sharing options work perfectly on mobile:
- ✅ Download works on phones (saves to gallery)
- ✅ WhatsApp opens mobile app
- ✅ Messenger opens mobile app
- ✅ Email opens mobile mail app
- ✅ Copy link works everywhere

## 🖨️ Print Quality

Invitation image is high-resolution:
- **1200 x 1600 pixels**
- **150 DPI** when printed at 8"x10"
- **300 DPI** when printed at 4"x5"
- Perfect for home and professional printing

## 🎨 Customization Ideas

Want to customize the invitation image? Edit the `downloadInvitationImage` function in `InviteeManagement.vue`:

- Change colors
- Add your photo
- Adjust text sizes
- Change fonts
- Add more stars
- Modify layout

## 🚀 Quick Start

1. **Login** to admin panel
2. **Add an invitee** (test with yourself first)
3. **Click Share button**
4. **Try "Download Invitation Image"**
5. **Check the downloaded image**
6. **Share it!** 🎉

---

**Now you have multiple ways to share your beautiful starry night wedding invitations!** 💍✨📤
