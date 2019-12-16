import React, { useState, useEffect } from "react";
import { Icon } from "../../../../components/common/icons";
import {
  primaryColor,
  secondaryColor,
  contentURL,
  USERTOKEN,
  SubscriberInterfaceBaseURL
} from "../../../utils/data";
import { Spinner } from "../../../../components/common/spinner";
import moment from "moment";
import { axiosFunc } from "../../../utils/helper";
import { Table, Pagination } from "antd";
import { Card } from "../../../../components/common/card";

const data = (props, providers, productId) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      created_at: moment(new Date(item.created_at)).format("DD-MM-YYYY"),
      schedule: "21-09-2019",
      delivery: "not delivered",
      type: item.type.toUpperCase(),
      preview: item.type.toLowerCase() === "web" && (
        <a
          href={`${SubscriberInterfaceBaseURL}products/${productId}/contents/${
            item.content_id
          }?token=${localStorage.getItem(USERTOKEN)}`}
          target="_blank"
          className="link"
        >
          Preview
        </a>
      ),
      action: (
        <Icon
          style={{ color: primaryColor }}
          name={"arrowRightLight"}
          size={25}
          type={"metrize"}
          onClick={() =>
            props.history.push(
              `/admin/content/view/${item.content_id}?productId=${productId}`
            )
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
    title: "Date Created",
    dataIndex: "created_at", // String-based value accessors!
    key: "created_at" // String-based value accessors!
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Scheduled Date", // Custom header components!
    dataIndex: "schedule",
    key: "schedule"
  },
  {
    title: "Delivery Report (Sent/Delivered)", // Custom header components!
    dataIndex: "delivery",
    key: "delivery"
  },
  {
    title: "", // Custom header components!
    dataIndex: "preview",
    key: "preview"
  },
  {
    title: "", // Custom header components!
    dataIndex: "action",
    key: "action"
  }
];

function Contents(props) {
  const [contents, setContents] = useState([]);
  const [fetching, setFetching] = useState(true);

  const onFetchData = (status, payload) => {
    if (status) {
      setContents(payload.data);
      setFetching(false);
    } else {
    }
  };

  const changePage = page => {
    setFetching(true);
    axiosFunc(
      "get",
      contentURL(`?product_id=${props.id}&page=${page}&limit=10`),
      null,
      "yes",
      onFetchData
    );
  };

  useEffect(() => {
    getContents(1);
  }, [props.data]);

  const getContents = page => {
    if (props.activeId) {
      axiosFunc(
        "get",
        contentURL(`?product_id=${props.activeId}&page=${page}&limit=10`),
        null,
        "yes",
        onFetchData
      );
    } else {
      setContents(props.data);
      setFetching(props.fetching);
    }
  };

  return (
    <Card
      round
      heading={
        <div className="flex justify-between align-c">
          <div className="heading-content">Contents</div>
          <div
            className="flex align-c create-comp float-right"
            onClick={() =>
              props.history.replace(
                `/admin/services/${props.id}#create-content`
              )
            }
            style={{ marginRight: "20px" }}
          >
            <div>
              <Icon
                type={"feather"}
                name={"plusCircle"}
                style={{ color: primaryColor }}
              />
            </div>
            <div>Create New Content</div>
          </div>
        </div>
      }
    >
      {fetching ? (
        <div className="padding-20">
          <Spinner color={secondaryColor} />
        </div>
      ) : (
        <div className={"padding-20"}>
          <Table
            loading={fetching}
            columns={columns}
            dataSource={fetching ? [] : data(props, contents.data, props.id)}
            pagination={false}
          />
          <br />
          <div className="flex justify-between align-c">
            <div />

            <Pagination
              onChange={page => changePage(page)}
              current={parseInt(contents.page)}
              total={contents.total}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default Contents;
