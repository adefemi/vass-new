import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Icon,
  Notification,
  FormGroup,
  TextAreaField,
  Card,
  Modal
} from "../../../../components/common";
import { axiosFunc } from "../../../utils/helper";
import { whiteListUrl } from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";

function TabDnd(props) {
  const [data, setData] = useState({
    type: "DND",
    numbers: ""
  });

  const [file, setFile] = useState(null);

  const [checker, setChecker] = useState(true);
  const [loading, setLoading] = useState(false);

  const onFileChange = e => {
    setFile(e.target.files[0]);
  };

  const onSubmit = (status, payload) => {
    setLoading(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation Successful"
      });
      setData({
        type: "DND",
        numbers: ""
      });
      setFile(null);
      props.setTrigger(true);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const submit = e => {
    e.preventDefault();
    let newData = data;

    if (!checker) {
      newData = new FormData();
      newData.append("type", data.type);
      newData.append("phoneNumbers", file);
    } else {
      newData = {
        type: data.type,
        phoneNumbers: data.numbers.split(",")
      };
    }

    setLoading(true);
    axiosFunc("post", whiteListUrl(), newData, "yes", onSubmit);
  };

  return (
    <React.Fragment>
      <div className="max-width-600">
        <FormGroup title="Type">
          <Select
            value={data.type}
            name="type"
            onChange={e => setData({ ...data, type: e.target.value })}
          >
            <Select.Option value="DND">DND</Select.Option>
            <Select.Option value="DNC">DNC</Select.Option>
          </Select>
        </FormGroup>

        <div className="tab-heading">
          <li
            className={`${checker && "active"}`}
            onClick={() => setChecker(true)}
          >
            Enter
          </li>
          <li
            className={`${!checker && "active"}`}
            onClick={() => setChecker(false)}
          >
            Upload
          </li>
        </div>
        <br />

        <form onSubmit={submit}>
          <FormGroup title="Phone Numbers">
            {checker ? (
              <TextAreaField
                value={data.numbers}
                name="numbers"
                required
                onChange={e => setData({ ...data, numbers: e.target.value })}
              />
            ) : (
              <div>
                <small>
                  Upload csv file containing phone numbers to be blacklisted
                </small>
                <br />
                <input required type="file" onChange={onFileChange} />
              </div>
            )}
          </FormGroup>
          <br />
          <br />
          <Button type="submit" loading={loading} disabled={loading}>
            Update
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}

const data = (providers, unblock) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      number: item.phoneNumber,
      type: item.type,
      action: (
        <span
          className="link"
          onClick={() => unblock(item.id, item.phoneNumber)}
        >
          Whitelist
        </span>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Number",
    dataIndex: "number",
    key: "number"
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action"
  }
];

export const BlackListed = props => {
  let searchTimeout = null;

  const [fetching, setFetching] = useState(true);
  const [whiteLists, setWhiteLists] = useState([]);
  const [searchData, setSearchData] = useState("");

  const onFetchData = (status, payload) => {
    if (status) {
      setWhiteLists(payload.data.data);
      setFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const onDelete = (status, payload) => {
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation successful"
      });
      props.setTrigger(true);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const removeBlocked = id => {
    let newWishList = whiteLists.data.filter(item => item.id !== id);
    setWhiteLists({
      ...whiteLists,
      newWishList
    });
    axiosFunc("DELETE", whiteListUrl(`?id=${id}`), null, "yes", onDelete);
  };

  const unBlockRequest = (id, phone) => {
    Modal.confirm({
      content: `Sure to whitelist ${phone}`,
      onOK: () => removeBlocked(id)
    });
  };

  useEffect(() => {
    getWhite(1);
  }, []);

  useEffect(() => {
    if (props.trigger) {
      setFetching(true);
      getWhite(1);
      props.setTrigger(false);
    }
  }, [props.trigger]);

  const filtering = type => {
    if(type.toLowerCase() === "all"){
      getWhite(1, `${searchData ? `&keyword=${searchData}`: ""}`)
    }
    else{
      getWhite(1, `&type=${type}${searchData ? `&keyword=${searchData}`: ""}`)
    }

  };

  const searchContent = value => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      getWhite(1, `&keyword=${value}`)
    }, 500)
  };

  const getWhite = (page, extra="") => {
    axiosFunc(
      "get",
      whiteListUrl(`?page=${page}&limit=10${extra}`),
      null,
      "yes",
      onFetchData
    );
  };

  const onChangePage = page => {
    setFetching(true);
    getWhite(page, `${searchData ? `&keyword=${searchData}`: ""}`);
  }

  return (
    <React.Fragment>
      <br />
      <br />
      <Card
        round
        heading={
          <div className="flex justify-between align-c">
            <div>Blacklisted Accounts</div>

            <div style={{ width: "300px" }} className="flex align-c">
              <Select
                value="All"
                style={{ width: "100px" }}
                className="padding-0"
                onChange={e => filtering(e.target.value)}
              >
                <Select.Option value="All">All</Select.Option>
                <Select.Option value="DND">DND</Select.Option>
                <Select.Option value="DNC">DNC</Select.Option>
              </Select>
              <Input
                style={{ marginLeft: "10px" }}
                value={searchData}
                placeholder={"search"}
                iconRight={<Icon name="search" type="feather" />}
                onChange={e => {
                  setSearchData(e.target.value);
                  searchContent(e.target.value);
                }}
              />
            </div>
          </div>
        }
      >
        <div className="padding-20">
          <Table
            loading={fetching}
            columns={columns}
            dataSource={fetching ? [] : data(whiteLists.data, unBlockRequest)}
            pagination={false}
          />
          <br />
          <div className="flex justify-between align-c">
            <div />
            <Pagination
              onChange={page => onChangePage(page)}
              defaultCurrent={fetching ? 1 : parseInt(whiteLists.page)}
              total={fetching ? 0 : whiteLists.total}
            />
          </div>
        </div>
      </Card>
      <br />
      <br />
    </React.Fragment>
  );
};

export default TabDnd;
