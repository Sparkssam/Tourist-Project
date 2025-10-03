"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MoreHorizontal, 
  Edit, 
  UserX, 
  UserCheck, 
  Trash2, 
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Users,
  Loader2
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: 'admin' | 'staff' | 'tourist'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
  last_login_at?: string
  created_by?: string
}

export function UserManagementTable() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setProfiles(data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      setActionLoading(true)
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user status:', error)
        showAlert('error', `Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} user`)
      } else {
        showAlert('success', `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      showAlert('error', 'An error occurred while updating user status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionLoading(true)
      
      // First, try to delete from auth.users (this will cascade to profiles if set up)
      // Note: This requires service role key, so we'll just delete from profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Error deleting user:', error)
        showAlert('error', 'Failed to delete user. Please try again.')
      } else {
        showAlert('success', 'User deleted successfully!')
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      showAlert('error', 'An error occurred while deleting user')
    } finally {
      setActionLoading(false)
      setDeleteUserId(null)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800"
      case 'inactive':
        return "bg-red-100 text-red-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-purple-100 text-purple-800"
      case 'staff':
        return "bg-blue-100 text-blue-800"
      case 'tourist':
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading users...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Alert Messages */}
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mb-6">
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>All Users ({profiles.length})</span>
            </CardTitle>
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm" disabled={loading || actionLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || actionLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first user account.
              </p>
              <Button asChild>
                <Link href="/admin/users/create">Create User</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 font-medium">Last Login</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">
                            {profile.first_name} {profile.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {profile.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRoleBadgeVariant(profile.role)}>
                          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadgeVariant(profile.status)}>
                          {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="flex items-center space-x-1 mb-1">
                            <Mail className="h-3 w-3" />
                            <span>{profile.email}</span>
                          </div>
                          {profile.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{profile.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(profile.created_at)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-muted-foreground">
                          {profile.last_login_at 
                            ? formatDate(profile.last_login_at)
                            : 'Never'
                          }
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={actionLoading}>
                              {actionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${profile.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleStatusToggle(profile.id, profile.status)}
                              disabled={actionLoading}
                            >
                              {profile.status === 'active' ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteUserId(profile.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => !actionLoading && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This will permanently remove their account and all associated data. This action cannot be undone.
              <br /><br />
              <strong className="text-red-600">Note:</strong> If you want to temporarily disable access, consider using "Deactivate" instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Permanently'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}