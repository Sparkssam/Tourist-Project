# Deletion Request System - Setup Guide

## Overview
Staff can now request deletion of inquiries with past travel dates. Admins must review and approve these requests before the inquiries are actually deleted.

## Features Implemented

### 1. **Tourists Details Section Removed**
- ✅ Removed `TouristInquiriesList` component from staff dashboard (`/app/staff/page.tsx`)
- Staff dashboard now shows only the overview section

### 2. **Staff Deletion Request Feature**
- ✅ Staff can see a "Request Deletion" button for inquiries where travel_dates have passed
- ✅ System automatically checks if travel date is before today's date
- ✅ Staff must provide a reason for deletion
- ✅ Deletion request is sent to admin for approval (inquiry is NOT deleted immediately)
- ✅ Warning message shows: "An admin must approve this deletion request"

### 3. **Admin Approval System**
- ✅ Created new admin page: `/admin/deletion-requests`
- ✅ Admins can view all deletion requests (pending, approved, rejected)
- ✅ Shows inquiry details: client name, email, travel dates, message
- ✅ Shows who requested deletion and why
- ✅ Admins can:
  - **Approve**: Deletes the inquiry permanently
  - **Reject**: Keeps the inquiry, request is marked as rejected
- ✅ Statistics dashboard showing total, pending, approved, and rejected requests
- ✅ Filter buttons to view requests by status

### 4. **Database Table Created**
- ✅ Created `deletion_requests` table with:
  - Inquiry ID reference
  - Requested by (staff user ID)
  - Reason for deletion
  - Status (pending/approved/rejected)
  - Reviewed by (admin user ID)
  - Reviewed at (timestamp)
  - Created/updated timestamps
- ✅ Row Level Security (RLS) policies:
  - Staff can create deletion requests
  - Staff can view their own requests
  - Admins can view all requests
  - Only admins can approve/reject requests
- ✅ Automatic cascade deletion when inquiry is deleted

## Database Setup

### Run this SQL in Supabase:
```sql
-- File: create-deletion-requests-table.sql
-- Run this in your Supabase SQL Editor
```

1. Go to Supabase Dashboard
2. Click on "SQL Editor"
3. Open the file: `create-deletion-requests-table.sql`
4. Copy all the SQL code
5. Paste and run it in Supabase SQL Editor
6. Verify the table was created under "Database" → "Tables"

## How It Works

### Staff Workflow:
1. **View Inquiries**: Go to `/staff/inquiries`
2. **Check Past Dates**: System automatically identifies inquiries with past travel dates
3. **Request Deletion**:
   - Click on an inquiry with past travel date
   - See amber warning: "This inquiry's travel date has passed"
   - Click "Request Deletion" button
   - Enter reason (e.g., "Travel date has passed, no longer relevant")
   - Submit request
4. **Wait for Admin**: Request goes to admin for approval

### Admin Workflow:
1. **Access Page**: Go to `/admin/deletion-requests`
2. **View Statistics**: See total, pending, approved, rejected counts
3. **Filter Requests**: Click filter buttons (Pending, Approved, Rejected, All)
4. **Review Request**:
   - See full inquiry details
   - See who requested deletion and why
   - See travel dates to verify they are past
5. **Make Decision**:
   - **Approve & Delete**: 
     - Confirms with popup
     - Deletes inquiry permanently
     - Marks request as approved
   - **Reject**:
     - Enter rejection reason
     - Keeps inquiry intact
     - Marks request as rejected

## File Changes

### Modified Files:
1. **`/app/staff/page.tsx`**
   - Removed `TouristInquiriesList` import and component
   - Now shows only `StaffOverview`

2. **`/app/staff/inquiries/page.tsx`**
   - Added `Trash2` icon import
   - Added `requestDeletion()` function
   - Added `isPastDate()` helper function
   - Added delete button UI with warning message
   - Shows button only for past-date inquiries

3. **`/components/admin/admin-dashboard-layout.tsx`**
   - Added `Trash2` icon import
   - Added 'deletion-requests' to currentPage types
   - Added navigation item for Deletion Requests

### New Files:
1. **`/app/admin/deletion-requests/page.tsx`**
   - Complete admin page for managing deletion requests
   - Statistics cards
   - Filter buttons
   - Request cards with approve/reject actions
   - Full inquiry details display

2. **`/create-deletion-requests-table.sql`**
   - SQL schema for deletion_requests table
   - RLS policies
   - Indexes for performance
   - Trigger for updated_at timestamp

## Testing Instructions

### Test Staff Deletion Request:
1. **Create Past-Date Inquiry**:
   - Go to `/inquiry` page
   - Fill out form with travel dates in the past
   - Submit inquiry

2. **Login as Staff**:
   - Go to http://localhost:3000/login
   - Login with staff credentials

3. **View Inquiry**:
   - Go to `/staff/inquiries`
   - Find the inquiry with past travel date
   - Should see amber warning box

4. **Request Deletion**:
   - Click "Request Deletion" button
   - Enter reason: "Travel date has passed"
   - Click OK
   - Should see success message

### Test Admin Approval:
1. **Login as Admin**:
   - Logout from staff account
   - Login with admin credentials

2. **Access Deletion Requests**:
   - Click "Deletion Requests" in sidebar
   - Should see the pending request

3. **Review Request**:
   - See inquiry details
   - See staff who requested it
   - See reason provided

4. **Approve Deletion**:
   - Click "Approve & Delete" button
   - Confirm in popup
   - Request should be marked "Approved"
   - Inquiry should be deleted

5. **Verify Deletion**:
   - Go to `/admin/inquiries`
   - Inquiry should no longer exist
   - Go back to `/admin/deletion-requests`
   - Request should show as "Approved" with green badge

### Test Admin Rejection:
1. **Create Another Request**:
   - Follow staff workflow again
   - Create another deletion request

2. **Reject Request**:
   - Go to `/admin/deletion-requests`
   - Click "Reject" button
   - Enter reason: "Inquiry still needs follow-up"
   - Confirm

3. **Verify Rejection**:
   - Request should show "Rejected" with red badge
   - Inquiry should still exist in `/admin/inquiries`

## Date Detection Logic

The system checks if travel dates are past using this logic:

```typescript
const isPastDate = (travelDates?: string) => {
  if (!travelDates) return false
  
  try {
    // Parse formats like: "2024-10-20 to 2024-10-25" or "2024-10-20"
    const dateMatch = travelDates.match(/\d{4}-\d{2}-\d{2}/)
    if (!dateMatch) return false
    
    const travelDate = new Date(dateMatch[0])
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to beginning of day
    
    return travelDate < today
  } catch {
    return false
  }
}
```

## Security

- ✅ **RLS Policies**: Only staff/admin can create requests
- ✅ **Admin Only Approval**: Only admins can approve/reject
- ✅ **Cascade Deletion**: Deletion requests automatically cleaned when inquiry deleted
- ✅ **Audit Trail**: All requests logged with timestamps and user IDs
- ✅ **Confirmation Dialogs**: Admin must confirm before deleting

## Navigation

### Staff:
- Dashboard: `/staff`
- Inquiries: `/staff/inquiries`
- (Tourists details section removed)

### Admin:
- Dashboard: `/admin`
- Deletion Requests: `/admin/deletion-requests` ⭐ NEW
- All Inquiries: `/admin/inquiries`
- Users: `/admin/users`
- Revenue: `/admin/revenue`
- Reviews: `/admin/reviews`
- Safari Subscribers: `/admin/safari-subscribers`
- Database: `/admin/database`
- Progress: `/admin/progress`
- Settings: `/admin/settings`

## Troubleshooting

### If deletion button doesn't appear:
- Check that inquiry has `travel_dates` field populated
- Verify travel date is in the past
- Check browser console for errors

### If deletion request fails:
- Verify `deletion_requests` table exists in Supabase
- Check RLS policies are enabled
- Verify user is logged in as staff/admin
- Check browser console for error messages

### If admin can't approve/reject:
- Verify user role is 'admin' in profiles table
- Check RLS policies allow admin updates
- Verify inquiry_id exists (inquiry not already deleted)

## Summary

✅ **Staff**: Can request deletion of past-date inquiries
✅ **Admin**: Must review and approve before deletion
✅ **Tourists Section**: Removed from staff dashboard
✅ **Database**: New table with proper security
✅ **Navigation**: New admin page added
✅ **Testing**: All features ready to test

The system provides a safe, auditable way to manage old inquiries while maintaining admin control over data deletion.
