import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import {  useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { useRecoilValue } from "recoil";
import { authAtom } from "@/store/auth";

function Verification() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const token = useParams().token;
    const auth = useRecoilValue(authAtom)
   useEffect(()=>{
    if(!auth.user) {
        // localStorage.setItem('verification', `/verify/${token}`);
        navigate('/signin')
        return
    }
   },[auth])
    useEffect(() => {
        const verify = async () => {
            setLoading(true);
            setError(null);
            try {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                
                const res = await axios.post(`${BACKEND_URL}/document/verify-link`, { token }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    withCredentials: true
                });

                navigate(`/document/${res.data.decoded.id}`, { 
                    state: { role: res.data.decoded.role } 
                });
            } catch (error) {
                console.error(error);
                setError("Failed to verify link. Please try again or contact support.");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-md"></div>
                <div className="relative z-10 text-center">
                    <div className="animate-bounce">
                        <Loader2 className="h-24 w-24 text-neutral-700 mx-auto mb-8 animate-spin" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-800 mb-6 tracking-wide">
                        Authenticating Access
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto px-4">
                        Verifying your document link and preparing your workspace
                    </p>
                    <div className="mt-12 flex justify-center">
                        <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-neutral-700 animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-100/50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-50"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-md"></div>
                <div className="relative z-10 text-center">
                    <AlertTriangle className="h-24 w-24 text-neutral-700 mx-auto mb-8 animate-pulse" />
                    <h1 className="text-4xl font-bold text-neutral-800 mb-6 tracking-wide">
                        Verification Failed
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto px-4 mb-12">
                        {error}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-neutral-200 text-neutral-800 rounded-full hover:bg-neutral-300 transition"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-100/50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-50"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-md"></div>
            <div className="relative z-10 text-center">
                <ShieldCheck className="h-24 w-24 text-neutral-700 mx-auto mb-8 animate-pulse" />
                <h1 className="text-4xl font-bold text-neutral-800 mb-6 tracking-wide">
                    Access Verified
                </h1>
                <p className="text-xl text-neutral-600 max-w-2xl mx-auto px-4">
                    Redirecting to your document...
                </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-100/50 to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-50"></div>
        </div>
    );
}

export default Verification;