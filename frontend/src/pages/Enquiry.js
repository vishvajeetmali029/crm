import { useEffect, useState } from "react";
import API from "../services/api";

export default function Enquiry() {
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        courseInterested: "",
    });
    const [courses, setCourses] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadEnquiries = async () => {
        const res = await API.get("/enquiries");
        setEnquiries(res.data);
    };

    const loadCourses = async () => {
        const res = await API.get("/courses");
        setCourses(res.data);
    };

    useEffect(() => {
        loadEnquiries();
        loadCourses();
    }, []);

    const handleSubmit = async () => {
        await API.post("/enquiries", data);
        setData({
            name: "",
            email: "",
            phone: "",
            courseInterested: "",
        });
        alert("Enquiry Added");
        loadEnquiries();
    };

    const handleConvert = async (id) => {
        setLoading(true);

        try {
            const res = await API.post(`/students/convert/${id}`);
            alert(
                `Student created. Login email: ${res.data.login.email} | Password: ${res.data.login.password}`,
            );
            loadEnquiries();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Enquiries</h1>
                <p className="muted mt-1">
                    Capture leads, then convert them into students when they enroll.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="panel">
                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            className="input"
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                        />

                        <input
                            className="input"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                        />

                        <input
                            className="input"
                            placeholder="Phone"
                            value={data.phone}
                            onChange={(e) =>
                                setData({ ...data, phone: e.target.value })
                            }
                        />

                        <select
                            className="input"
                            value={data.courseInterested}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    courseInterested: e.target.value,
                                })
                            }
                        >
                            <option value="">Select course</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course.name}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn mt-5 w-full md:w-auto" onClick={handleSubmit}>
                        Submit Enquiry
                    </button>
                </div>

                <div className="grid gap-3">
                    {enquiries.map((enquiry) => (
                        <article key={enquiry._id} className="panel">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-950">
                                        {enquiry.name}
                                    </h3>
                                    <p className="muted mt-1">{enquiry.email}</p>
                                </div>
                                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                                    {enquiry.status}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                <p>Phone: {enquiry.phone || "Not available"}</p>
                                <p>
                                    Interested course:{" "}
                                    {enquiry.courseInterested || "Not selected"}
                                </p>
                            </div>

                            <button
                                className="btn mt-4"
                                onClick={() => handleConvert(enquiry._id)}
                                disabled={
                                    loading || enquiry.status === "converted"
                                }
                            >
                                {enquiry.status === "converted"
                                    ? "Converted"
                                    : "Convert to Student"}
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
