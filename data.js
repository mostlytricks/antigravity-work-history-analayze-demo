export const data = [
    // Lane 0: Main Task Line
    // Lane 1: Revision (Feature)
    // Lane 2: Hotfix/Issue Revision

    { id: "c1", lane: 0, parents: [], name: "User Auth", description: "Implement JWT Authentication", message: "Initial Project Setup", type: "task", date: "2024-01-01" },
    { id: "c2", lane: 0, parents: ["c1"], name: "User Auth", description: "Implement JWT Authentication", message: "Setup Database Schema", type: "task", date: "2024-01-02" },

    // Branch out for Revision A (Auth UI)
    { id: "c3", lane: 1, parents: ["c2"], name: "Login UI Rev", description: "Revamping the Login Screen", message: "Init Feature Branch", type: "revision", date: "2024-01-03" },
    { id: "c4", lane: 1, parents: ["c3"], name: "Login UI Rev", description: "Revamping the Login Screen", message: "Fix CSS Alignment", type: "revision", date: "2024-01-04" },

    // Issue on Main
    { id: "c5", lane: 0, parents: ["c2"], name: "User Auth", description: "Implement JWT Authentication", message: "Fix DB Timeout (Issue #101)", type: "issue", date: "2024-01-05" },

    // Merge Rev A back to Main
    { id: "c6", lane: 0, parents: ["c5", "c4"], name: "User Auth", description: "Implement JWT Authentication", message: "Merge Login UI Revision", type: "merge", date: "2024-01-06" },

    // Branch out for Revision B (Google Auth) - caused by Issue #102
    { id: "c7", lane: 2, parents: ["c6"], name: "Google OAuth", description: "Add Social Login Support", message: "Start Implementation", type: "revision", issueId: "#102", date: "2024-01-08" },
    { id: "c8", lane: 2, parents: ["c7"], name: "Google OAuth", description: "Add Social Login Support", message: "Update SDK Version", type: "revision", date: "2024-01-09" },

    { id: "c9", lane: 0, parents: ["c6"], name: "User Auth", description: "Implement JWT Authentication", message: "Update Documentation", type: "task", date: "2024-01-10" },

    // Merge Rev B
    { id: "c10", lane: 0, parents: ["c9", "c8"], name: "User Auth", description: "Implement JWT Authentication", message: "Merge Google OAuth", type: "merge", date: "2024-01-12" },

    { id: "c11", lane: 0, parents: ["c10"], name: "User Auth", description: "Implement JWT Authentication", message: "Final Polish", type: "task", date: "2024-01-13" },
];
