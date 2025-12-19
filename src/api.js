const API_BASE_URL = "http://localhost:8000/api";

export const apiService = {
    // Submit a new complaint
    submitComplaint: async (complaintData) => {
        const response = await fetch(`${API_BASE_URL}/complaints`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(complaintData),
        });
        if (!response.ok) throw new Error("Failed to submit complaint");
        return response.json();
    },

    // Get all complaints for admin
    getAdminComplaints: async (department = null) => {
        let url = `${API_BASE_URL}/admin/complaints`;
        if (department) {
            url += `?department=${encodeURIComponent(department)}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch complaints");
        return response.json();
    },

    // Get hourly stats
    getHourlyStats: async (department = null) => {
        let url = `${API_BASE_URL}/admin/hourly-stats`;
        if (department) {
            url += `?department=${encodeURIComponent(department)}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch hourly stats");
        return response.json();
    },

    // Send admin reply
    sendReply: async (complaintId, reply) => {
        const response = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}?reply=${encodeURIComponent(reply)}`, {
            method: "PATCH",
        });
        if (!response.ok) throw new Error("Failed to send reply");
        return response.json();
    },

    // Get AI suggested reply
    getSuggestedReply: async (complaintId) => {
        const response = await fetch(`${API_BASE_URL}/admin/suggest-reply/${complaintId}`);
        if (!response.ok) throw new Error("Failed to fetch suggested reply");
        return response.json();
    }
};
