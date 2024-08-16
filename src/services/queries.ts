import {
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getProduct, getProducts, getProjects, getTodosIds } from "./api";
import { getTodo } from "./api";
import { Product } from "../types/Products";

// Demonstrate query function
export const useTodosIds = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodosIds,
  });
};

// Demonstrate query function with dynamic keys and multiple queries
export const useTodos = (ids: (number | undefined)[] | undefined) => {
  return useQueries({
    queries: (ids ?? [])?.map((id) => ({
      queryKey: ["todo", { id }], //its better to put dynamic keys in cury braces
      queryFn: () => getTodo(id!),
    })),
  });
};

//Demonstrate Pagination
export const useProjects = (page: number) => {
  return useQuery({
    queryKey: ["projects", { page }],
    queryFn: () => getProjects(page),
    placeholderData: keepPreviousData, // keeping the previous data until the query is finished and the new data is fetched.
  });
};

//Demonstrate infinite scrolling
export const useProducts = () => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 0 }) => getProducts({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
};

export const useProduct = (id: number | null) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    placeholderData: () => {
      const cachedProducts = (
        queryClient.getQueryData(["product", { id }]) as {
          pages: Product[] | undefined;
        }
      )?.pages?.flat(2);
      if (cachedProducts) {
        return cachedProducts.find((item) => item.id === id);
      }
    },
  });
};
