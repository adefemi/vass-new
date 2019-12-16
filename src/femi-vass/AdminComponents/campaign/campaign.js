import React, { useState, useEffect } from "react";
import {
  fetchFileUploadStream,
  productUrl,
  USERACCESSCONTROL
} from "../../utils/data";
import {
  Notification,
  Card,
  Input,
  Icon,
  Select
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import AllCampaigns from "./components/all-campaigns";
import { Link } from "react-router-dom";
import { Pagination, Table } from "antd";

const data = (props, providers, push) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      logo: (
        <div className="img-con">
          <img src={`${fetchFileUploadStream(item.avatar)}`} alt="" />
        </div>
      ),
      name: item.name,
      status: (
        <span
          className={`status-badge ${
            item.status.toLowerCase() === "pending" ? "pending" : "approved"
          }`}
        >
          {item.status}
        </span>
      ),
      description: (
        <span>
          {item.description.substring(0, 30)}
          {item.description.length > 30 && "..."}
        </span>
      ),
      campaigns: 0,
      action: push && (
        <>
          {item.status.toLowerCase() === "pending" ? (
            <div
              className="float-right d-flex align-c"
              style={{ color: "#999999" }}
            >
              <div>Push Campaign</div>
            </div>
          ) : (
            <Link to={`/admin/campaign/${item.productId}/new`}>
              <div className="float-right d-flex link align-c">
                <div>Push Campaign</div>
              </div>
            </Link>
          )}
        </>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "logo",
    dataIndex: "logo",
    key: "logo"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Campaigns",
    dataIndex: "campaigns",
    key: "campaigns"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

function Campaign(props) {
  const [products, setProducts] = useState([]);
  const [prodFetching, setProdFetching] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("all");

  const filtering = type => {
    setProdFetching(true);
    setFilterData(type);

    if (type !== "all") {
      let newType = type.toUpperCase();
      getProd("", 1, `status=${newType}`);
    } else {
      getProd("", 1);
    }
  };

  const searchContent = value => {
    getProd(value, 1);
  };

  const getProducts = (status, payload) => {
    if (status) {
      setProducts(payload.data);
      setProdFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: "Unable to fetch content, Try again later..."
      });
    }
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.campaigns;

  useEffect(() => {
    if (!user_access.status) {
      Notification.bubble({
        type: "error",
        content: "You don't have access to this page!!!"
      });
      props.history.goBack();
    } else {
      getProd(searchData, 1);
    }
  }, []);

  const getProd = (keyword = "", page, extra = null) => {
    let url = `/search?keyword=${keyword}&page=${page}&limit=10`;
    if (extra) {
      url += `&${extra}`;
    }
    axiosFunc("get", productUrl(url), null, "yes", getProducts);
  };

  const onChangePage = page => {
    setProdFetching(true);
    getProd(page);
  };

  return (
    <div className={"category-container max-width-1200"}>
      <div>
        <br />
        <div className={"flex justify-between align-c"}>
          <div className="content-heading" style={{ marginBottom: "0" }}>
            Campaign
          </div>
        </div>
        <br />
        <br />

        <Card round>
          <div className="tab-heading">
            {user_access.data.all_campaign && (
              <li
                className={`${activeTab === 1 && "active"}`}
                onClick={() => setActiveTab(1)}
              >
                Campaigns
              </li>
            )}
            {user_access.data.products.status && (
              <li
                className={`${activeTab === 2 && "active"}`}
                onClick={() => setActiveTab(2)}
              >
                Products
              </li>
            )}
          </div>
          <div className="tab-content">
            {user_access.data.products.status && (
              <div
                className={`tab-item ${activeTab === 2 && "active"}`}
                id={"tab-category"}
              >
                <div className="flex align-c justify-between">
                  <div />
                  <div className="flex align-c">
                    <Input
                      iconLeft={<Icon name={"search"} type={"feather"} />}
                      value={searchData}
                      onChange={e => {
                        setSearchData(e.target.value);
                        searchContent(e.target.value);
                      }}
                      placeholder={"Search product name..."}
                    />
                    <div className="padding-l-20" />
                    <Select
                      value={filterData}
                      onChange={e => filtering(e.target.value)}
                    >
                      <Select.Option value={"all"}>All</Select.Option>
                      <Select.Option value={"pending"}>Pending</Select.Option>
                      <Select.Option value={"approved"}>Approved</Select.Option>
                    </Select>
                  </div>
                </div>
                <br />
                <Table
                  loading={prodFetching}
                  columns={columns}
                  dataSource={
                    prodFetching
                      ? []
                      : data(
                          props,
                          products.data,
                          user_access.data.products.data.push_campaign
                        )
                  }
                  pagination={false}
                />
                <br />
                <div className="flex justify-between align-c">
                  <div />
                  <Pagination
                    onChange={page => onChangePage(page)}
                    defaultCurrent={prodFetching ? 1 : parseInt(products.page)}
                    total={prodFetching ? 0 : products.total}
                  />
                </div>
              </div>
            )}
            {user_access.data.all_campaign && (
              <div
                className={`tab-item ${activeTab === 1 && "active"}`}
                id={"tab-category"}
              >
                <AllCampaigns {...props} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Campaign;
