# Contact Form Integration — Localhost Limited

## Overview

The contact form has been fully integrated with a production-ready backend that:
- ✅ Stores submissions in a MySQL database
- ✅ Sends confirmation emails to users
- ✅ Sends notification emails to the owner
- ✅ Validates all input with Zod schemas
- ✅ Includes comprehensive error handling
- ✅ Uses tRPC for type-safe API communication

---

## Architecture

### Frontend (React/tRPC)
- **Component**: `client/src/components/ContactForm.tsx`
- **Integration**: Uses `trpc.contact.submit.useMutation()` to call the backend
- **Features**:
  - Real-time validation with error messages
  - Loading states during submission
  - Success/error toast notifications
  - Accessible form with ARIA labels

### Backend (Express/tRPC)
- **Endpoint**: `POST /api/trpc/contact.submit`
- **Handler**: `server/routers.ts` → `contact.submit` procedure
- **Validation**: Zod schema enforces:
  - Name: 2-255 characters
  - Email: Valid email format
  - Message: 10-5000 characters

### Database
- **Table**: `contactSubmissions`
- **Schema**: `drizzle/schema.ts`
- **Fields**:
  - `id` (auto-increment primary key)
  - `name` (varchar 255)
  - `email` (varchar 320)
  - `message` (text)
  - `status` (enum: new, reviewed, replied, archived)
  - `submittedAt` (timestamp)
  - `updatedAt` (timestamp)

### Email Service
- **Provider**: Resend (https://resend.com)
- **Configuration**: Uses `RESEND_API_KEY` environment variable
- **Emails Sent**:
  1. **Confirmation email** to user (template: `server/email.ts`)
  2. **Notification email** to owner (template: `server/email.ts`)
  3. **In-app notification** to owner (via `notifyOwner()`)

---

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file or Manus secrets:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
OWNER_EMAIL=hello@localhostlimited.com
DATABASE_URL=mysql://user:password@host/database
```

**Getting RESEND_API_KEY:**
1. Go to https://resend.com
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into `RESEND_API_KEY`

**Important**: For production emails, you'll need to verify your domain in Resend:
1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `localhostlimited.com`)
3. Follow DNS verification steps
4. Once verified, emails will be sent from `noreply@localhostlimited.com`

### 2. Database Migration

The database schema has already been created. To verify:

```bash
pnpm db:push
```

This will:
- Generate migration files
- Apply migrations to your database
- Create the `contactSubmissions` table

### 3. Start the Development Server

```bash
pnpm dev
```

The server will start on `http://localhost:3000` with:
- Frontend (React) on port 3000
- Backend API on `/api/trpc`
- Database connection active

---

## How It Works

### User Submits Form

1. User fills in contact form on `/contact` page
2. Frontend validates input locally
3. User clicks "Send Message"

### Frontend Submission

```typescript
// ContactForm.tsx
const submitContactMutation = trpc.contact.submit.useMutation({
  onSuccess: () => {
    setIsSuccess(true);
    toast.success("Message sent successfully!");
  },
  onError: (error) => {
    setApiError(error.message);
    toast.error(error.message);
  },
});

await submitContactMutation.mutateAsync({
  name: formData.name,
  email: formData.email,
  message: formData.message,
});
```

### Backend Processing

1. **Validation** (Zod schema)
   - Checks name, email, message format
   - Returns validation errors if invalid

2. **Database Storage**
   ```typescript
   const result = await createContactSubmission({
     name: input.name,
     email: input.email,
     message: input.message,
     status: "new",
   });
   ```

3. **Confirmation Email to User**
   ```typescript
   await sendContactConfirmationEmail(input.name, input.email);
   ```

4. **Owner Notification (In-App)**
   ```typescript
   await notifyOwner({
     title: `New Contact Form Submission from ${input.name}`,
     content: `Email: ${input.email}\n\nMessage:\n${input.message}`,
   });
   ```

5. **Owner Notification (Email)**
   ```typescript
   await sendContactNotificationEmail(
     input.name,
     input.email,
     input.message,
     ownerEmail
   );
   ```

6. **Response to Frontend**
   ```typescript
   return {
     success: true,
     message: "Thank you for reaching out! We'll get back to you soon.",
   };
   ```

### Frontend Success State

1. Form shows success message with checkmark icon
2. Toast notification confirms submission
3. Form clears for next submission
4. User can click "Send Another Message" to reset

---

## Testing

### Run Tests

```bash
pnpm test
```

This runs all vitest tests including:
- `server/contact.submit.test.ts` — Contact form validation and submission
- `server/auth.logout.test.ts` — Authentication tests

### Manual Testing

1. Navigate to `http://localhost:3000/contact`
2. Fill in the contact form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Message: "This is a test message"
3. Click "Send Message"
4. Verify:
   - ✅ Success message appears
   - ✅ Form clears
   - ✅ Check database for new submission
   - ✅ Check email inbox for confirmation and notification emails

### Test Invalid Inputs

Try submitting with:
- Empty name → Error: "Name is required"
- Invalid email → Error: "Invalid email address"
- Short message → Error: "Message must be at least 10 characters"

---

## Database Queries

### View All Submissions

```sql
SELECT * FROM contactSubmissions ORDER BY submittedAt DESC;
```

### View New Submissions

```sql
SELECT * FROM contactSubmissions WHERE status = 'new' ORDER BY submittedAt DESC;
```

### Update Submission Status

```sql
UPDATE contactSubmissions SET status = 'reviewed' WHERE id = 1;
```

### Get Submissions by Email

```sql
SELECT * FROM contactSubmissions WHERE email = 'john@example.com';
```

---

## Email Templates

### Confirmation Email (to user)

- Subject: "We've Received Your Message — Localhost Limited"
- Contains: Thank you message, response time expectation, contact phone number
- Branded with dark blue and luminous green colors

### Notification Email (to owner)

- Subject: "New Contact: [User Name]"
- Contains: User name, email, full message
- Includes link to dashboard for quick access
- Branded with company colors

---

## Error Handling

### Validation Errors

If form data is invalid, Zod returns specific error messages:
- "Name must be at least 2 characters"
- "Invalid email address"
- "Message must be at least 10 characters"

### Database Errors

If database is unavailable:
- Error: "Database connection failed"
- Frontend shows: "Failed to submit contact form. Please try again later."

### Email Errors

If Resend API fails:
- Warning logged to console
- Form submission still succeeds (graceful degradation)
- User sees success message
- Owner receives in-app notification even if email fails

---

## Production Checklist

Before deploying to production:

- [ ] Set `RESEND_API_KEY` in production environment
- [ ] Set `OWNER_EMAIL` to your actual email address
- [ ] Verify your domain in Resend dashboard
- [ ] Update email templates with your branding (optional)
- [ ] Test form submission end-to-end
- [ ] Monitor email delivery in Resend dashboard
- [ ] Set up database backups
- [ ] Configure error monitoring (e.g., Sentry)
- [ ] Add rate limiting to prevent spam (optional)

---

## Troubleshooting

### Emails Not Sending

**Issue**: Form submits but no emails received

**Solutions**:
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain in Resend dashboard
3. Check spam/junk folder
4. Check Resend dashboard for delivery errors
5. Verify `OWNER_EMAIL` is correct

### Form Submission Fails

**Issue**: "Failed to submit contact form" error

**Solutions**:
1. Check database connection in logs
2. Verify `DATABASE_URL` is correct
3. Ensure `contactSubmissions` table exists: `pnpm db:push`
4. Check for validation errors in browser console

### Validation Errors

**Issue**: Form rejects valid input

**Solutions**:
1. Check minimum/maximum length requirements
2. Verify email format (must include @ and domain)
3. Check for leading/trailing whitespace
4. Try different browser if issue persists

---

## Files Modified/Created

### New Files
- `server/email.ts` — Email service with Resend integration
- `server/contact.submit.test.ts` — Contact form tests
- `CONTACT_FORM_INTEGRATION.md` — This documentation

### Modified Files
- `drizzle/schema.ts` — Added `contactSubmissions` table
- `server/db.ts` — Added contact submission queries
- `server/routers.ts` — Added `contact.submit` procedure
- `client/src/components/ContactForm.tsx` — Integrated tRPC mutation

### Database
- `drizzle/0001_green_bucky.sql` — Migration for `contactSubmissions` table

---

## Support & Next Steps

### Additional Features to Consider

1. **Admin Dashboard** — View and manage submissions
2. **Email Notifications** — Send to multiple recipients
3. **Rate Limiting** — Prevent spam submissions
4. **Captcha** — Add reCAPTCHA for security
5. **Auto-Reply** — Customizable confirmation email
6. **Submission Export** — Export to CSV/PDF

### Resources

- **Resend Docs**: https://resend.com/docs
- **tRPC Docs**: https://trpc.io
- **Drizzle ORM**: https://orm.drizzle.team
- **Zod Validation**: https://zod.dev

---

**Last Updated**: April 9, 2026
**Status**: ✅ Production Ready
