import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { CreateUserForm } from "@/components/admin/create-user-form"
import { SimpleCreateUserForm } from "@/components/admin/simple-create-user-form"
import { TestCreateUserForm } from "@/components/admin/test-create-user-form"
import { FixedCreateUserForm } from "@/components/admin/fixed-create-user-form"
import { AdminCreateUserForm } from "@/components/admin/admin-create-user-form"
import { WorkingCreateUserForm } from "@/components/admin/working-create-user-form"
import { SimpleTestForm } from "@/components/admin/simple-test-form"
import { QuickDiagnosticForm } from "@/components/admin/quick-diagnostic-form"
import { OfflineTestForm } from "@/components/admin/offline-test-form"
import { AdminUserCreationForm } from "@/components/admin/admin-user-creation-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreateUserPage() {
  return (
    <AdminDashboardLayout currentPage="users">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="production">👑 Admin Create</TabsTrigger>
            <TabsTrigger value="offline">🔍 Isolate</TabsTrigger>
            <TabsTrigger value="diagnostic">⚡ Quick Test</TabsTrigger>
            <TabsTrigger value="isolate">🧪 Full Test</TabsTrigger>
            <TabsTrigger value="working">✅ Working</TabsTrigger>
            <TabsTrigger value="admin">🚀 API</TabsTrigger>
            <TabsTrigger value="fixed">Fixed</TabsTrigger>
            <TabsTrigger value="test">Debug</TabsTrigger>
            <TabsTrigger value="simple">Quick</TabsTrigger>
            <TabsTrigger value="advanced">Legacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="production" className="mt-6">
            <AdminUserCreationForm />
          </TabsContent>
          
          <TabsContent value="offline" className="mt-6">
            <OfflineTestForm />
          </TabsContent>
          
          <TabsContent value="diagnostic" className="mt-6">
            <QuickDiagnosticForm />
          </TabsContent>
          
          <TabsContent value="isolate" className="mt-6">
            <SimpleTestForm />
          </TabsContent>
          
          <TabsContent value="working" className="mt-6">
            <WorkingCreateUserForm />
          </TabsContent>
          
          <TabsContent value="admin" className="mt-6">
            <AdminCreateUserForm />
          </TabsContent>
          
          <TabsContent value="fixed" className="mt-6">
            <FixedCreateUserForm />
          </TabsContent>
          
          <TabsContent value="test" className="mt-6">
            <TestCreateUserForm />
          </TabsContent>
          
          <TabsContent value="simple" className="mt-6">
            <SimpleCreateUserForm />
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6">
            <CreateUserForm />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  )
}