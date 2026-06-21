export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Preparing Your Safari</h2>
          <p className="text-sm text-muted-foreground">Just a moment while we gather your adventure...</p>
        </div>
      </div>
    </div>
  )
}
