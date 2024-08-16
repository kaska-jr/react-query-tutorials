import { Fragment, useState } from "react";
import { useProduct, useProducts } from "../services/queries";

const Products = () => {
  //Demonstrate infinite scrolling

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const productsQuery = useProducts();

  const productQuery = useProduct(selectedProductId);

  return (
    <>
      {productsQuery.data?.pages?.map((group, index) => (
        <Fragment key={index}>
          {group.map((product) => (
            <div key={product.id}>
              <button onClick={() => setSelectedProductId(product.id)}>
                {product.name}
              </button>
            </div>
          ))}
        </Fragment>
      ))}
      <br />
      <div>
        <button
          onClick={() => productsQuery.fetchNextPage()}
          disabled={
            !productsQuery.hasNextPage || productsQuery.isFetchingNextPage
          }
        >
          {productsQuery.isFetchingNextPage
            ? "loading more..."
            : productsQuery.hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div>
        <p>selected product:</p>
        {JSON.stringify(productQuery.data)}
      </div>
    </>
  );
};

export default Products;
