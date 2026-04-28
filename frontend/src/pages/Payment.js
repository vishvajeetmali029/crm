import { useEffect, useState } from "react";
import API from "../services/api";

export default function Payment() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [payment, setPayment] = useState(null);

    const [installment, setInstallment] = useState({
        amount: "",
        method: "upi",
        note: "",
    });

    const fetchStudents = async () => {
        const res = await API.get("/students?limit=1000");
        setStudents(res.data.students || res.data || []);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchPayment = async (studentId) => {
        if (!studentId) {
            setPayment(null);
            return;
        }

        const res = await API.get(`/payments/${studentId}`);
        setPayment(res.data);
    };

    const addInstallment = async () => {
        if (!payment?._id) return;

        await API.post(`/payments/installment/${payment._id}`, {
            ...installment,
            amount: Number(installment.amount),
        });
        setInstallment({ amount: "", method: "upi", note: "" });
        fetchPayment(selectedStudent);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Payments</h1>
                <p className="muted mt-1">
                    Track fee status and add installment payments.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="panel">
                    <h2 className="mb-4 text-lg font-bold">Select Student</h2>
                    <select
                        className="input"
                        value={selectedStudent}
                        onChange={(e) => {
                            setSelectedStudent(e.target.value);
                            fetchPayment(e.target.value);
                        }}
                    >
                        <option value="">Select student</option>
                        {students.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                {payment ? (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-4">
                            {[
                                ["Total", `Rs. ${payment.totalFees}`],
                                ["Paid", `Rs. ${payment.paidAmount}`],
                                ["Due", `Rs. ${payment.dueAmount}`],
                                ["Status", payment.status],
                            ].map(([label, value]) => (
                                <div key={label} className="panel">
                                    <p className="muted">{label}</p>
                                    <h3 className="mt-2 text-xl font-black text-slate-950">
                                        {value}
                                    </h3>
                                </div>
                            ))}
                        </div>

                        <div className="panel">
                            <h2 className="mb-4 text-lg font-bold">
                                Add Installment
                            </h2>
                            <div className="grid gap-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
                                <input
                                    className="input"
                                    placeholder="Amount"
                                    value={installment.amount}
                                    onChange={(e) =>
                                        setInstallment({
                                            ...installment,
                                            amount: e.target.value,
                                        })
                                    }
                                />

                                <select
                                    className="input"
                                    value={installment.method}
                                    onChange={(e) =>
                                        setInstallment({
                                            ...installment,
                                            method: e.target.value,
                                        })
                                    }
                                >
                                    <option value="upi">UPI</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="netbanking">Netbanking</option>
                                </select>

                                <input
                                    className="input"
                                    placeholder="Note"
                                    value={installment.note}
                                    onChange={(e) =>
                                        setInstallment({
                                            ...installment,
                                            note: e.target.value,
                                        })
                                    }
                                />

                                <button className="btn" onClick={addInstallment}>
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="panel">
                            <h2 className="mb-4 text-lg font-bold">History</h2>
                            <div className="grid gap-3">
                                {payment.installments.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-950">
                                                Rs. {item.amount}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {item.note || "No note"}
                                            </p>
                                        </div>
                                        <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold uppercase text-slate-600">
                                            {item.method}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="panel flex min-h-48 items-center justify-center text-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950">
                                No payment selected
                            </h2>
                            <p className="muted mt-1">
                                Choose a student to view fee details.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
