export const ProductCardSkeleton = () => (
  <div className="card">
    <div className="aspect-square bg-gray-200 skeleton" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 skeleton" />
      <div className="h-3 w-1/2 skeleton" />
      <div className="h-5 w-1/3 skeleton" />
    </div>
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <div className="aspect-square bg-gray-200 rounded-2xl skeleton mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-200 skeleton" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-8 w-2/3 skeleton mb-4" />
        <div className="h-4 w-full skeleton mb-6" />
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-1/3 skeleton" />
              <div className="h-3 w-1/4 skeleton" />
            </div>
          ))}
        </div>
        <div className="bg-gold-50 rounded-2xl p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-1/3 skeleton" />
              <div className="h-3 w-1/4 skeleton" />
            </div>
          ))}
          <div className="border-t pt-3 mt-2 flex justify-between">
            <div className="h-4 w-1/4 skeleton" />
            <div className="h-6 w-1/3 skeleton" />
          </div>
        </div>
      </div>
    </div>
  </div>
)


