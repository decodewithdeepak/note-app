import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        email: ''
    })
    const [showOTP, setShowOTP] = useState(false)
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would handle the signup logic
        setShowOTP(true)
    }

    const handleOTPSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle OTP verification
        navigate('/dashboard')
    }

    if (showOTP) {
        return (
            <div className="min-h-screen flex">
                {/* Left side - Form */}
                <div className="flex-1 flex items-center justify-center p-6 bg-white">
                    <div className="w-full max-w-xs">
                        <div className="text-center mb-6">
                            <img src="/icon.png" alt="Logo" className="w-6 h-6 mx-auto mb-3" />
                            <h2 className="text-lg font-semibold text-gray-900">Verify OTP</h2>
                            <p className="text-gray-600 mt-1 text-xs">Please enter the OTP sent to your email</p>
                        </div>

                        <form onSubmit={handleOTPSubmit} className="space-y-4">
                            <div>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition duration-200 font-medium text-sm"
                            >
                                Verify OTP
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <button
                                onClick={() => setShowOTP(false)}
                                className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                                Back to signup
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side - Image (Hidden on mobile, visible on lg+) */}
                <div className="hidden lg:flex flex-1 relative">
                    <img
                        src="/right-column.png"
                        alt="Abstract design"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-xs lg:max-w-sm">
                    {/* HD Icon and Text - Left aligned */}
                    <div className="flex items-center mb-6">
                        <img src="/icon.png" alt="Logo" className="w-6 h-6 mr-2" />
                        <span className="text-gray-900 font-bold text-lg">HD</span>
                    </div>

                    {/* Sign up title and subtitle - Left aligned */}
                    <div className="text-left mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Sign up</h2>
                        <p className="text-gray-500 text-xs">Sign up to enjoy the feature of HD</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field with Fixed Label that changes color on focus/hover */}
                        <div className="relative group">
                            <label
                                htmlFor="name"
                                className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors duration-200 group-focus-within:text-blue-600 group-hover:text-blue-600"
                            >
                                Your Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none transition-colors duration-200"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        {/* Date of Birth Field with Fixed Label that changes color on focus/hover */}
                        <div className="relative group">
                            <label
                                htmlFor="dateOfBirth"
                                className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors duration-200 group-focus-within:text-blue-600 group-hover:text-blue-600"
                            >
                                Date of Birth
                            </label>
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="text"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none pr-10 transition-colors duration-200"
                                placeholder="DD/MM/YYYY"
                                required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                        </div>

                        {/* Email Field with Fixed Label that changes color on focus/hover */}
                        <div className="relative group">
                            <label
                                htmlFor="email"
                                className="absolute left-3 -top-2 bg-white px-1 text-xs font-medium text-gray-500 z-10 transition-colors duration-200 group-focus-within:text-blue-600 group-hover:text-blue-600"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-blue-500 hover:border-blue-500 focus:outline-none transition-colors duration-200"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="pt-1">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm"
                            >
                                Get OTP
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <span className="text-gray-500 text-xs">Already have an account? </span>
                        <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold text-xs underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right side - Image (Hidden on mobile, visible on lg+ screens) */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-gray-50">
                <img
                    src="/right-column.png"
                    alt="Abstract design"
                    className="max-w-md max-h-[500px] object-cover rounded-2xl shadow-lg"
                />
            </div>
        </div>
    )
}

export default SignUp
