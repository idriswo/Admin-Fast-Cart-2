import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg">
      <h1 className="text-7xl font-extrabold text-brand">404</h1>
      <p className="text-muted">Саҳифа ёфт нашуд</p>
      <Link to="/">
        <Button>Ба Dashboard баргаштан</Button>
      </Link>
    </div>
  )
}
