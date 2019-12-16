import React, { useState, useEffect } from "react";
import { Add } from "../../components/common/customIcon";

import { productsUrl, primaryColor, secondaryColor } from "../utils/data";
import { NavLink } from "react-router-dom";
import { Spinner, Notification, Icon, DropDown } from "../../components/common";
import { axiosFunc } from "../utils/helper";

function ServiceContent(props) {
  const [products, setProducts] = useState([]);
  const [prodFetching, setProdFetching] = useState(true);

  const getProducts = (status, payload) => {
    if (status) {
      setProdFetching(false);
      setProducts(payload.data.data);
    } else {
      Notification.bubble({
        type: "error",
        content: "Unable to fetch content, Try again later..."
      });
    }
  };

  const editProduct = productID => {
    props.history.push(`services/${productID}`);
  };

  useEffect(() => {
    axiosFunc("get", productsUrl, null, null, getProducts);
  }, []);

  return (
    <div className={"category-container max-width-1200"}>
      <br />
      <br />
      <div className="flex justify-content-between align-c">
        <div className="content-heading">Products</div>
        <NavLink to={"#"}>
          <div className={"flex align-c c-pointer"}>
            <Add size={"18px"} color={primaryColor} /> &nbsp;{" "}
            <span className={"add-content"}>Add Product</span>
          </div>
        </NavLink>
      </div>

      <div className={"content-inner"}>
        <br />
        <br />

        {prodFetching ? (
          <Spinner color={secondaryColor} />
        ) : (
          <div className={"product-container flex flew-wrap"}>
            {products.length < 1 ? (
              <h3>No Content found...</h3>
            ) : (
              products.map((item, key) => (
                <div key={key} className={"product-item"}>
                  <div className={"content-box"}>
                    <button>
                      <DropDown
                        static={true}
                        staticContent={true}
                        options={[
                          {
                            content: (
                              <span
                                onClick={() => editProduct(item.providerId)}
                              >
                                Edit Product
                              </span>
                            )
                          },
                          {
                            content: <span>Delete Product</span>
                          }
                        ]}
                        dropDownWidth={"200px"}
                      >
                        <Icon
                          name={"moreHorizontal"}
                          type={"feather"}
                          size={25}
                        />
                      </DropDown>
                    </button>

                    <img src={item.avatar} alt="" />
                  </div>
                  <div className="content">
                    <div className={"flex align-c content-head"}>
                      <span>{item.name}</span>{" "}
                      <div className="status">{item.status}</div>
                    </div>

                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceContent;
