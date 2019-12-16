import React, { useState, useEffect } from "react";

import {
  fetchFileUploadStream,
  HTML_NAIRA,
  newProductUrl,
  primaryColor,
  productUrl,
  USERACCESSCONTROL,
  USERTOKEN
} from "../../utils/data";
import {
  Notification,
  Icon,
  Select,
  Card,
  Input
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import { Table, Pagination } from "antd";

const data = (props, providers) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      logo: (
        <div className={"img-con"}>
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
      t_rev: <div dangerouslySetInnerHTML={{ __html: HTML_NAIRA + "0.00" }} />,
      t_sub_aq: 0,
      action: (
        <Icon
          style={{ color: primaryColor }}
          name={"arrowRightLight"}
          size={25}
          type={"metrize"}
          onClick={() =>
            props.history.push(`/admin/services/${item.productId}`)
          }
        />
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
    title: "Today’s Revenue",
    dataIndex: "t_rev",
    key: "t_rev"
  },
  {
    title: "Today’s Subscriber Acquisition",
    dataIndex: "t_sub_aq",
    key: "t_sub_aq"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

function Product(props) {
  const [products, setProducts] = useState([]);
  const [prodFetching, setProdFetching] = useState(true);
  const [aproveSub, setApproveSub] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("all");

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

  const updateProviders = id => {
    setProducts(
      products.filter(item => {
        if (item.productId === id) {
          item.status = "APPROVED";
        }
        return item;
      })
    );
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.products;

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

  const createNewAccountUrl = newProductUrl(localStorage.getItem(USERTOKEN));

  const getProd = (keyword = "", page, extra = null) => {
    let url = `/search?keyword=${keyword}&page=${page}&limit=10`;
    if (props.child) {
      url += `&providerId=${props.subscriber}`;
    }
    if (extra) {
      url += `&${extra}`;
    }
    axiosFunc("get", productUrl(url), null, "yes", getProducts);
  };

  const searchContent = value => {
    getProd(value, 1);
  };

  const onChangePage = page => {
    setProdFetching(true);
    getProd(searchData, page);
  };

  return (
    <div className={"category-container max-width-1200"}>
      <div>
        <br />
        <div className={"flex justify-between align-c"}>
          <div className="heading-content" style={{ marginBottom: "0" }}>
            {props.child ? (
              <span>
                {props.basicData && props.basicData.name + "'s"} Products
              </span>
            ) : (
              <span>Products</span>
            )}
          </div>
          <div className="flex align-c">
            {user_access.data.create_new && (
              <div
                className="flex align-c create-comp"
                onClick={() => (window.location.href = createNewAccountUrl)}
                style={{ marginRight: "20px", minWidth: 150 }}
              >
                <div>
                  <Icon type={"feather"} name={"plusCircle"} />
                </div>
                <div>Create New Product</div>
              </div>
            )}
            {user_access.data.filter && (
              <>
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
              </>
            )}
          </div>
        </div>
        <br />
        <br />
        {user_access.data.show_list && (
          <Card className={"padding-20"} round>
            <Table
              loading={prodFetching}
              columns={columns}
              dataSource={
                prodFetching
                  ? []
                  : data(
                      props,
                      products.data,
                      aproveSub,
                      setApproveSub,
                      updateProviders
                    )
              }
              pagination={false}
            />
            <br />
            <div className="flex justify-between align-c">
              <div />
              <Pagination
                onChange={page => onChangePage(page)}
                defaultCurrent={prodFetching ? 0 : parseInt(products.page)}
                total={prodFetching ? 0 : products.total}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Product;
