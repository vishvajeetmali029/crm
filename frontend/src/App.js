import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Enquiry from "./pages/Enquiry";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Batch from "./pages/Batch";
import Student from "./pages/Student";
import Payment from "./pages/Payment";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/enquiry"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "counselor"]}>
                            <Layout>
                                <Enquiry />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "counselor",
                                "trainer",
                                "student",
                            ]}
                        >
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Layout>
                                <Course />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/batches"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "trainer"]}>
                            <Layout>
                                <Batch />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/students"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin", "counselor", "trainer"]}
                        >
                            <Layout>
                                <Student />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "counselor"]}>
                            <Layout>
                                <Payment />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
