import React, { useState, useEffect } from "react";
import { primaryColor, productsUrl, secondaryColor } from "../../utils/data";
import {
  Spinner,
  Notification,
  Icon,
  Card,
  Input
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import ReactTable from "react-table";

const data = (props, providers) => {
  const newArray = [];

  providers.map(item => {
    newArray.push({
      logo: (
        <div className={"img-con"}>
          <img src={item.avatar} alt="" />
        </div>
      ),
      name: item.name,
      status: <span className={"status-badge"}>{item.status}</span>,
      description: (
        <span className={"text-overflow"} style={{ width: "100px" }}>
          {item.description}
        </span>
      ),
      action: (
        <Icon
          style={{ color: primaryColor }}
          name={"arrowRightCircle"}
          size={25}
          type={"feather"}
          onClick={() => alert()}
        />
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    Header: "logo",
    accessor: "logo" // String-based value accessors!
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Status",
    accessor: "status"
  },
  {
    Header: "Description",
    accessor: "description"
  },
  {
    Header: "", // Custom header components!
    accessor: "action"
  }
];

function Provider(props) {
  const [products, setProducts] = useState([]);
  const [prodFetching, setProdFetching] = useState(true);
  const [activeTab, setActiveTab] = useState(1);

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

  useEffect(() => {
    axiosFunc("get", productsUrl, null, null, getProducts);
  }, []);

  return (
    <div className={"category-container max-width-1200"}>
      {prodFetching ? (
        <Spinner color={secondaryColor} />
      ) : (
        <div>
          <br />
          <div className={"flex justify-between align-c"}>
            <div className="content-heading" style={{ marginBottom: "0" }}>
              Providers
            </div>
            <Input
              onChange={() => null}
              iconLeft={<Icon name={"search"} type={"feather"} />}
              placeholder={"Search providers"}
            />
          </div>
          <br />
          <br />

          <Card round>
            <div className="tab-heading">
              <li
                className={`${activeTab === 1 && "active"}`}
                onClick={() => setActiveTab(1)}
              >
                Service Provider
              </li>
              <li
                className={`${activeTab === 2 && "active"}`}
                onClick={() => setActiveTab(2)}
              >
                Content Provider
              </li>
            </div>

            <div className="tab-content padding-20">
              <div
                className={`tab-item ${activeTab === 1 && "active"}`}
                id={"tab-category"}
              >
                <ReactTable
                  data={data(props, products)}
                  columns={columns}
                  className={"react-table"}
                  defaultPageSize={10}
                />
              </div>
              <div
                className={`tab-item ${activeTab === 2 && "active"}`}
                id={"tab-category"}
              >
                <ReactTable
                  data={data(props, products)}
                  columns={columns}
                  className={"react-table"}
                  defaultPageSize={10}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Provider;
