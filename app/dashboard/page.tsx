import { redirect } from 'next/navigation'

export default function DashboardRedirectPage() {
  // This page will be handled by middleware for role-based redirection
  redirect('/tourist')
}