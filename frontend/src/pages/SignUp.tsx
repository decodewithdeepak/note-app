import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const SignUp = () => {
    const [formData, setFormData] = useState({ name: '', dateOfBirth: '', email: '', password: '' })
    const [showOTP, setShowOTP] = useState(false)
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [userId, setUserId] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            setUserId(response.userId)
            setShowOTP(true)
        } catch (err: any) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await authAPI.verifyOTP({ userId, email: formData.email, otp })
            login(response.token, response.user)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message || 'OTP verification failed')
        } finally {
            setLoading(false)
        }
    }

    if (showOTP) return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-xs">
                    <div className="text-center mb-6">
                        <img src="/icon.png" alt="Logo" className="w-6 h-6 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-gray-900">Verify OTP</h2>
                        <p className="text-gray-600 mt-1 text-xs">Please enter the OTP sent to your email</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}
                    <form onSubmit={handleOTPSubmit} className="space-y-4">
                        <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Enter OTP" maxLength={6} />
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <button onClick={() => setShowOTP(false)} className="text-blue-600 hover:text-blue-700 text-xs">Back to signup</button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex flex-1 relative">
                <img src="/right-column.png" alt="Abstract design" className="w-full h-full object-cover" />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-xs lg:max-w-sm">
                    <div className="flex items-center mb-6">
                        <img src="/icon.png" alt="Logo" className="w-6 h-6 mr-2" />
                        <span className="text-gray-900 font-bold text-lg">HD</span>
                    </div>
                    <div className="text-left mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Sign up</h2>
                        <p className="text-gray-500 text-xs">Sign up to enjoy the feature of HD</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <label htmlFor="name" className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors group-focus-within:text-blue-600 group-hover:text-blue-600">Your Name</label>
                            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none transition-colors" placeholder="Enter your name" required />
                        </div>
                        <div className="relative group">
                            <label htmlFor="dateOfBirth" className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors group-focus-within:text-blue-600 group-hover:text-blue-600">Date of Birth</label>
                            <input id="dateOfBirth" name="dateOfBirth" type="text" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none pr-10 transition-colors" placeholder="DD/MM/YYYY" required />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative group">
                            <label htmlFor="email" className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors group-focus-within:text-blue-600 group-hover:text-blue-600">Email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none transition-colors" placeholder="Enter your email" required />
                        </div>
                        <div className="relative group">
                            <label htmlFor="password" className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors group-focus-within:text-blue-600 group-hover:text-blue-600">Password</label>
                            <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none pr-10 transition-colors" placeholder="Enter your password" required />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50">
                            {loading ? 'Creating Account...' : 'Get OTP'}
                        </button>
                    </form>

                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                            <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                        </div>

                        <button onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'} className="mt-3 w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs">
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <span className="text-gray-500 text-xs">Already have an account? </span>
                        <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold text-xs underline">Sign in</Link>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-gray-50">
                <img src="/right-column.png" alt="Abstract design" className="max-w-md max-h-[500px] object-cover rounded-2xl shadow-lg" />
            </div>
        </div>
    )
}

export default SignUp