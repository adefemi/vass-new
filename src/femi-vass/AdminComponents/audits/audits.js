import React, { useEffect, useState } from "react";
import { Card, Icon, Input, Modal } from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import { auditUrl } from "../../utils/data";
import { Pagination, Table } from "antd";
import moment from "moment";

const data = (props, providers, onView) => {
  const newArray = [];
  let sn = 1;

  providers.map((item, key) => {
    newArray.push({
      key,
      sn,
      email: item.email || "N/A",
      message:
        (
          <span>
            {item.message.substring(0, 20)}
            {item.message.length > 20 && "..."}
          </span>
        ) || "N/A",
      role: item.role || "N/A",
      service: item.service || "N/A",
      userId: item.userId || "N/A",
      time:
        moment(new Date(item.timestamp)).format("YYYY-MM-DD -- h:m a") || "N/A",
      action: item.action,
      view: (
        <span className="link" onClick={() => onView(item)}>
          view
        </span>
      )
    });
    sn++;
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    key: "time"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message"
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role"
  },
  {
    title: "Service",
    dataIndex: "service",
    key: "service"
  },

  {
    title: "",
    dataIndex: "view",
    key: "view"
  }
];

let searchTimeOut;

function Audits(props) {
  const [fetching, setFetching] = useState(true);
  const [providers, setProviders] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeAudit, setActiveAudit] = useState({});

  const getProviders = (status, payload) => {
    if (status) {
      setProviders(payload.data);
      setFetching(false);
    } else {
    }
  };

  const onView = data => {
    setActiveAudit(data);
    setShowModal(true);
  };

  useEffect(() => {
    getSub(searchData, 1);
    axiosFunc("patch", auditUrl(), null, "yes", () => null);
  }, []);

  const searchContent = value => {
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => getSub(value, 1), 1000);
  };

  const getSub = (keyword = "", page) => {
    let url = `?page=${page}&limit=10`;
    if (keyword) {
      url = `?page=${page}&keyword=${keyword}&limit=10`;
    }
    axiosFunc("get", auditUrl(url), null, "yes", getProviders);
  };

  const onChangePage = page => {
    setFetching(true);
    getSub(searchData, page);
  };

  return (
    <div className={"max-width-1200"}>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        footer={false}
        title="Audit"
      >
        <table>
          <tbody>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Action</th>
              <td>{activeAudit.action}</td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Email</th>
              <td>{activeAudit.email}</td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Message</th>
              <td>{activeAudit.message}</td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Role</th>
              <td>{activeAudit.role}</td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Service</th>
              <td>{activeAudit.service}</td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Date</th>
              <td>
                {moment(new Date(activeAudit.timestamp)).format("YYYY-MM-DD")}
              </td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>Time</th>
              <td>{moment(new Date(activeAudit.timestamp)).format("h:m a")}</td>
            </tr>
            <tr style={{ height: 40 }}>
              <th style={{ width: 100 }}>User ID</th>
              <td>{activeAudit.userId}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
      <div>
        <br />

        <div className={"flex justify-between align-c"}>
          <div className="heading-content" style={{ marginBottom: "0" }}>
            Audits
          </div>
          <Input
            iconLeft={<Icon name={"search"} type={"feather"} />}
            value={searchData}
            onChange={e => {
              setSearchData(e.target.value);
              searchContent(e.target.value);
            }}
            placeholder={"Search audits..."}
          />
        </div>
        <br />
        <br />
        <Card className={"padding-20"} round>
          <Table
            loading={fetching}
            columns={columns}
            dataSource={fetching ? [] : data(props, providers.data, onView)}
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

export default Audits;
