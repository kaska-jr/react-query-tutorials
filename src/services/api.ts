// This file talks to the backend server
import axios from "axios";
import { Todo } from "../types/todo";
import { Project } from "../types/Projects";
import { Product } from "../types/Products";

const BASE_URL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const getTodosIds = async () => {
  return (await axiosInstance.get<Todo[]>("todos")).data.map((todo) => todo.id);
};

export const getTodo = async (id: number) => {
  return (await axiosInstance.get<Todo>(`todos/${id}`)).data;
};

export const createTodo = async (data: Todo) => {
  (await axiosInstance.post<Todo>("todos", data)).data;
};

export const updateTodo = async (data: Todo) => {
  (await axiosInstance.put<Todo>(`todos/${data.id}`, data)).data;
};

export const deleteTodo = async (id: number) => {
  (await axiosInstance.delete<Todo>(`todos/${id}`)).data;
};

//Demonstrate Pagination
export const getProjects = async (page = 1) => {
  return (await axiosInstance.get<Project[]>(`projects?_page=${page}&_limit=3`))
    .data;
};

//Demonstrate infinite scrolling
export const getProducts = async ({ pageParam }: { pageParam: number }) => {
  return (
    await axiosInstance.get<Product[]>(
      `products?_page=${pageParam + 1}&_limit=3`
    )
  ).data;
};

//Get single product
export const getProduct = async (id: number) => {
  return (await axiosInstance.get<Product>(`products/${id}`)).data;
};
