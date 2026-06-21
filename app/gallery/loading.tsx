export default function GalleryLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-24">
        <div className="space-y-12 animate-pulse">
          <div className="h-12 bg-muted rounded-lg w-1/3 mx-auto"></div>
          <div className="flex gap-4 justify-center flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 bg-muted rounded-full"></div>
            ))}
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className={`h-${i % 2 === 0 ? "80" : "64"} bg-muted rounded-xl break-inside-avoid`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
