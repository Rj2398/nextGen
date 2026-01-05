import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import store from "../store";
import { useState } from "react";

const ACADEMIA_ENDPOINT = "api/v1/Academia";

export default function useFetchAcademia() {
  const { userInfo } = store.getState().user;
  const userId = userInfo?.user?.id;

  const [manualLoading, setManualLoading] = useState(false);

  const query = useQuery({
    queryKey: ["academia", userId],
    enabled: !!userId, // 👈 MUST
    queryFn: async () => {
      try {
        setManualLoading(true);

        const response = await api.get(ACADEMIA_ENDPOINT, {
          params: {
            FieldQuery: JSON.stringify({ userId }),
          },
        });

        return response.data.data;
      } catch (error) {
        console.log("ACADEMIA API ERROR:", error);

        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error fetching academia";

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
