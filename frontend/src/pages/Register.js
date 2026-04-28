import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "counselor",
        phone: "",
        course: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        API.get("/courses")
            .then((res) => setCourses(res.data))
            .catch(() => setCourses([]));
    }, []);

    const handleChange = (field) => (e) => {
        setData((current) => ({
            ...current,
            [field]: e.target.value,
        }));
    };

    const handleRegister = async () => {
        setIsSubmitting(true);

        try {
            await API.post("/auth/register", data);
            navigate("/");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
            <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <section>
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-400 text-lg font-black text-slate-950">
                        CM
                    </div>
                    <p className="mb-3 text-sm font-semibold uppercase text-teal-300">
                        Course Management CRM
                    </p>
                    <h1 className="max-w-2xl text-4xl font-black tracking-normal md:text-6xl">
                        Set up your team account and start managing admissions
                        without the spreadsheet shuffle.
                    </h1>
                    <div className="mt-8 grid max-w-xl gap-3 text-sm text-slate-300 sm:grid-cols-3">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            Team setup
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            Daily ops
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            Fee tracking
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/30">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-teal-700">
                                New account
                            </p>
                            <h2 className="mt-1 text-2xl font-bold">
                                Register
                            </h2>
                        </div>
                        <Link
                            to="/"
                            className="text-sm font-semibold text-slate-500 transition hover:text-teal-700"
                        >
                            Back to login
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-4">
                        <input
                            className="input"
                            placeholder="Full name"
                            value={data.name}
                            onChange={handleChange("name")}
                        />

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

                        <select
                            className="input"
                            value={data.role}
                            onChange={handleChange("role")}
                        >
                            <option value="admin">Admin</option>
                            <option value="counselor">Counselor</option>
                            <option value="trainer">Trainer</option>
                            <option value="student">Student</option>
                        </select>

                        {data.role === "student" ? (
                            <>
                                <input
                                    className="input"
                                    placeholder="Phone"
                                    value={data.phone}
                                    onChange={handleChange("phone")}
                                />

                                <select
                                    className="input"
                                    value={data.course}
                                    onChange={handleChange("course")}
                                >
                                    <option value="">Select course</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course._id}
                                            value={course._id}
                                        >
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : null}

                        <button
                            className="btn w-full"
                            onClick={handleRegister}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Register"}
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="font-semibold text-teal-700 transition hover:text-teal-800"
                        >
                            Login here
                        </Link>
                    </p>
                    <p className="mt-3 text-center text-xs text-slate-400">
                        Students register with course and phone details. Team
                        roles only see workspace fields they actually need.
                    </p>
                </section>
            </div>
        </div>
    );
}
