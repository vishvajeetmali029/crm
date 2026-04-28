import { useEffect, useState } from "react";
import API from "../services/api";

export default function Batch() {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [form, setForm] = useState({
        name: "",
        course: "",
        capacity: "",
    });

    const fetchData = async () => {
        const c = await API.get("/courses");
        const b = await API.get("/batches");
        setCourses(c.data);
        setBatches(b.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createBatch = async () => {
        await API.post("/batches", form);
        setForm({ name: "", course: "", capacity: "" });
        fetchData();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Batches</h1>
                <p className="muted mt-1">
                    Organize students by course intake and capacity.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="panel">
                    <h2 className="mb-4 text-lg font-bold">Create Batch</h2>
                    <div className="grid gap-4">
                        <input
                            className="input"
                            placeholder="Batch name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <select
                            className="input"
                            value={form.course}
                            onChange={(e) =>
                                setForm({ ...form, course: e.target.value })
                            }
                        >
                            <option value="">Select course</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>

                        <input
                            className="input"
                            placeholder="Capacity"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm({ ...form, capacity: e.target.value })
                            }
                        />

                        <button className="btn" onClick={createBatch}>
                            Create Batch
                        </button>
                    </div>
                </div>

                <div className="grid gap-3">
                    {batches.map((batch) => {
                        const filled = batch.students?.length || 0;
                        const capacity = batch.capacity || 0;
                        const percent = capacity
                            ? Math.min(100, (filled / capacity) * 100)
                            : 0;

                        return (
                            <article key={batch._id} className="panel">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-950">
                                            {batch.name}
                                        </h3>
                                        <p className="muted mt-1">
                                            {batch.course?.name || "No course"}
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                                        {filled}/{capacity}
                                    </span>
                                </div>
                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-teal-500"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
