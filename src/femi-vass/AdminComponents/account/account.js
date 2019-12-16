import React, { useEffect, useState } from "react";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";
import {
  Select,
  Icon,
  Card,
  Notification,
  Input,
  Button
} from "../../../components/common";
import "./account.css";
import { axiosFunc } from "../../utils/helper";
import {
  newProviderUrl,
  primaryColor,
  providerBaseUrl,
  USERACCESSCONTROL,
  USERTOKEN
} from "../../utils/data";
import { errorHandler } from "../../../components/utils/helper";
import moment from "moment";
import cloneDeep from "clone-deep";
import SubAccount from "./subAccount";
import {Link} from "react-router-dom";

const data = (props, providers) => {
  const newArray = [];

  providers.map((item, id) => {
    newArray.push({
      key: id,
      company_name: item.name,
      application_date: moment(new Date(item.createdAt)).format("DD-MM-YYYY"),
      status: (
        <span
          className={`status-badge ${!item.status ? "pending" : "approved"}`}
        >
          {!item.status ? "PENDING" : "APPROVED"}
        </span>
      ),
      email_address: item.email,
      action: (
        <Icon
          style={{ color: primaryColor }}
          name={"arrowRightCircle"}
          size={25}
          type={"feather"}
          onClick={() => props.history.push(`account/${item.providerId}`)}
        />
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Company Name",
    dataIndex: "company_name",
    key: "company_name"
  },
  {
    title: "Application Date",
    dataIndex: "application_date",
    key: "application_date"
  },
  {
    title: "Status", // Required because our dataIndex is not a string
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Email Address", // Custom title components!
    dataIndex: "email_address",
    key: "email_address"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

function Account(props) {
  const [fetching, setFetching] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("all");
  const [product, setProduct] = useState([]);
  const [defaultProd, setDefaultProd] = useState([]);
  const [allData, setAllData] = useState({});
  const [activeTab, setActiveTab] = useState(1);

  const getProviders = (status, payload) => {
    if (status) {
      let newAccounts = payload.data.data;
      setProduct(newAccounts);
      setDefaultProd(cloneDeep(newAccounts));
      setAllData(payload.data);
      setFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const filtering = type => {
    setFetching(true);
    setFilterData(type);

    if (type !== "all") {
      let newType = false;
      if (type === "approved") {
        newType = true;
      }
      fetchProviders("", 1, `status=${newType}`);
    } else {
      fetchProviders("", 1);
    }
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.accounts.data;

  const changePage = page => {
    setFetching(true);
    fetchProviders(searchData, page);
  };

  useEffect(() => {
    fetchProviders(searchData, 1);
  }, []);

  const fetchProviders = (keyword = "", page, extra = null) => {
    let url = `/search?keyword=${keyword}&page=${page}&limit=10`;
    if (extra) {
      url += `&${extra}`;
    }
    axiosFunc("get", providerBaseUrl(url), null, "yes", getProviders);
  };

  const searchContent = value => {
    fetchProviders(value, 1);
  };

  const createNewAccountUrl = newProviderUrl(localStorage.getItem(USERTOKEN));
  return (
    <div className={"max-width-1200"}>
      <div>
        <br />
        <div className={"flex justify-between align-c"}>
          <div className="heading-content" style={{ marginBottom: "0" }}>
            {activeTab === 1 ? "Accounts" : "Create SubAccount"}
          </div>
          <div className="flex align-c">
            {user_access.create_new &&
              (activeTab === 1 && (
                <div
                  className="flex align-c create-comp"
                  onClick={() => (window.location.href = createNewAccountUrl)}
                  style={{ marginRight: "20px" }}
                >
                  <div>
                    <Icon type={"feather"} name={"plusCircle"} />
                  </div>
                  <div>Create New Account</div>
                </div>
              ))}
            {user_access.create_sub_account &&
              (activeTab === 1 ? (
                <div className="link">
                  <Link to="/admin/account-subs">
                    SubAccounts
                  </Link>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => setActiveTab(1)}>
                  Back
                </Button>
              ))}
            {user_access.filter &&
              (activeTab === 1 && (
                <>
                  <div className="padding-l-20" />
                  <Input
                    iconLeft={<Icon name={"search"} type={"feather"} />}
                    value={searchData}
                    onChange={e => {
                      setSearchData(e.target.value);
                      searchContent(e.target.value);
                    }}
                    placeholder={"Search email or company..."}
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
              ))}
          </div>
        </div>
        <br />
        <br />
        {user_access.show_list &&
          (activeTab === 1 && (
            <Card round heading="Service Provider">
              <div className="tab-content padding-20">
                <Table
                  loading={fetching}
                  columns={columns}
                  dataSource={fetching ? [] : data(props, product)}
                  pagination={false}
                />
                <br />
                <div className="flex justify-between align-c">
                  <div />
                  <Pagination
                    onChange={page => changePage(page)}
                    defaultCurrent={fetching ? 1 : parseInt(allData.page)}
                    total={allData.total}
                  />
                </div>
              </div>
            </Card>
          ))}
        {activeTab === 2 && <SubAccount {...props} inline admin />}
      </div>

      <br />
      <br />
    </div>
  );
}

export default Account;
