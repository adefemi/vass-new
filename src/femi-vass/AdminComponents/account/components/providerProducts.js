import React from "react";
import Product from "../../products/Product";

function ProviderProducts(props) {
  return (
    <div>
      <Product {...props} child subscriber={props.activeSubscriber} />
    </div>
  );
}

export default ProviderProducts;
