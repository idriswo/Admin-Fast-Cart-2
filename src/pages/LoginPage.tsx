import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/layout/Logo'
import { Spinner } from '@/components/ui/Spinner'
import { login } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'
import type { LoginRequest } from '@/types'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>()

  const onSubmit = async (values: LoginRequest) => {
    setLoading(true)
    try {
      const { token, userName } = await login(values)
      if (!token) throw new Error('Токен дастрас нашуд')
      setAuth(token, userName)
      toast.success('Хуш омадед!')
      navigate('/')
    } catch {
      // Error toast already shown by the axios interceptor.
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-center bg-sidebar p-12 lg:flex">
        <div data-aos="fade-right">
          <p className="mb-4 text-lg text-gray-300">Welcome to admin panel</p>
          <Logo className="scale-150 origin-left" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm"
          data-aos="fade-up"
        >
          <h1 className="mb-8 text-2xl font-bold text-ink">Log in</h1>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="Username"
                {...register('userName', { required: 'Номи корбар лозим аст' })}
              />
              {errors.userName && (
                <p className="mt-1 text-xs text-danger">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  className="pr-10"
                  {...register('password', { required: 'Парол лозим аст' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="my-5 text-center">
            <button type="button" className="text-sm font-medium text-brand">
              Forgot password?
            </button>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Spinner className="text-white" /> : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
