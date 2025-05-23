// useProfile.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export function useProfile (userId) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!userId);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/users/profile?id=${userId}`);
                setUser(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch user profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { user, isLoading: loading, error };
}
