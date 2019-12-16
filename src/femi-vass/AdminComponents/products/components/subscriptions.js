import React, { useEffect, useState } from "react";
import "../Product.css";
import {
  billingUrl,
  HTML_NAIRA,
  newSubscriptionUrl,
  primaryColor
} from "../../../utils/data";
import moment from "moment";
import { axiosFunc, formatCurrency } from "../../../utils/helper";
import { Notification } from "../../../../components/common/notification";
import { errorHandler } from "../../../../components/utils/helper";
import { Button } from "../../../../components/common/button";
import Table from "antd/lib/table";
import Modal from "antd/lib/modal";
import Pagination from "antd/lib/pagination";
import { FormGroup } from "../../../../components/common/formGroup";
import { TextAreaField } from "../../../../components/common/textarea";
import { NavLink } from "react-router-dom";
import { Input } from "../../../../components/common/input";
import { Card } from "../../../../components/common/card";
import { Icon } from "../../../../components/common/icons";

const data = (props, providers, onRefund) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      created_at: moment(new Date(item.createdAt)).format("DD-MM-YYYY"),
      subscriber: item.subscriberId,
      amount: (
        <div
          style={{ color: primaryColor }}
          dangerouslySetInnerHTML={{
            __html: HTML_NAIRA + formatCurrency(item.amount || 0)
          }}
        />
      ),
      renewable: item.renewable ? "Yes" : "No",
      deactivated: item.deactivated ? "Yes" : "No",
      validity: item.validity,
      channel:
        (item.channel && item.channel.toUpperCase()) ||
        (item.type && item.type.toUpperCase()),
      action: (
        <div>
          {item.refundedAt ? (
            <span>Refunded</span>
          ) : (
            <span
              className="link"
              onClick={() => onRefund(item.subscriptionId)}
            >
              Refund
            </span>
          )}{" "}
          &nbsp; | &nbsp;
          <NavLink className="link" to={""}>
            Deactivate
          </NavLink>{" "}
          | &nbsp;
          <NavLink
            className="link"
            to={`/admin/subscriber/view/${item.subscriberId}`}
          >
            View
          </NavLink>
        </div>
      ),
      status:
        moment.unix(item.createdAt) < moment(new Date()) ? "Expired" : "Active"
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
    title: "Amount (Price/Days)", // Custom title components!
    dataIndex: "amount",
    key: "amount"
  },
  // {
  //   title: "Channel", // Custom title components!
  //   dataIndex: "channel",
  //   key: "channel"
  // },
  {
    title: "Renewable", // Custom title components!
    dataIndex: "renewable",
    key: "renewable"
  },
  {
    title: "Deactivated", // Custom title components!
    dataIndex: "deactivated",
    key: "deactivated"
  },
  {
    title: "Validity", // Custom title components!
    dataIndex: "validity",
    key: "validity"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  },
  {
    title: "Status", // Custom title components!
    dataIndex: "status",
    key: "status"
  }
];

let searchTimeOut;

function Subscriptions(props) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [activeSubId, setActiveSubId] = useState(null);
  const [searchData, setSearchData] = useState("");

  const onRefund = subId => {
    setActiveSubId(subId);
    setShowModal(true);
  };

  const onRefundComplete = (status, payload) => {
    setLoading(false);

    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation successful"
      });
      onChangePage(parseInt(subscriptions.page));
      setTimeout(() => window.location.reload(), 500);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const submitRefund = e => {
    e.preventDefault();
    setLoading(true);
    axiosFunc(
      "patch",
      billingUrl(
        `transactions/refund?subscriptionId=${activeSubId}&reason=${reason}`
      ),
      null,
      "yes",
      onRefundComplete
    );
  };

  const onFetchData = (status, payload) => {
    if (status) {
      setSubscriptions(payload.data);
      setFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  useEffect(() => {
    if (props.activeId) {
      if (props.activeId === "admin") {
        getSub(1);
      }
    } else {
      setSubscriptions(props.data);
      setFetching(props.fetching);
    }
  }, [props.fetching]);

  const getColumn = column => {
    let newColumn = column;
    if (props.extra && props.extra.hideSubscriber) {
      newColumn = column.filter(item => item.accessor !== "subscriber");
    }
    return newColumn;
  };

  const getSub = (page, keyword = "") => {
    axiosFunc(
      "get",
      newSubscriptionUrl(`search?keyword=${keyword}&page=${page}&limit=10`),
      null,
      "yes",
      onFetchData
    );
  };

  const searchContent = value => {
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => getSub(1, value), 1000);
  };

  const onChangePage = page => {
    setFetching(true);
    getSub(page);
  };
  return (
    <Card
      round
      heading={
        <div className="flex justify-between align-c">
          <div className="heading-content">Subscriptions</div>
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
            placeholder={"Search subscription..."}
          />
        </div>
      }
    >
      <Modal
        visible={showModal}
        title={"Refund Confirmation"}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <form onSubmit={submitRefund}>
          <FormGroup title="Reason">
            <TextAreaField
              onChange={e => setReason(e.target.value)}
              value={reason}
              required
              placeholder="Provide a reason for refund"
            />
          </FormGroup>
          <Button type="submit" disabled={loading} loading={loading}>
            Submit
          </Button>
        </form>
      </Modal>
      <Table
        loading={fetching}
        columns={getColumn(columns)}
        dataSource={fetching ? [] : data(props, subscriptions.data, onRefund)}
        pagination={false}
      />
      <div className="flex justify-between align-c padding-20">
        <div />
        <Pagination
          onChange={page => onChangePage(page)}
          defaultCurrent={parseInt(subscriptions.page || 1)}
          total={subscriptions.total || 1}
        />
      </div>
    </Card>
  );
}

export default Subscriptions;
