import { useState } from "react";
import { useProjects } from "../services/queries";

const Projects = () => {
  //Demonstrate Pagination
  const [page, setPage] = useState(1);
  const { data, isError, error, isPending, isPlaceholderData, isFetching } =
    useProjects(page);

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data?.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </div>
      )}
      <span>Current page: {page}</span>{" "}
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData) {
            setPage((prev) => prev + 1);
          }
        }}
        disabled={isPlaceholderData}
      >
        Next Page
      </button>
      {isFetching ? <div>Loading...</div> : null}
    </div>
  );
};

export default Projects;
