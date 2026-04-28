export function getStoredUser() {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch (error) {
        localStorage.removeItem("user");
        return null;
    }
}

export function getStoredToken() {
    return localStorage.getItem("token");
}

export function clearStoredAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getHomePath(role) {
    return "/dashboard";
}

export function getRoleLinks(role) {
    const common = [{ to: "/dashboard", label: "Dashboard", icon: "D" }];

    if (role === "student") {
        return common;
    }

    if (role === "trainer") {
        return [
            ...common,
            { to: "/batches", label: "Batches", icon: "B" },
            { to: "/students", label: "Students", icon: "S" },
        ];
    }

    if (role === "counselor") {
        return [
            ...common,
            { to: "/students", label: "Students", icon: "S" },
            { to: "/payments", label: "Payments", icon: "P" },
            { to: "/enquiry", label: "Enquiry", icon: "E" },
        ];
    }

    return [
        ...common,
        { to: "/courses", label: "Courses", icon: "C" },
        { to: "/batches", label: "Batches", icon: "B" },
        { to: "/students", label: "Students", icon: "S" },
        { to: "/payments", label: "Payments", icon: "P" },
        { to: "/enquiry", label: "Enquiry", icon: "E" },
    ];
}
