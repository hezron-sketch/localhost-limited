# Admin Dashboard — Contact Submissions Management

## Overview

The admin dashboard provides a complete interface for managing contact form submissions with advanced filtering, sorting, pagination, and status management features. Only users with the `admin` role can access this dashboard.

---

## Access & Authentication

### URL
```
https://your-domain.com/admin/submissions
```

### Requirements
- Must be logged in with Manus OAuth
- User account must have `role: "admin"` in the database
- Non-admin users will be redirected to the home page

### Becoming an Admin
To promote a user to admin:

1. Log in to the database
2. Update the user's role:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

Or, if using the owner's email (from `OWNER_EMAIL` env var), the user is automatically promoted to admin on first login.

---

## Dashboard Features

### 1. Statistics Cards

Display real-time submission statistics:
- **Total**: All submissions in the database
- **New**: Unreviewed submissions (status: "new")
- **Reviewed**: Submissions that have been reviewed (status: "reviewed")
- **Replied**: Submissions that have been replied to (status: "replied")
- **Archived**: Archived submissions (status: "archived")

Each card updates automatically when submissions are created or status is changed.

### 2. Filtering

Filter submissions by status:
- **All**: Show all submissions (default)
- **New**: Show only new submissions
- **Reviewed**: Show only reviewed submissions
- **Replied**: Show only replied submissions
- **Archived**: Show only archived submissions

Filters update the table and pagination immediately.

### 3. Sorting

Sort submissions by:
- **Date (Newest)**: Sort by submission date, newest first (default)
- **Name (A-Z)**: Sort alphabetically by submitter name

### 4. Pagination

Navigate through submissions with:
- **Items per page**: 10 submissions per page (configurable in code)
- **Page navigation**: Previous/Next buttons and page number buttons
- **Submission count**: Shows current range and total count

Example: "Showing 1 to 10 of 47 submissions"

### 5. Submissions Table

Display all submissions in a sortable, filterable table with columns:
- **Name**: Submitter's full name
- **Email**: Submitter's email address (clickable to send email)
- **Status**: Current status with color-coded badge
  - 🔵 New (Blue)
  - 🟡 Reviewed (Yellow)
  - 🟢 Replied (Green)
  - ⚫ Archived (Gray)
- **Submitted**: Date submission was received
- **Actions**: View and Delete buttons

### 6. Submission Details Modal

Click the "View" button to open a detailed modal showing:
- **Name**: Submitter's name
- **Email**: Clickable email link
- **Message**: Full message text (scrollable)
- **Status**: Current status badge
- **Submitted**: Exact timestamp
- **Updated**: Last update timestamp
- **Status Update Buttons**: Quick-change status to new/reviewed/replied/archived
- **Delete Button**: Permanently delete the submission

### 7. Status Management

Change submission status with:
- **Status Update Buttons**: In the detail modal, click any status to update
- **Color-coded feedback**: Button shows current status in green
- **Real-time updates**: Table updates immediately after status change
- **Toast notifications**: Confirmation or error messages

Status options:
- `new` - Initial state for new submissions
- `reviewed` - Marked as reviewed by admin
- `replied` - Response sent to submitter
- `archived` - Archived for record-keeping

### 8. Deletion

Delete submissions with:
- **Delete Button**: In the detail modal or table actions
- **Confirmation Modal**: Prevents accidental deletion
- **Permanent Removal**: Submission is permanently deleted from database
- **Toast Notification**: Confirms successful deletion

---

## Backend API Endpoints

All endpoints are protected with admin-only access control.

### List Submissions
```typescript
GET /api/trpc/contact.list
Input: {
  limit: number (1-100, default 50)
  offset: number (default 0)
  status?: "new" | "reviewed" | "replied" | "archived"
}
Output: {
  submissions: ContactSubmission[]
  total: number
}
```

### Get Single Submission
```typescript
GET /api/trpc/contact.get
Input: { id: number }
Output: ContactSubmission
```

### Get Statistics
```typescript
GET /api/trpc/contact.stats
Output: {
  total: number
  new: number
  reviewed: number
  replied: number
  archived: number
}
```

### Update Status
```typescript
POST /api/trpc/contact.updateStatus
Input: {
  id: number
  status: "new" | "reviewed" | "replied" | "archived"
}
Output: { success: boolean, message: string }
```

### Delete Submission
```typescript
POST /api/trpc/contact.delete
Input: { id: number }
Output: { success: boolean, message: string }
```

---

## Database Schema

### contactSubmissions Table
```sql
CREATE TABLE contactSubmissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'reviewed', 'replied', 'archived') DEFAULT 'new',
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Useful Queries

**View all submissions:**
```sql
SELECT * FROM contactSubmissions ORDER BY submittedAt DESC;
```

**View new submissions:**
```sql
SELECT * FROM contactSubmissions WHERE status = 'new' ORDER BY submittedAt DESC;
```

**Count submissions by status:**
```sql
SELECT status, COUNT(*) as count FROM contactSubmissions GROUP BY status;
```

**Get submissions from specific email:**
```sql
SELECT * FROM contactSubmissions WHERE email = 'user@example.com' ORDER BY submittedAt DESC;
```

**Update status:**
```sql
UPDATE contactSubmissions SET status = 'reviewed' WHERE id = 1;
```

**Delete submission:**
```sql
DELETE FROM contactSubmissions WHERE id = 1;
```

---

## Frontend Implementation

### Component Location
```
client/src/pages/AdminDashboard.tsx
```

### Key Features
- **tRPC Integration**: Uses `trpc.contact.*` hooks for all API calls
- **Real-time Updates**: Automatic refresh after mutations
- **Error Handling**: Toast notifications for errors
- **Loading States**: Spinners during data fetches
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### Component Structure
```typescript
export default function AdminDashboard() {
  // Authentication check
  // Data fetching with tRPC
  // State management (filters, pagination, modals)
  // Render: Header, Stats, Filters, Table, Modals
}
```

---

## Customization

### Change Items Per Page
Edit `AdminDashboard.tsx`:
```typescript
const ITEMS_PER_PAGE = 10; // Change this value
```

### Add New Status Types
1. Update database schema in `drizzle/schema.ts`
2. Update enum in status update button list
3. Update `STATUS_COLORS` object with new color scheme

### Customize Colors
Edit `STATUS_COLORS` object in `AdminDashboard.tsx`:
```typescript
const STATUS_COLORS: Record<SubmissionStatus, { bg: string; text: string; icon: any }> = {
  new: { bg: "bg-blue-500/15", text: "text-blue-400", icon: AlertCircle },
  // ... more statuses
};
```

### Add Export to CSV
Add a new button in the dashboard:
```typescript
const exportToCSV = () => {
  const csv = submissions.map(s => `${s.name},${s.email},${s.status}`).join('\n');
  // Download CSV file
};
```

---

## Security Considerations

### Access Control
- ✅ Admin-only access enforced at both frontend and backend
- ✅ tRPC procedures use `adminProcedure` wrapper
- ✅ Non-admin users cannot access endpoints

### Data Protection
- ✅ All data transmitted over HTTPS
- ✅ Session cookies are HTTP-only and secure
- ✅ No sensitive data exposed in URLs or logs

### Best Practices
- Regularly review and archive old submissions
- Delete submissions that are no longer needed
- Monitor for spam submissions and block if necessary
- Use strong passwords for admin accounts
- Enable two-factor authentication if available

---

## Troubleshooting

### Dashboard Not Loading
**Problem**: Admin dashboard shows blank or 404

**Solutions**:
1. Verify you're logged in: Check browser console for auth errors
2. Verify admin role: Check database `SELECT role FROM users WHERE email = 'your@email.com'`
3. Clear browser cache: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check dev server: Ensure `pnpm dev` is running

### Submissions Not Appearing
**Problem**: No submissions show in the table

**Solutions**:
1. Check database connection: Verify `DATABASE_URL` is set
2. Check submissions exist: Run `SELECT COUNT(*) FROM contactSubmissions;`
3. Check filters: Ensure filter is set to "All"
4. Check pagination: Ensure you're on page 1

### Status Update Not Working
**Problem**: Clicking status button doesn't update

**Solutions**:
1. Check admin role: Verify user has `role = 'admin'`
2. Check network: Open browser DevTools → Network tab
3. Check server logs: Look for errors in `pnpm dev` output
4. Try refreshing: Reload the page and try again

### Delete Not Working
**Problem**: Delete button doesn't remove submission

**Solutions**:
1. Verify confirmation modal appears
2. Check admin permissions
3. Check server logs for errors
4. Try refreshing the page

---

## Performance Tips

### For Large Datasets
- Use pagination to load only 50 items at a time
- Apply filters to reduce dataset size
- Archive old submissions to keep table lean
- Consider adding database indexes on `status` and `submittedAt` columns

### Database Index Optimization
```sql
CREATE INDEX idx_status ON contactSubmissions(status);
CREATE INDEX idx_submitted ON contactSubmissions(submittedAt DESC);
CREATE INDEX idx_email ON contactSubmissions(email);
```

---

## Future Enhancements

Consider implementing:

1. **Bulk Actions**
   - Select multiple submissions
   - Bulk status update
   - Bulk delete with confirmation

2. **Export Features**
   - Export to CSV
   - Export to PDF
   - Export date range

3. **Search & Advanced Filtering**
   - Search by name or email
   - Filter by date range
   - Full-text message search

4. **Email Integration**
   - Send reply email directly from dashboard
   - Email templates for responses
   - Auto-reply configuration

5. **Analytics**
   - Submission trends over time
   - Response time metrics
   - Submission source tracking

6. **Notifications**
   - Real-time notifications for new submissions
   - Email alerts for urgent submissions
   - Slack integration

---

## Files Modified/Created

### New Files
- `client/src/pages/AdminDashboard.tsx` — Admin dashboard component
- `server/admin.submissions.test.ts` — Admin API tests
- `ADMIN_DASHBOARD.md` — This documentation

### Modified Files
- `server/db.ts` — Added submission management queries
- `server/routers.ts` — Added admin contact procedures
- `client/src/App.tsx` — Added admin dashboard route

### Database
- `drizzle/schema.ts` — Contact submissions table (already created)

---

**Last Updated**: April 9, 2026
**Status**: ✅ Production Ready
**Access**: `/admin/submissions` (admin-only)
