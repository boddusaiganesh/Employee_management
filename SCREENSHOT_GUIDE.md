# 📸 Screenshot Guide - How to Capture & Add Screenshots

## 🎯 Screenshots Needed

You need to capture **5 screenshots**:

1. **landing.png** - Landing/Welcome page
2. **dashboard.png** - Dashboard with charts
3. **employees.png** - Employee management (grid view)
4. **tasks.png** - Kanban board with tasks
5. **employee-details.png** - Employee detail page

---

## 🖼️ How to Take Screenshots

### **Method 1: Windows Snipping Tool (Recommended)**

1. Press `Windows + Shift + S`
2. Select "Rectangular Snip"
3. Drag to capture the area
4. Screenshot is copied to clipboard
5. Open Paint or any image editor
6. Paste (Ctrl + V) and Save as PNG

### **Method 2: Full Screenshot**

**Windows:**

- Press `PrtScn` (Print Screen) - Full screen
- Or `Alt + PrtScn` - Active window only

**Mac:**

- `Cmd + Shift + 3` - Full screen
- `Cmd + Shift + 4` - Select area
- `Cmd + Shift + 4 + Space` - Window only

### **Method 3: Browser DevTools**

1. Press `F12` to open DevTools
2. Press `Ctrl + Shift + P` (Cmd + Shift + P on Mac)
3. Type "screenshot"
4. Select "Capture full size screenshot" or "Capture screenshot"

---

## 📋 Screenshot Specifications

### Settings:

- **Resolution:** 1920x1080 (Full HD)
- **Format:** PNG (better quality than JPG)
- **Browser Zoom:** 100%
- **Theme:** Light mode (better readability)

### Best Practices:

- ✅ Clean browser (no extra tabs visible)
- ✅ Hide personal information
- ✅ Show actual data (not empty states)
- ✅ Capture at good scroll position
- ✅ Include important UI elements

---

## 📸 Screenshot Capture Instructions

### **1. Landing Page (landing.png)**

**URL:** https://employee-management-rcej.vercel.app

**What to Show:**

- Hero section with title
- Feature cards (visible without scrolling)
- Navigation bar at top
- "Get Started" buttons

**Steps:**

1. Open the URL in browser (100% zoom)
2. Wait for page to fully load
3. Don't scroll - capture the hero section
4. Take screenshot (Windows + Shift + S)
5. Save as `landing.png` in `screenshots` folder

---

### **2. Dashboard (dashboard.png)**

**URL:** https://employee-management-rcej.vercel.app/dashboard

**What to Show:**

- Stat cards (Total Employees, Tasks, etc.)
- Bar chart (Employees by Department)
- Pie chart (Tasks by Status)
- Priority distribution cards at bottom

**Steps:**

1. Login as admin (admin@example.com / 9392359Abc@)
2. Navigate to Dashboard
3. Scroll to show both charts clearly
4. Position so stats and charts are visible
5. Take screenshot
6. Save as `dashboard.png`

---

### **3. Employee Management (employees.png)**

**URL:** https://employee-management-rcej.vercel.app/dashboard/employees

**What to Show:**

- Search bar and filters at top
- Employee cards in grid view (6-9 cards visible)
- "Add Employee" button
- View toggle (Grid/List icons)

**Steps:**

1. Navigate to Employees page
2. Ensure Grid view is selected
3. Clear any search/filters
4. Scroll to show 6-9 employee cards
5. Take screenshot showing the top section + cards
6. Save as `employees.png`

---

### **4. Task Management - Kanban (tasks.png)**

**URL:** https://employee-management-rcej.vercel.app/dashboard/tasks

**What to Show:**

- All 4 Kanban columns: Pending, In Progress, Completed, Cancelled
- Task cards in each column (at least 2-3 tasks visible)
- Filters at top
- "Create Task" button

**Steps:**

1. Navigate to Tasks page
2. Ensure all 4 columns are visible (adjust zoom if needed)
3. Clear any filters
4. Capture showing tasks in multiple columns
5. Save as `tasks.png`

**Pro Tip:** If columns don't fit, zoom out to 90% (Ctrl + Mouse Wheel)

---

### **5. Employee Details (employee-details.png)**

**URL:** https://employee-management-rcej.vercel.app/dashboard/employees/:id

**What to Show:**

- Employee profile header with avatar
- All employee information (email, phone, salary, etc.)
- Assigned tasks section below

**Steps:**

1. From Employees page, click on any employee card
2. Scroll to show both profile info and tasks
3. Take screenshot showing complete profile
4. Save as `employee-details.png`

---

## 💾 Saving Screenshots

### File Naming (EXACT names):

```
screenshots/
├── landing.png
├── dashboard.png
├── employees.png
├── tasks.png
└── employee-details.png
```

### How to Save:

**After taking screenshot with Windows + Shift + S:**

1. Open Paint (or Paint 3D)
2. Press `Ctrl + V` to paste
3. Click File → Save As → PNG
4. Navigate to `EmployeeFullStack/screenshots/` folder
5. Name exactly as listed above
6. Click Save

---

## ✅ Verification Checklist

Before committing, verify:

- [ ] All 5 screenshots exist in `screenshots/` folder
- [ ] Files are named EXACTLY as specified (lowercase)
- [ ] All files are PNG format
- [ ] Images are clear and not blurry
- [ ] No personal information visible
- [ ] File sizes are reasonable (100KB - 500KB each)

---

## 🚀 Commit & Push Screenshots

Once all screenshots are captured and saved:

```bash
# Navigate to project root
cd EmployeeFullStack

# Add screenshots
git add screenshots/
git add README.md

# Commit
git commit -m "Add screenshots to README"

# Push to GitHub
git push origin main
```

---

## 🎨 Optional: Image Optimization

If screenshots are too large (>1MB each):

### Online Tools:

- **TinyPNG:** https://tinypng.com (drag & drop)
- **Compressor.io:** https://compressor.io
- **Squoosh:** https://squoosh.app

### Steps:

1. Upload your PNG file
2. Download compressed version
3. Replace original file
4. Check quality is still good

---

## 📝 Alternative: Use Online Screenshots

If you can't take screenshots locally, you can use:

**Placeholders** (temporary):

```markdown
![Landing Page](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=Landing+Page)
```

**Screenshot Services:**

- Screenshot.rocks - https://screenshot.rocks
- MockUPhone - https://mockuphone.com
- Screely - https://www.screely.com

---

## 💡 Pro Tips

1. **Take screenshots at 1920x1080 resolution** for best quality
2. **Use Private/Incognito mode** to avoid browser extensions showing
3. **Close other tabs** to avoid distraction in taskbar
4. **Wait for animations to complete** before capturing
5. **Check that all images load** before taking screenshot
6. **Take multiple shots** and choose the best one

---

## ❓ Troubleshooting

**Problem:** Screenshots appear in README but don't show on GitHub

**Solution:**

- Check file paths are correct (case-sensitive)
- Ensure files are committed and pushed
- Wait 1-2 minutes for GitHub to process images

**Problem:** Images are too large

**Solution:**

- Compress using TinyPNG or similar tool
- Or use 90% browser zoom when capturing

**Problem:** Can't see all Kanban columns

**Solution:**

- Zoom out to 80-90% (Ctrl + Mouse Wheel)
- Or capture in full-screen mode (F11)

---

**Happy Screenshot Taking! 📸✨**
