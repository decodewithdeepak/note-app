import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // For Google OAuth, we need to get user info from the token
            // Since the token contains user ID, we can make a request to get user details
            const apiBase = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

            fetch(`${apiBase}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        login(token, data.user);
                        navigate('/dashboard');
                    } else {
                        navigate('/signin?error=auth_failed');
                    }
                })
                .catch(() => {
                    navigate('/signin?error=auth_failed');
                });
        } else {
            navigate('/signin?error=no_token');
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
