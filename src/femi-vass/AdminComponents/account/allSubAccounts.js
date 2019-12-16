import React, { useState, useEffect } from "react";
import {
  Spinner,
  Notification,
  Card,
  Button
} from "../../../components/common";
import { primaryColor, secondaryColor, userUrl } from "../../utils/data";
import { Pagination, Table } from "antd";
import { axiosFunc } from "../../utils/helper";
import { errorHandler } from "../../../components/utils/helper";
import { Link, withRouter } from "react-router-dom";
import AppIcon from "../../../components/common/icons/Icon";

const data = (roles, props) => {
  const newArray = [];

  roles.map((item, id) => {
    newArray.push({
      key: id,
      name: item.name,
      email: item.email,
      action: { props, item }
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "x",
    render: ({ props, item }) => (
      <span
        className="link"
        onClick={() =>
          props.history.push(`/admin/account-edit/${item.subAccountId}`)
        }
      >
        Edit
      </span>
    )
  }
];

function AllSubAccounts(props) {
  const [subAccounts, setSubAccounts] = useState({
    data: [],
    fetching: true
  });
  const onFetchData = (status, payload) => {
    if (status) {
      setSubAccounts({
        data: payload.data,
        fetching: false
      });
    } else {
    }
  };

  const onChangePage = page => {
    setSubAccounts({
      fetching: true,
      data: []
    });
    getSubAccounts(page);
  };

  useEffect(() => {
    getSubAccounts(1);
  }, []);

  const getSubAccounts = page => {
    axiosFunc(
      "get",
      userUrl(`sub-accounts?page=${page}&limit=10`),
      null,
      "yes",
      onFetchData
    );
  };

  return (
    <div className="max-width-1200">
      <div className="flex align-c justify-between">
        <div className="flex align-c">
          <div className="margin-r-20">
            <AppIcon
              name="arrowLeft"
              type="feather"
              style={{ color: primaryColor }}
            />
          </div>
          <div className="heading-main" style={{ marginTop: 20 }}>
            SubAccounts
          </div>
        </div>
        <Link to="/admin/account-create">
          <Button variant="outlined">Create SubAccount</Button>
        </Link>
      </div>
      <br />
      <Card>
        {subAccounts.fetching ? (
          <div className="padding-20">
            <Spinner color={secondaryColor} />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={data(subAccounts.data.data, props)}
              pagination={false}
            />
            <br />
            <div className="flex justify-between align-c padding-20">
              <div />
              <Pagination
                onChange={page => onChangePage(page)}
                defaultCurrent={parseInt(subAccounts.data.page)}
                total={parseInt(subAccounts.data.total)}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default withRouter(AllSubAccounts);
