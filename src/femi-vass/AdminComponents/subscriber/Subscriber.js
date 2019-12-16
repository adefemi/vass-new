import React, { useEffect, useState } from "react";
import "react-table/react-table.css";
import { Card, Icon, Input, Notification } from "../../../components/common";
import "../account/account.css";
import { axiosFunc } from "../../utils/helper";
import {
  newSubscriptionUrl,
  primaryColor,
  USERACCESSCONTROL
} from "../../utils/data";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";
import { errorHandler } from "../../../components/utils/helper";

const data = (props, providers) => {
  const newArray = [];
  let sn = 1;

  providers.map((item, key) => {
    newArray.push({
      key,
      sn,
      email: item.email || "N/A",
      name: item.name || "N/A",
      phone_number: item.subscriberId || "N/A",
      action: (
        <Icon
          style={{ color: primaryColor }}
          name={"arrowRightLight"}
          size={25}
          type={"metrize"}
          onClick={() =>
            props.history.push(`/admin/subscriber/view/${item.subscriberId}`)
          }
        />
      )
    });
    sn++;
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "#",
    dataIndex: "sn",
    key: "sn"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    key: "phone_number"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

let searchTimeOut;

function Subcribers(props) {
  const [fetching, setFetching] = useState(true);
  const [providers, setProviders] = useState([]);
  const [searchData, setSearchData] = useState("");

  const getProviders = (status, payload) => {
    if (status) {
      setProviders(payload.data);
      setFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.subscribers;

  useEffect(() => {
    if (!user_access.status) {
      Notification.bubble({
        type: "error",
        content: "You don't have access to this page!!!"
      });
      props.history.goBack();
    } else {
      getSub(searchData, 1);
    }
  }, []);

  const searchContent = value => {
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => getSub(value, 1), 1000);
  };

  const getSub = (keyword = "", page) => {
    let url = `fetch?page=${page}&limit=10`;
    if (keyword) {
      url = `fetch?subscriberId=${keyword}&page=${page}&limit=10`;
    }
    axiosFunc("get", newSubscriptionUrl(url), null, "yes", getProviders);
  };

  const onChangePage = page => {
    setFetching(true);
    getSub(searchData, page);
  };

  return (
    <div className={"max-width-1200"}>
      <div>
        <br />

        <div className={"flex justify-between align-c"}>
          <div className="heading-content" style={{ marginBottom: "0" }}>
            Subscribers
          </div>
          {user_access.data.search && (
            <Input
              iconLeft={<Icon name={"search"} type={"feather"} />}
              value={searchData}
              onChange={e => {
                setSearchData(e.target.value);
                searchContent(e.target.value);
              }}
              placeholder={"Search phone number..."}
            />
          )}
        </div>
        <br />
        <br />
        <Card className={"padding-20"} round>
          <Table
            loading={fetching}
            columns={columns}
            dataSource={fetching ? [] : data(props, providers.data)}
            pagination={false}
          />
          <br />
          <div className="flex justify-between align-c">
            <div />
            <Pagination
              onChange={page => onChangePage(page)}
              defaultCurrent={fetching ? 1 : parseInt(providers.page)}
              total={fetching ? 0 : providers.total}
            />
          </div>
        </Card>
      </div>
      <br />
      <br />
    </div>
  );
}

export default Subcribers;
