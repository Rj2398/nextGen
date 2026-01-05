import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import { useState } from "react";
import store from "../store";

const PROFILE_ENDPOINT = "api/v1/Profile";
const UPDATE_PROFILE_ENDPOINT = "api/v1/Profile/user";

export default function useProfile() {
  const { userInfo } = store.getState().user;
  const userId = userInfo?.user?.id;

  const queryClient = useQueryClient();

  const [manualLoading, setManualLoading] = useState(false);

  // ================= FETCH PROFILE =================
  const query = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
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
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  // ================= UPDATE PROFILE =================
  const { mutateAsync: updatProfile } = useMutation({
    mutationKey: ["Profile/user", "user"],
    mutationFn: async payload => {
      try {
        console.log("$$$$$$$$$", payload);
        setManualLoading(true);
        const response = await api.put(UPDATE_PROFILE_ENDPOINT, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("$$$$$$$$$", response);
        const { data } = response;
        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage = error.message || "An unknown error occurred";
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
    onSuccess: () => {
      console.log("$$$$$$$$$", "onSuccess");
      queryClient.invalidateQueries({
         queryKey: ["profile", userId],
      });
    },
  });

  const isLoading = manualLoading || query.isLoading;

  return {
    ...query,
    isLoading,
    updatProfile,
  };
}
