import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import store from "../store";
import { useState } from "react";

const PROFILE_ENDPOINT = "api/v1/Profile";

export default function useFetchProfile() {
  const { userInfo } = store.getState().user;
  const userId = userInfo?.user?.id;
  const [manualLoading, setManualLoading] = useState(false);
  const query = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId, // 👈 MUST
    queryFn: async () => {
      try {
        setManualLoading(true);
        const response = await api.get(PROFILE_ENDPOINT, {
          params: {
            PageName: "Profile",
            UserId: userId,
          },
        });
        return response.data.data;
      } catch (error) {
        console.log("API ERROR:", error);
        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error fetching profile";
        throw new Error(msg);
      } finally {
        setManualLoading(false);
      }
    },
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const isLoading = manualLoading || query.isLoading;

  return {
    ...query,
    isLoading,
  };
}
