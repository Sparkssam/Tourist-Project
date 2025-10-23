# Inquiry Deletion System - Complete Setup Guide

## Overview
Staff can delete inquiries with past travel dates. The inquiry is immediately marked as "pending_deletion" and hidden from staff view. Admin must either approve the deletion (permanently deletes) or deny it (restores the inquiry, and staff must deal with it).

## Features Implemented

### 1. **Tourist Details Page Removed** ✅
- ✅ Deleted entire `/app/staff/tourists/` directory
- ✅ Removed "Tourist Details" from staff navigation
- Staff dashboard now shows only: Overview, Tourist Inquiries, My Profile

### 2. **Staff Direct Deletion** ✅
- ✅ Staff can DELETE inquiries with past travel dates (not just "request")
- ✅ Inquiry is immediately marked as `deletion_status: 'pending_deletion'`
- ✅ Inquiry is hidden from staff view until admin decides
- ✅ Staff must provide deletion reason
- ✅ Warning: "Admin must approve. Inquiry will be hidden until admin decides."

### 3. **Admin Approval/Denial System** ✅
- ✅ Admin page: `/admin/deletion-requests`
- ✅ Admin can see all deletion requests with full inquiry details
- ✅ Admin can:
  - **Approve**: Permanently deletes inquiry from database
  - **Deny**: Restores inquiry to `active` status, staff must deal with it
- ✅ Denial reason required and shown to staff
- ✅ Statistics: Total, Pending, Approved, Denied

### 4. **Database Schema** ✅
- ✅ `deletion_requests` table created
- ✅ `inquiries.deletion_status` column added (active, pending_deletion, deleted)
- ✅ Row Level Security (RLS) policies
- ✅ Only admins can approve/deny

## How It Works

### Staff Workflow:
1. **View Inquiry**: Go to `/staff/inquiries`
2. **See Past Date**: System detects past travel_dates
3. **Delete Inquiry**:
   - Click "Delete Inquiry" button
   - Enter reason (e.g., "Travel date passed, customer cancelled")
   - Confirm
4. **Inquiry Hidden**: Inquiry disappears from staff view immediately
5. **Wait for Admin**: Admin must approve or deny

### Admin Workflow:
1. **Access Page**: `/admin/deletion-requests`
2. **View Request**: See inquiry details, who deleted it, and why
3. **Make Decision**:
   - **Approve**: 
     - Inquiry permanently deleted from database
     - Cannot be recovered
     - Request marked "Approved"
   - **Deny**:
     - Inquiry restored to active status
     - Staff will see it again in their inquiries list
     - Must provide denial reason
     - Staff must deal with the inquiry
     - Request marked "Denied"

### If Admin Denies:
- Inquiry returns to staff inquiries list
- Status: Active (no longer pending_deletion)
- Staff sees it and must handle it
- Denial reason visible to admin (for records)

## Database Setup

### Run this SQL in Supabase:
1. Open file: `create-deletion-requests-table.sql`
2. Go to Supabase Dashboard → SQL Editor
3. Copy and paste all SQL code
4. Run it
5. Verify tables:
   - `deletion_requests` table created
   - `inquiries` table has new `deletion_status` column

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
