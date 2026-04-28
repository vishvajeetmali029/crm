import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getHomePath } from "../utils/auth";

export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field) => (e) => {
        setData((current) => ({
            ...current,
            [field]: e.target.value,
        }));
    };

    const handleLogin = async () => {
        setIsSubmitting(true);

        try {
            const res = await API.post("/auth/login", data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate(getHomePath(res.data.user.role));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
            <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <section>
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-400 text-lg font-black text-slate-950">
                        CM
                    </div>
                    <p className="mb-3 text-sm font-semibold uppercase text-teal-300">
                        Course Management CRM
                    </p>
                    <h1 className="max-w-2xl text-4xl font-black tracking-normal md:text-6xl">
                        Manage enquiries, batches, students and fees in one
                        calm workspace.
                    </h1>
                    <div className="mt-8 grid max-w-xl gap-3 text-sm text-slate-300 sm:grid-cols-3">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            Admissions
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            Payments
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            Batches
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/30">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-teal-700">
                                Welcome back
                            </p>
                            <h2 className="mt-1 text-2xl font-bold">Login</h2>
                        </div>
                        <Link
                            to="/register"
                            className="text-sm font-semibold text-slate-500 transition hover:text-teal-700"
                        >
                            Create account
                        </Link>
                    </div>
                    <div className="mt-6 grid gap-4">
                        <input
                            className="input"
                            placeholder="Email"
                            type="email"
                            value={data.email}
                            onChange={handleChange("email")}
                        />

                        <input
                            className="input"
                            placeholder="Password"
                            type="password"
                            value={data.password}
                            onChange={handleChange("password")}
                        />

                        <button
                            className="btn w-full"
                            onClick={handleLogin}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        New here?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-teal-700 transition hover:text-teal-800"
                        >
                            Register now
                        </Link>
                    </p>
                    <p className="mt-3 text-center text-xs text-slate-400">
                        Students can use the same login form with the email and
                        password created during student conversion.
                    </p>
                </section>
            </div>
        </div>
    );
}
