import React, { useState, useEffect } from "react";
import { campaignURL, primaryColor } from "../../../utils/data";
import { Icon, Input, Select } from "../../../../components/common";
import { axiosFunc } from "../../../utils/helper";
import moment from "moment";
import { Pagination, Table } from "antd";
import { NavLink } from "react-router-dom";

const data = (props, providers) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      title: (
        <span>
          {item.title.substring(0, 30)}
          {item.title.length > 30 && "..."}
        </span>
      ),
      status: (
        <span
          className={`status-badge ${
            item.status.toLowerCase() === "pending" ? "pending" : "approved"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
      ),
      description: (
        <span>
          {item.message.substring(0, 30)}
          {item.message.length > 30 && "..."}
        </span>
      ),
      subscribers: item.phoneNumbers.length,
      created: moment(new Date(item.createdAt)).format("MMMM DD, YYYY"),
      action: (
        <>
          <span>
            <Icon
              style={{ color: primaryColor }}
              name={"arrowRightLight"}
              size={25}
              type={"metrize"}
              onClick={() =>
                props.history.push(`/admin/campaign/view/${item.campaignId}`)
              }
            />{" "}
            |{" "}
            <NavLink
              to={`/admin/campaign/${item.productId}/new?campaignId=${item.campaignId}`}
              className="link"
            >
              Duplicate
            </NavLink>
          </span>
        </>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
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
    title: "Subscribers",
    dataIndex: "subscribers",
    key: "subscribers"
  },
  {
    title: "Created",
    dataIndex: "created",
    key: "created"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

function AllCampaigns(props) {
  const [compaign, setCampaign] = useState({ content: [], fetching: true });
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("all");

  const filtering = type => {
    setCampaign({
      fetching: true,
      data: []
    });
    setFilterData(type);

    if (type !== "all") {
      let newType = type.toLowerCase();
      getCamp("", 1, `status=${newType}`);
    } else {
      getCamp("", 1);
    }
  };

  const searchContent = value => {
    getCamp(value, 1);
  };

  const onFetchData = (status, payload) => {
    if (status) {
      setCampaign({
        content: payload.data,
        fetching: false
      });
    } else {
    }
  };

  useEffect(() => {
    getCamp(searchData, 1);
  }, []);

  const getCamp = (keyword = "", page, extra = null) => {
    let url = `search?keyword=${keyword}&page=${page}&limit=10`;
    if (extra) {
      url += `&${extra}`;
    }
    axiosFunc("get", campaignURL(url), null, "yes", onFetchData);
  };

  const onChangePage = page => {
    setCampaign({
      fetching: true,
      data: []
    });
    getCamp(searchData, page);
  };

  return (
    <div>
      <div>
        <div className="flex justify-between align-c">
          <div />
          <div className="flex align-c">
            <Input
              iconLeft={<Icon name={"search"} type={"feather"} />}
              value={searchData}
              onChange={e => {
                setSearchData(e.target.value);
                searchContent(e.target.value);
              }}
              placeholder={"Search campaign title..."}
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
          loading={compaign.fetching}
          columns={columns}
          dataSource={
            compaign.fetching ? [] : data(props, compaign.content.data)
          }
          pagination={false}
        />
        <br />
        <div className="flex justify-between align-c">
          <div />
          <Pagination
            onChange={page => onChangePage(page)}
            defaultCurrent={
              compaign.fetching ? 1 : parseInt(compaign.content.page)
            }
            total={compaign.fetching ? 0 : compaign.content.total}
          />
        </div>
      </div>
    </div>
  );
}

export default AllCampaigns;
