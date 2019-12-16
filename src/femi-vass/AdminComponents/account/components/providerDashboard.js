import React from "react";
import ProductView from "../../products/productView";

function ProviderDashboard(props) {
  return (
    <div>
      <ProductView
        {...props}
        hasSub
        subscriber={props.activeSubscriber}
        basicData={props.basicData}
      />
    </div>
  );
}

export default ProviderDashboard;
