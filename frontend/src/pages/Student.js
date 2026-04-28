import { useCallback, useEffect, useState } from "react";
import API from "../services/api";

export default function Student() {
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [batchFilter, setBatchFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = useCallback(async () => {
        const res = await API.get(`/students?page=${page}&limit=10`);
        setStudents(res.data.students || []);
        setTotalPages(res.data.totalPages || 1);

        const b = await API.get("/batches");
        setBatches(b.data);
    }, [page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const assignBatch = async (studentId, batchId) => {
        if (!batchId) return;

        await API.post("/batches/assign", { studentId, batchId });
        fetchData();
    };

    const filteredStudents = students.filter((student) => {
        const matchSearch = student.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchStatus = statusFilter
            ? student.status === statusFilter
            : true;
        const matchCourse = courseFilter
            ? student.course?._id === courseFilter
            : true;
        const matchBatch = batchFilter ? student.batch?._id === batchFilter : true;

        return matchSearch && matchStatus && matchCourse && matchBatch;
    });

    const courses = students
        .map((student) => student.course)
        .filter(Boolean)
        .filter(
            (course, index, list) =>
                list.findIndex((item) => item._id === course._id) === index,
        );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Students</h1>
                <p className="muted mt-1">
                    Search learners, review status and assign them to batches.
                </p>
            </div>

            <div className="panel">
                <div className="grid gap-3 md:grid-cols-4">
                    <input
                        className="input"
                        placeholder="Search by name"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="input"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </select>

                    <select
                        className="input"
                        onChange={(e) => setCourseFilter(e.target.value)}
                    >
                        <option value="">All courses</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="input"
                        onChange={(e) => setBatchFilter(e.target.value)}
                    >
                        <option value="">All batches</option>
                        {batches.map((batch) => (
                            <option key={batch._id} value={batch._id}>
                                {batch.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredStudents.map((student) => (
                    <article key={student._id} className="panel">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-slate-950">
                                    {student.name}
                                </h3>
                                <p className="muted mt-1">{student.email}</p>
                            </div>
                            <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold uppercase text-teal-700">
                                {student.status}
                            </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                            <p>Course: {student.course?.name || "Not assigned"}</p>
                            <p>Batch: {student.batch?.name || "Not assigned"}</p>
                            <p>Phone: {student.phone || "Not available"}</p>
                        </div>

                        <select
                            className="input mt-4"
                            value={student.batch?._id || ""}
                            onChange={(e) =>
                                assignBatch(student._id, e.target.value)
                            }
                        >
                            <option value="">Assign batch</option>
                            {batches.map((batch) => (
                                <option key={batch._id} value={batch._id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                    </article>
                ))}
            </div>

            <div className="flex items-center justify-center gap-3">
                <button
                    className="btn-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    Page {page} / {totalPages}
                </span>

                <button
                    className="btn-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
