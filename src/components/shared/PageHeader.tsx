interface PageHeaderProps {
  title: string
  action?: React.ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      {action}
    </div>
  )
}
