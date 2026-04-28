import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    clearStoredAuth,
    getRoleLinks,
    getStoredUser,
} from "../utils/auth";

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getStoredUser();

    const links = getRoleLinks(user?.role);

    const handleLogout = () => {
        clearStoredAuth();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-100 lg:flex">
            <aside className="bg-slate-950 text-white lg:fixed lg:inset-y-0 lg:w-72">
                <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500 font-bold text-slate-950">
                        CM
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Course CRM</h1>
                        <p className="text-xs text-slate-400">
                            {user?.role === "student"
                                ? "Student portal"
                                : `${user?.role || "admin"} workspace`}
                        </p>
                    </div>
                </div>

                <nav className="grid gap-1 px-3 py-5">
                    {links.map((link) => {
                        const active = location.pathname === link.to;

                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    active
                                        ? "bg-white text-slate-950 shadow-sm"
                                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                                        active
                                            ? "bg-teal-100 text-teal-700"
                                            : "bg-white/10 text-slate-300"
                                    }`}
                                >
                                    {link.icon}
                                </span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <main className="min-h-screen flex-1 lg:pl-72">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase text-teal-700">
                                CRM workspace
                            </p>
                            <h2 className="text-lg font-bold text-slate-950">
                                {user?.name || "Dashboard"}
                            </h2>
                        </div>
                        <button className="btn-secondary" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <div className="px-4 py-6 md:px-8">{children}</div>
            </main>
        </div>
    );
}
