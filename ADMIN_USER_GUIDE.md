# Quick Guide: How to Add New Users

## For Admins Creating User Accounts

### 1. Go to User Creation Page

Open: **http://localhost:3001/admin/users/create**

### 2. Fill in User Information

| Field            | What to Enter                              | Example              |
| ---------------- | ------------------------------------------ | -------------------- |
| First Name       | User's first name                          | John                 |
| Last Name        | User's last name                           | Doe                  |
| Email            | User's email (must be unique)              | john.doe@example.com |
| Password         | Initial password for user                  | TempPass123!         |
| Confirm Password | Same password again                        | TempPass123!         |
| Phone            | Phone number (optional)                    | +255123456789        |
| Role             | Choose user type (see below)               | Staff                |
| Admin Secret     | `kekeo_safari_super_admin_2024_secret_key` | (enter once)         |

### 3. Choose the Right Role

**🧳 Tourist**

- For customers/clients
- Can book tours
- Can view their bookings
- Limited access

**👨‍💼 Staff**

- For employees
- Can manage bookings
- Can view customer info
- Standard access

**👑 Admin**

- For administrators
- Full system access
- Can create users
- Can manage everything

### 4. Click "Create User Account"

You'll see a success message with the user details.

### 5. Give User Their Login Info

**Tell the new user:**

- Login URL: http://localhost:3001/login
- Email: (the email you entered)
- Password: (the password you set)
- "Please change your password after first login"

---

## Common Questions

**Q: What if I forgot to save the password?**
A: You'll need to reset it in Supabase or create the user again with a different email.

**Q: Can users change their password?**
A: Yes, they can change it after logging in (if password change feature is enabled).

**Q: What is the Admin Secret?**
A: It's a security key that proves you're an admin. Enter it once per session.

**Q: Can I create multiple admins?**
A: Yes, just select "Admin" role when creating users.

**Q: What if the email is already taken?**
A: You'll get an error. Each email can only be used once.

---

## Tips

✅ **DO:**

- Use strong passwords (at least 8 characters)
- Double-check email addresses
- Choose the correct role for each user
- Save user credentials securely
- Tell users to change their password

❌ **DON'T:**

- Reuse passwords for multiple users
- Share admin credentials
- Create admin accounts unnecessarily
- Use simple passwords like "123456"

---

## Need Help?

If something doesn't work:

1. Check your internet connection
2. Refresh the page and try again
3. Check the terminal for error messages
4. Contact technical support

---

**That's it! User creation is simple and fast.** 🚀
