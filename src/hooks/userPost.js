import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import { useState } from "react";
import store from "../store";
const POSTCREATE_ENDPOINT = "api/v1/Posts";
const DEPARTMENT_ENDPOINT = "api/v1/Department";

export default function userPost({ SearchTerm = "" } = {}) {
  const [manualLoading, setManualLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("");
   const [SortOrder, setSortby] = useState("Newest");
  const queryClient = useQueryClient();
  const { userInfo } = store.getState().user;
  let userid = userInfo?.userId;
  let academiaId = userInfo?.academiaId;
  //  academiaId = '2';
  // 🔹 First API
  const { mutateAsync: createPost } = useMutation({
    mutationKey: ["Posts"],
    mutationFn: async (payload) => {
      try {
        console.log("$$$$$$$$$", payload);
        setManualLoading(true);
        const response = await api.post(POSTCREATE_ENDPOINT, payload);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.message?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        console.log("$$$$$$$$$", error);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
    onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
      console.log("$$$$$$$$$", "onSuccess");
      queryClient.invalidateQueries({
        queryKey: ["postsList", academiaId, page, pageSize],
      });
    },
  });

  // Second API
  //  Department Query
  const departmentQuery = useQuery({
    queryKey: ["departmentDropdown", academiaId],
    enabled: !!academiaId, // only fetch if academiaId exists
    queryFn: async () => {
      try {
        setManualLoading(true);
        const response = await api.get(DEPARTMENT_ENDPOINT, {
          params: {
            Dropdown: true,
            AcademiaId: academiaId,
          },
        });
        return response.data.data; // Adjust if your API returns differently
      } catch (error) {
        console.error("Department API error:", error);
        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error fetching departments";
        throw new Error(msg);
      } finally {
        setManualLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minute
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // 🔹 Third API
  // Posts List Query (Dynamic Pagination)
  const postsListQuery = useQuery({
    queryKey: ["postsList", academiaId, page, pageSize,SortOrder,status],
    enabled: !!academiaId,
    queryFn: async () => {
      try {
    const SORT_API_MAP = {
  Newest: 'desc',
  Oldest: 'asc',
  desc: 'desc',
  asc: 'asc',
};
const payload = {
          status: status,
        }
         // 🔥 last moment mapping]
    console.log("$$$$$$$$$", page,SORT_API_MAP[SortOrder] ?? 'desc',payload)
         
        setManualLoading(true);
        const response = await api.get("api/v1/Posts", {
          params: {
            PageName: "Posts_List",
            AcademiaId: academiaId,
            Page: page,
            SortBy:'createddate',
            PageSize: pageSize,
            SortOrder:SORT_API_MAP[SortOrder] ?? 'desc',
             FieldQuery: payload,
          },
        });
           console.log("$$$$$$$$$", response.data.data);
        return response.data.data;
      } catch (error) {
        console.error("Posts List API error:", error);
        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error fetching posts list";
        throw new Error(msg);
      } finally {
        setManualLoading(false);
      }
    },
    staleTime: 1000 * 60  * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  // 🔹Fourth Api
  const { mutateAsync: deletePost } = useMutation({
    mutationFn: async (postId) => {
      try {
        setManualLoading(true);
        const response = await api.delete(`${POSTCREATE_ENDPOINT}/${postId}`);
        return response.data;
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error deleting post";
        throw new Error(msg);
      } finally {
        setManualLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postsList", academiaId, page, pageSize],
      });
    },
  });

  // 🔹 Five API
  const postsSearchQuery = useQuery({
    queryKey: ["postsList", academiaId, SearchTerm],
    enabled: !!academiaId && SearchTerm.length > 0,
    queryFn: async () => {
      try {
        setManualLoading(true);
        const payload = {
          searchterm: SearchTerm,
        };
        console.log("$$$$$$$$$", payload);
        const response = await api.get("api/v1/Posts", {
          params: {
            PageName: "Posts_List",
            AcademiaId: academiaId,
            FieldQuery: payload,
            Page: page,
            PageSize: pageSize,
          },
        });
        console.log("$$$$$$$$$", response.data.data);
        return response.data.data;
      } catch (error) {
        console.error("Posts List API error:", error);
        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error fetching posts list";
        throw new Error(msg);
      } finally {
        setManualLoading(false);
      }
    },
    staleTime: 1000 * 60  * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });


 
  // 🔹 Six API
  // const postsStatusQuery = useQuery({
  //   queryKey: ["postsList", academiaId, status],
  //   enabled: !!academiaId && status.length > 0,
  //   queryFn: async () => {
  //     try {
  //       setManualLoading(true);
  //       const payload = {
  //         status: status,
  //       };
  //       console.log("$$$$$$$$$", payload,page);
  //       const response = await api.get("api/v1/Posts", {
  //         params: {
  //           PageName: "Posts_List",
  //           AcademiaId: academiaId,
  //           FieldQuery: payload,
  //           Page: page,
  //           PageSize: pageSize,
  //         },
  //       });
  //       console.log("$$$$$$$$$", response.data.data);
  //       return response.data.data;
  //     } catch (error) {
  //       console.error("Posts List API error:", error);
  //       const msg =
  //         error?.response?.data?.message ||
  //         error.message ||
  //         "Error fetching posts list";
  //       throw new Error(msg);
  //     } finally {
  //       setManualLoading(false);
  //     }
  //   },
  //   staleTime: 1000 * 60,
  //   cacheTime: 1000 * 60 * 5,
  //   refetchOnWindowFocus: false,
  // });


  // 🔹 Seven API
  // 🔹 Archive Post API (Reference following your Delete logic)
  const { mutateAsync: archivePost } = useMutation({
    mutationFn: async (postId) => {
      try {
        setManualLoading(true);
        // Endpoint: api/v1/Posts/{id}/archive
        const response = await api.post(
          `${POSTCREATE_ENDPOINT}/${postId}/archive`
        );
        return response.data;
      } catch (error) {
        console.error("Archive API error:", error);
        const msg =
          error?.response?.data?.message ||
          error.message ||
          "Error archiving post";
        throw new Error(msg);
      } finally {
        setManualLoading(false);
      }
    },
    onSuccess: () => {
      // 🔥 Refresh the list so the archived post disappears or updates status
      queryClient.invalidateQueries({
        queryKey: ["postsList", academiaId, page, pageSize],
      });
    },
  });

  //Update Post
  const { mutateAsync: updatePost } = useMutation({
    mutationKey: ["updatePost"],
    mutationFn: async ({ postId, formData }) => {
      try {
        console.log("&&&&&&&", formData, postId);
        setManualLoading(true);
        const response = await api.post(
          `${POSTCREATE_ENDPOINT}/${postId}`,
          formData
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.message?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        console.log("$$$$$$$$$", error);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
    onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
      console.log("$$$$$$$$$", "onSuccess");
      queryClient.invalidateQueries({
        queryKey: ["postsList", academiaId, page, pageSize],
      });
    },
  });

  return {
    isLoadingupdate: manualLoading,
    createPost,
    departmentQuery,
    postsListQuery,
    deletePost,
    postsSearchQuery,
    archivePost,
    updatePost,
    // pagination controls
    page,
    setPage,
    pageSize,
    setPageSize,
    status,
    setStatus,
    SortOrder,
    setSortby
  };
}
