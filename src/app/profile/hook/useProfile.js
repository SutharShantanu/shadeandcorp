import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const useProfile =(userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!userId);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await axios.get(`/api/users/profile?id=${userId}`);
            setUser(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { user, isLoading: loading, error, refetch: fetchProfile };
}
