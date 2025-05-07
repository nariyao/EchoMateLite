import { useState, useEffect } from "react";
import { IUser } from "../iProfile";
import axios from "axios";

interface UseGetUserResult {
    user: IUser | undefined;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const useGetUser = (userId: string): UseGetUserResult => {
    const [user, setUser] = useState<IUser>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/profile/${userId}`);
            console.log(await response)
            setUser(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
            console.log(user);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    return { user, loading, error, refetch: fetchUser };
};

export default useGetUser;
