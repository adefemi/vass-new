import React, { useState, useEffect } from "react";
import { Icon, Notification, Card, Input } from "../../../../components/common";
import {
  contentURL,
  HTML_NAIRA,
  primaryColor,
  transactionUrl
} from "../../../utils/data";
import moment from "moment";
import { axiosFunc, formatCurrency } from "../../../utils/helper";
import { errorHandler } from "../../../../components/utils/helper";
import _empty from "lodash/isEmpty";
import { Table, Pagination } from "antd";
import { NavLink } from "react-router-dom";

const data = (props, providers, showNetwork) => {
  const newArray = [];

  if (_empty(providers) || providers.length < 1) return;

  providers.map((item, key) => {
    newArray.push({
      key,
      created_at: moment(new Date(item.createdAt)).format("DD-MM-YYYY"),
      subscriber: item.userId,
      status: (
        <span
          className={`status-badge ${
            item.status.toLowerCase() === "pending"
              ? "pending"
              : item.status.toLowerCase() === "success"
              ? "approved"
              : "failed"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
      ),
      productId: (
        <NavLink
          to={`/admin/services/${item.productId}`}
          className="text-overflow link"
        >
          {item.productId}
        </NavLink>
      ),
      transactionId: item.transactionId,
      amount: (
        <div
          style={{ color: primaryColor }}
          dangerouslySetInnerHTML={{
            __html: HTML_NAIRA + formatCurrency(item.amount)
          }}
        />
      ),
      source: item.channel,
      action: (
        <span>
          <Icon
            name={"eye"}
            type={"feather"}
            onClick={() => showNetwork(item)}
            style={{ color: primaryColor, marginRight: "20px" }}
          />
        </span>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Date Created",
    dataIndex: "created_at",
    key: "created_at"
  },
  {
    title: "Subscriber",
    dataIndex: "subscriber",
    key: "subscriber"
  },
  {
    title: "Status", // Custom title components!
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Product ID", // Custom title components!
    dataIndex: "productId",
    key: "productId"
  },
  ,
  {
    title: "Transaction ID", // Custom title components!
    dataIndex: "transactionId",
    key: "transactionId"
  },
  {
    title: "Amount", // Custom title components!
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Source", // Custom title components!
    dataIndex: "source",
    key: "source"
  }
  // {
  //   Header: "", // Custom header components!
  //   accessor: "action"
  // }
];

let searchTimeOut;

function Transactions(props) {
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [activeTransaction, setActiveTransaction] = useState({});
  const [searchData, setSearchData] = useState("");

  const onFetchData = (status, payload, type = null) => {
    if (status) {
      if (!type) {
        setTransactions(payload.data);
        setFetching(false);
      } else {
        setTransactions(payload.data);
        setFetching(false);
      }
    } else {
    }
  };

  const onSetActiveTrans = obj => {
    setActiveTransaction(obj);
  };

  useEffect(() => {
    if (props.activeId) {
      if (props.activeId === "admin") {
        getTransactions(1);
      } else {
        axiosFunc(
          "post",
          contentURL("/filter"),
          { service_id: props.activeId, type: "web" },
          null,
          onFetchData
        );
      }
    } else {
      setTransactions(props.data);
      setFetching(props.fetching);
    }
  }, [props.data]);

  const getColumn = column => {
    let newColumn = column;
    if (props.extra && props.extra.hideSubscriber) {
      newColumn = column.filter(item => item.accessor !== "subscriber");
    }
    return newColumn;
  };

  const getTransactions = (page, keyword) => {
    axiosFunc(
      "get",
      transactionUrl(null, null, "total", "data", page, keyword),
      null,
      "yes",
      onFetchData,
      "admin"
    );
  };

  const onChangePage = page => {
    setFetching(true);
    getTransactions(page);
  };

  const searchContent = value => {
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => getTransactions(1, value), 1000);
  };

  return (
    <Card
      round
      heading={
        <div className="flex justify-between align-c">
          <div className="heading-content">Transactions</div>
          <Input
            iconRight={
              <i onClick={() => searchContent(searchData)}>
                <Icon name={"search"} type={"feather"} />
              </i>
            }
            value={searchData}
            onChange={e => {
              setSearchData(e.target.value);
              searchContent(e.target.value);
            }}
            placeholder={"Search transaction..."}
          />
        </div>
      }
      className="padding-20"
    >
      <Table
        loading={fetching}
        columns={getColumn(columns)}
        dataSource={
          fetching ? [] : data(props, transactions.data, onSetActiveTrans)
        }
        pagination={false}
      />
      <br />
      <div className="flex justify-between align-c">
        <div />
        <Pagination
          onChange={page => onChangePage(page)}
          defaultCurrent={parseInt(transactions.page || 1)}
          total={transactions.total || 1}
        />
      </div>
    </Card>
  );
}

export default Transactions;
