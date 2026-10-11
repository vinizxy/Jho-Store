import { Skeleton } from "@/components/ui/Skeleton"

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Carregando produtos">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </li>
        ))}
      </ul>
    </div>
  )
}
