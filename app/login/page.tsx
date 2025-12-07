'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Loader2, Mail, Lock, Sparkles, Briefcase } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async () => {
    setLoading(true)
    let error;
    
    if (activeTab === 'signup') {
        const res = await supabase.auth.signUp({ email, password })
        error = res.error
    } else {
        const res = await supabase.auth.signInWithPassword({ email, password })
        error = res.error
    }

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/admin') 
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900">
      
      {/* --- NEW: Brand Logo Top Left --- */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl md:text-2xl font-black tracking-tight text-white">
            CAREERFY
        </span>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/30 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/30 blur-[120px] animate-pulse delay-1000" />
      
      {/* Glassmorphism Card */}
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            Build your dream careers page in minutes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="name@company.com" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-10 h-11 border-gray-200 focus-visible:ring-blue-500 transition-all"
                />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="••••••••" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-10 h-11 border-gray-200 focus-visible:ring-blue-500 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                />
            </div>
          </div>

          <Button 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            onClick={handleAuth} 
            disabled={loading}
          >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {activeTab === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
            ) : (
                activeTab === 'login' ? 'Sign In' : 'Get Started Free'
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">
                {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
            >
                {activeTab === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </CardContent>
      </Card>
      
      <div className="absolute bottom-6 text-center text-slate-500 text-xs">
        <p>© 2025 Careerfy. Secure Login.</p>
      </div>
    </div>
  )
}