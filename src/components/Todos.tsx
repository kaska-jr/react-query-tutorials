import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutation";
import { useTodos, useTodosIds } from "../services/queries";
import { Todo } from "../types/todo";

const Todos = () => {
  //queries
  const todosIdsQuery = useTodosIds();
  const todosQueries = useTodos(todosIdsQuery.data);

  //mutations
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit } = useForm<Todo>();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  //using the Sync mode
  // const handleDeleteSubmit = (id: number) => {
  // deleteTodoMutation.mutate(id);
  // //Us can update a state or perform other actions
  //  console.log("success");
  // };

  //using the Async mode, like performing an action when the mutation is finished
  const handleDeleteSubmit = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
    console.log("success");
  };

  if (todosIdsQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (todosIdsQuery.isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New Todo:</h4>
        <input type="text" placeholder="Title" {...register("title")} />
        <br />
        <input
          type="text"
          placeholder="description"
          {...register("description")}
        />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? "creating" : "create todo"}
        />
      </form>

      {todosIdsQuery.data?.map((id) => (
        <div key={id}>id: {id}</div>
      ))}

      <ul>
        {todosQueries.map(({ data }) => (
          <li key={data?.id}>
            <div>{data?.id}</div>
            <span>
              <strong>{data?.title}</strong>,{" "}
              <strong>{data?.description}</strong>
            </span>
            <div>
              <button
                onClick={() => handleMarkAsDoneSubmit(data)}
                disabled={updateTodoMutation.isPending}
              >
                {data?.checked ? "done" : "Mark as done"}
              </button>

              <button
                onClick={() => handleDeleteSubmit(data?.id!)}
                disabled={deleteTodoMutation.isPending}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todos;
