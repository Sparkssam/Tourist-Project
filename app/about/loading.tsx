export default function AboutLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-12 animate-pulse">
          <div className="h-12 bg-muted rounded-lg w-2/3 mx-auto"></div>
          <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="h-96 bg-muted rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
