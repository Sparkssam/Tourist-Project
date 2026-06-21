export default function ToursLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-24">
        <div className="space-y-12 animate-pulse">
          <div className="h-12 bg-muted rounded-lg w-1/2 mx-auto"></div>
          <div className="flex gap-4 justify-center flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded-full"></div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-64 bg-muted rounded-xl"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
