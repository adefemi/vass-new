import React, { useState, useEffect } from "react";
import { Card } from "../../../components/common/card";
import { Spinner } from "../../../components/common/spinner";
import { axiosFunc } from "../../utils/helper";
import {
  notificationUrl,
  primaryColor,
  secondaryColor
} from "../../utils/data";
import { Notification } from "../../../components/common/notification";
import { errorHandler } from "../../../components/utils/helper";
import ReactTable from "react-table";
import moment from "moment";
import { Icon } from "../../../components/common/icons";
import { DateRangePicker } from "react-dates";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import _empty from "lodash/isEmpty";
import { NavLink } from "react-router-dom";
import qs from "query-string";

const newDate = new Date();

const ChartDataRev = data => {
  if (_empty(data) || data.length < 1) return;
  let retData = [];
  data.success &&
    data.success.map(item => {
      retData.push({
        name: moment(item.date, "YYYY-MM-DD").format("MMMM DD"),
        sent: item.count
      });
      return null;
    });

  data.pending &&
    data.pending.map(item => {
      retData.push({
        name: moment(item.date, "YYYY-MM-DD").format("MMMM DD"),
        pending: item.count
      });
      return null;
    });

  data.failed &&
    data.failed.map(item => {
      retData.push({
        name: moment(item.date, "YYYY-MM-DD").format("MMMM DD"),
        failed: item.count
      });
      return null;
    });
  return retData;
};

const data = items => {
  const newArray = [];

  items.map(item => {
    newArray.push({
      recipient: item.recipient,
      smsc: item.smsc,
      sender: item.sender,
      message: item.message,
      productId: <span className="text-overflow">{item.message}</span>,
      status: (
        <span
          className={`status-badge ${
            item.status.toLowerCase() === "pending" ? "pending" : "approved"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    Header: "Recipients",
    accessor: "recipient"
  },
  {
    Header: "Status",
    accessor: "status"
  },
  {
    Header: "SMSC",
    accessor: "smsc"
  },
  {
    Header: "Sender",
    accessor: "sender"
  },
  {
    Header: "ProductID",
    accessor: "productId"
  },
  {
    Header: "Message",
    accessor: "message"
  }
];

function SingleContent(props) {
  const getActiveProduct = () => {
    let query = qs.parse(props.location.search);
    return query.productId;
  };

  const [activeContent] = useState(props.match.params.slug);

  const [activeProduct] = useState(getActiveProduct());
  const [totalMessage, setTotalMessage] = useState({
    data: 0,
    fetching: true
  });
  const [log, setLog] = useState({
    data: [],
    fetching: true
  });
  const [sent, setSent] = useState({
    data: 0,
    fetching: true
  });
  const [pending, setPending] = useState({
    data: 0,
    fetching: true
  });
  const [failed, setFailed] = useState({
    data: 0,
    fetching: true
  });
  const [messageChart, setMessageChart] = useState({
    data: 0,
    fetching: true
  });

  const [dates, setDate] = useState({
    startDate: moment(newDate.setDate(newDate.getDate() - 1)),
    endDate: moment(new Date())
  });

  const [focus, setFocus] = useState(null);

  const onFetchData = (status, payload, _type) => {
    if (status) {
      let activeData = payload.data.data;
      if (_type === "totalMessage") {
        setTotalMessage({
          data: activeData,
          fetching: false
        });
      } else if (_type === "sent") {
        setSent({
          data: activeData,
          fetching: false
        });
      } else if (_type === "pending") {
        setPending({
          data: activeData,
          fetching: false
        });
      } else if (_type === "failed") {
        setFailed({
          data: activeData,
          fetching: false
        });
      } else if (_type === "log") {
        setLog({
          data: activeData,
          fetching: false
        });
      } else if (_type === "messageChart") {
        setMessageChart({
          data: activeData,
          fetching: false
        });
      }
    } else {
    }
  };

  useEffect(() => {
    axiosFunc(
      "get",
      notificationUrl(
        `notification/sms/query?contentId=${activeContent}&type=content&dataType=count`
      ),
      null,
      "yes",
      onFetchData,
      "totalMessage"
    );
    axiosFunc(
      "get",
      notificationUrl(
        `notification/sms/query?type=content&dataType=count&status=success&contentId=${activeContent}`
      ),
      null,
      "yes",
      onFetchData,
      "sent"
    );
    axiosFunc(
      "get",
      notificationUrl(
        `notification/sms/query?type=content&dataType=count&status=pending&contentId=${activeContent}`
      ),
      null,
      "yes",
      onFetchData,
      "pending"
    );
    axiosFunc(
      "get",
      notificationUrl(
        `notification/sms/query?type=content&dataType=count&status=failed&contentId=${activeContent}`
      ),
      null,
      "yes",
      onFetchData,
      "failed"
    );
    axiosFunc(
      "get",
      notificationUrl(
        `notification/sms/query?contentId=${activeContent}&type=content&dataType=data`
      ),
      null,
      "yes",
      onFetchData,
      "log"
    );
    getSubData();
  }, []);

  const getSubData = (type = "new", newStartDate, newEndDate) => {
    let startDate = dates.startDate;
    let endDate = dates.endDate;

    if (type === "refresh") {
      setMessageChart({
        ...messageChart,
        fetching: true
      });

      startDate = newStartDate;
      endDate = newEndDate;
    }

    if (!startDate || !endDate) {
      Notification.bubble({
        type: "error",
        content: "Both start-date and end-date are required"
      });
      return;
    }

    axiosFunc(
      "get",
      notificationUrl(
        `notification/sms/aggregate?type=content&contentId=${activeContent}&stepType=day&dateFrom=${dates.startDate.format(
          "YYYY-MM-DD"
        )}&dateTo=${dates.endDate.format("YYYY-MM-DD")}`
      ),
      null,
      "yes",
      onFetchData,
      "messageChart"
    );
  };

  return (
    <div className={"category-container max-width-1200"}>
      <React.Fragment>
        <div className="flex align-c justify-between">
          <div className="link" onClick={() => props.history.goBack()}>
            <Icon name="chevronLeft" type="feather" /> Back{" "}
          </div>
          <NavLink
            className="link"
            to={`/admin/content/edit/${activeProduct}?contentId=${activeContent}`}
          >
            Edit Content
          </NavLink>
        </div>

        <br />
        <div className={"grid-4"}>
          <Card
            round
            className={"productCardInfo"}
            style={{ backgroundColor: "#e6b2ff", color: "white" }}
          >
            <div className={"title"}>Total Messages</div>
            <div className="inner-content">
              {totalMessage.fetching ? (
                <Spinner />
              ) : (
                <div className="mainFig">{totalMessage.data}</div>
              )}
            </div>
          </Card>
          <Card
            round
            className={"productCardInfo"}
            style={{ backgroundColor: "#0bc733", color: "white" }}
          >
            <div className={"title"}>Sent</div>
            <div className="inner-content">
              {sent.fetching ? (
                <Spinner />
              ) : (
                <div className="mainFig">{sent.data}</div>
              )}
            </div>
          </Card>
          <Card
            round
            className={"productCardInfo"}
            style={{ backgroundColor: "#ff7675", color: "white" }}
          >
            <div className={"title"}>Failed</div>
            <div className="inner-content">
              {failed.fetching ? (
                <Spinner />
              ) : (
                <div className="mainFig">{failed.data}</div>
              )}
            </div>
          </Card>
          <Card
            round
            className={"productCardInfo"}
            style={{ backgroundColor: "#6776ff", color: "white" }}
          >
            <div className={"title"}>Pending</div>
            <div className="inner-content">
              {pending.fetching ? (
                <Spinner />
              ) : (
                <div className="mainFig">{pending.data}</div>
              )}
            </div>
          </Card>
        </div>
        <br />
        <br />
        <Card round>
          <div className="padding-20 flex align-c">
            <Icon
              name={"ic_sort"}
              type={"md"}
              style={{ marginBottom: "5px" }}
            />
            <div style={{ paddingLeft: "3px" }} />
            <span>Sort by date</span>
            <div style={{ paddingLeft: "10px" }} />

            <DateRangePicker
              isOutsideRange={day => {
                return moment().diff(day) < 0;
              }}
              startDate={dates.startDate} // momentPropTypes.momentObj or null,
              startDateId="1" // PropTypes.string.isRequired,
              endDate={dates.endDate} // momentPropTypes.momentObj or null,
              endDateId="2" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {
                setDate({ startDate, endDate });
                setTimeout(
                  () => getSubData("refresh", startDate, endDate),
                  500
                );
              }} // PropTypes.func.isRequired,
              focusedInput={focus} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => {
                setFocus(focusedInput);
              }} // PropTypes.func.isRequired,
            />
          </div>
        </Card>
        <br />
        <br />
        <div className="grid-2">
          <Card>
            <div style={{ width: "100%" }} className="padding-20">
              {messageChart.fetching ? (
                <div className="flex justify-content-center align-c">
                  <Spinner color={primaryColor} />
                </div>
              ) : ChartDataRev(messageChart.data).length < 1 ? (
                <span>No data found</span>
              ) : (
                <React.Fragment>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={ChartDataRev(messageChart.data)}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sent" stroke="#1abc9c" />
                        <Line
                          type="monotone"
                          dataKey="pending"
                          stroke="#3498db"
                        />
                        <Line
                          type="monotone"
                          dataKey="failed"
                          stroke="#e74c3c"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </React.Fragment>
              )}
            </div>
          </Card>
          <Card>
            <div className="padding-20">
              Subscription Acquisition for Service from Content (Graph)
            </div>
          </Card>
        </div>
        <br />
        <br />
        <Card round heading="Logs">
          <div className="padding-20">
            {log.fetching ? (
              <Spinner color={secondaryColor} />
            ) : (
              <ReactTable
                data={data(log.data)}
                columns={columns}
                className={"react-table"}
                defaultPageSize={log.data.length < 5 ? 5 : 10}
              />
            )}
          </div>
        </Card>
        <br />
        <br />
      </React.Fragment>
    </div>
  );
}

export default SingleContent;
