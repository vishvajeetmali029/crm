import { useEffect, useState } from "react";
import API from "../services/api";

export default function Course() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        duration: "",
        fees: "",
    });

    const fetchCourses = async () => {
        const res = await API.get("/courses");
        setCourses(res.data);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreate = async () => {
        await API.post("/courses", form);
        setForm({ name: "", description: "", duration: "", fees: "" });
        fetchCourses();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Courses</h1>
                <p className="muted mt-1">
                    Create course offerings and keep fee details ready for
                    admissions.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="panel">
                    <h2 className="mb-4 text-lg font-bold">Add Course</h2>
                    <div className="grid gap-4">
                        <input
                            className="input"
                            placeholder="Course name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        <input
                            className="input"
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <input
                                className="input"
                                placeholder="Duration"
                                value={form.duration}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        duration: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="input"
                                placeholder="Fees"
                                value={form.fees}
                                onChange={(e) =>
                                    setForm({ ...form, fees: e.target.value })
                                }
                            />
                        </div>
                        <button className="btn" onClick={handleCreate}>
                            Add Course
                        </button>
                    </div>
                </div>

                <div className="grid gap-3">
                    {courses.map((course) => (
                        <article key={course._id} className="panel">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-950">
                                        {course.name}
                                    </h3>
                                    <p className="muted mt-1">
                                        {course.description || "No description"}
                                    </p>
                                </div>
                                <span className="rounded-lg bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
                                    Rs. {course.fees}
                                </span>
                            </div>
                            <p className="mt-4 text-sm font-medium text-slate-600">
                                Duration: {course.duration || "Not set"}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
