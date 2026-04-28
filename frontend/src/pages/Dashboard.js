import { useEffect, useState } from "react";
import API from "../services/api";
import { getStoredUser } from "../utils/auth";

export default function Dashboard() {
    const user = getStoredUser();
    const [stats, setStats] = useState({
        students: 0,
        enquiries: 0,
        revenue: 0,
        pending: 0,
    });
    const [studentProfile, setStudentProfile] = useState(null);
    const [studentPayment, setStudentPayment] = useState(null);

    const loadStats = async () => {
        const students = await API.get("/students?limit=1000");
        const enquiries = await API.get("/enquiries");
        const studentList = students.data.students || students.data || [];

        let revenue = 0;
        let pending = 0;

        for (let s of studentList) {
            const pay = await API.get(`/payments/${s._id}`);
            if (pay.data) {
                revenue += pay.data.paidAmount || 0;
                pending += pay.data.dueAmount || 0;
            }
        }

        setStats({
            students: students.data.total || studentList.length,
            enquiries: enquiries.data.length || 0,
            revenue,
            pending,
        });
    };

    const loadStudentDashboard = async () => {
        const res = await API.get(
            `/students/profile/me?email=${encodeURIComponent(user.email)}`,
        );
        setStudentProfile(res.data);

        const payment = await API.get(`/payments/${res.data._id}`);
        setStudentPayment(payment.data);
    };

    useEffect(() => {
        if (user?.role === "student") {
            loadStudentDashboard();
            return;
        }

        loadStats();
    }, []);

    if (user?.role === "student") {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="page-title">Student Dashboard</h1>
                    <p className="muted mt-1">
                        View your course, batch and payment progress in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {[
                        [
                            "Course",
                            studentProfile?.course?.name || "Not assigned",
                            "bg-teal-50 text-teal-700",
                        ],
                        [
                            "Batch",
                            studentProfile?.batch?.name || "Not assigned",
                            "bg-indigo-50 text-indigo-700",
                        ],
                        [
                            "Status",
                            studentProfile?.status || "active",
                            "bg-amber-50 text-amber-700",
                        ],
                        [
                            "Due",
                            `Rs. ${studentPayment?.dueAmount || 0}`,
                            "bg-rose-50 text-rose-700",
                        ],
                    ].map(([label, value, tone]) => (
                        <div key={label} className="panel">
                            <div
                                className={`mb-4 inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${tone}`}
                            >
                                {label}
                            </div>
                            <h2 className="text-2xl font-black text-slate-950">
                                {value}
                            </h2>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="panel">
                        <h3 className="font-bold text-slate-950">
                            Profile Summary
                        </h3>
                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                            <p>Name: {studentProfile?.name || user.name}</p>
                            <p>Email: {studentProfile?.email || user.email}</p>
                            <p>
                                Phone: {studentProfile?.phone || "Not available"}
                            </p>
                            <p>
                                Course duration:{" "}
                                {studentProfile?.course?.duration || "Not set"}
                            </p>
                        </div>
                    </div>

                    <div className="panel">
                        <h3 className="font-bold text-slate-950">
                            Payment Summary
                        </h3>
                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                            <p>Total fees: Rs. {studentPayment?.totalFees || 0}</p>
                            <p>Paid: Rs. {studentPayment?.paidAmount || 0}</p>
                            <p>Pending: Rs. {studentPayment?.dueAmount || 0}</p>
                            <p>Status: {studentPayment?.status || "pending"}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const collectionTotal = Math.max(stats.revenue + stats.pending, 1);
    const collectionPercent = Math.min(
        100,
        (stats.revenue / collectionTotal) * 100,
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Dashboard</h1>
                <p className="muted mt-1">
                    Snapshot of admissions, collections and outstanding fees.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    ["Students", stats.students, "bg-teal-50 text-teal-700"],
                    [
                        "Revenue",
                        `Rs. ${stats.revenue}`,
                        "bg-emerald-50 text-emerald-700",
                    ],
                    [
                        "Pending",
                        `Rs. ${stats.pending}`,
                        "bg-amber-50 text-amber-700",
                    ],
                    [
                        "Enquiries",
                        stats.enquiries,
                        "bg-indigo-50 text-indigo-700",
                    ],
                ].map(([label, value, tone]) => (
                    <div key={label} className="panel">
                        <div
                            className={`mb-4 inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${tone}`}
                        >
                            {label}
                        </div>
                        <h2 className="text-3xl font-black text-slate-950">
                            {value}
                        </h2>
                        <p className="muted mt-2">Current CRM total</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                <div className="panel">
                    <h3 className="font-bold text-slate-950">
                        Collection overview
                    </h3>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-teal-500"
                            style={{ width: `${collectionPercent}%` }}
                        />
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-slate-600">
                        <span>Collected: Rs. {stats.revenue}</span>
                        <span>Pending: Rs. {stats.pending}</span>
                    </div>
                </div>
                <div className="panel bg-slate-950 text-white">
                    <p className="text-sm text-slate-300">Focus today</p>
                    <h3 className="mt-2 text-2xl font-black">
                        Follow up on open enquiries.
                    </h3>
                </div>
            </div>
        </div>
    );
}
