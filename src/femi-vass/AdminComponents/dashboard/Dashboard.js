import React, { useState, useEffect } from "react";
import "react-table/react-table.css";
import { Card, Icon, Notification, Spinner } from "../../../components/common";
import { errorHandler } from "../../../components/utils/helper";
import { axiosFunc, formatCurrency } from "../../utils/helper";
import {
  primaryColor,
  productUrl,
  providerUrl,
  revenueSumUrl,
  revenueUrl,
  subAccountUrl,
  subscriptionUrl,
  subscriptionUrl2,
  USERACCESSCONTROL
} from "../../utils/data";
import { Link } from "react-router-dom";
// import Transactions from "../products/components/transactions";
// import Subscriptions from "../products/components/subscriptions";
import moment from "moment";
import _empty from "lodash/isEmpty";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { DateRangePicker } from "react-dates";
import { logout } from "../../partials/NavBar";

const today = moment(new Date());
const newDate = new Date();

export const ChartData = (
  dataSub,
  dataChurn,
  title,
  type = "rev",
  line = null
) => {
  let retData = [];
  if (_empty(dataSub) || dataSub.length < 1) return;

  for (let i = 0; i < dataSub.length; i++) {
    let newData = {};
    for (let key in dataSub[i]) {
      if (dataSub[i].hasOwnProperty(key)) {
        newData = {
          date: moment(key, "YYYY-MM-DD").format("MMMM DD"),
          subscription: dataSub[i][key],
          churn: 0
        };
        retData.push(newData);
      }
    }
    for (let key in dataChurn[i]) {
      if (dataChurn[i].hasOwnProperty(key)) {
        newData = {
          date: moment(key, "YYYY-MM-DD").format("MMMM DD"),
          churn: dataChurn[i][key],
          subscription: 0
        };
        retData.push(newData);
      }
    }
  }
  return retData;
};

export const ChartDataRev = data => {
  if (_empty(data) || data.length < 1) return;
  let retData = [];
  for (let i = 0; i < data.length; i++) {
    for (let key in data[i]) {
      if (data[i].hasOwnProperty(key)) {
        let newData = {
          date: moment(key, "YYYY-MM-DD").format("MMMM DD"),
          revenue: data[i][key]
        };
        retData.push(newData);
      }
    }
  }
  return retData;
};

function Dashboard(props) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [totalRevenue, setTotalRevenue] = useState({
    data: 0,
    fetching: true
  });
  const [todayRevenue, setTodayRevenue] = useState({
    data: 0,
    fetching: true
  });
  const [
    subscriptionsSubScribedChart,
    setSubscriptionsSubScribedChart
  ] = useState({
    data: [],
    fetching: true
  });
  const [
    unsubscriptionsSubScribedChart,
    setUnsubscriptionsSubScribedChart
  ] = useState({
    data: [],
    fetching: true
  });

  const [totalSubscription, setTotalSubscription] = useState({
    data: 0,
    fetching: true
  });

  const [todaySubscription, setTodaySubscription] = useState({
    data: 0,
    fetching: true
  });

  const [totalProducts, setTotalProducts] = useState({
    data: 0,
    fetching: true
  });
  const [todayProducts, setTodaylProducts] = useState({
    data: 0,
    fetching: true
  });

  const [totalAccounts, setTotalAccounts] = useState({
    data: 0,
    fetching: true
  });
  const [todayAccounts, setTodayAccounts] = useState({
    data: 0,
    fetching: true
  });

  const [revenueInfo, setRevenueInfo] = useState({
    revenueChart: [],
    fetching: true
  });

  const [dates, setDate] = useState({
    startDate: moment(newDate.setDate(newDate.getDate() - 1)),
    endDate: moment(new Date())
  });

  const [focus, setFocus] = useState(null);

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  if (!user_access) {
    logout();
  }
  user_access = user_access.sideBar.dashboard.data;

  if (!user_access.dashboard.status) {
    if (user_access.payment_transactions) {
      setActiveTab("transactions");
    } else {
      setActiveTab("subscriptions");
    }
  }

  const onFetchData = (status, payload, type) => {
    if (status) {
      let activeData = payload.data.data;
      if (type.name === "revenue" && type.state === "total") {
        setTotalRevenue({
          data: activeData,
          fetching: false
        });
      }
      if (type.name === "revenue" && type.state === "today") {
        setTodayRevenue({
          data: activeData,
          fetching: false
        });
      }
      if (type.name === "revenue" && type.state === "daily") {
        setRevenueInfo({
          revenueChart: activeData,
          fetching: false
        });
      }
      if (
        type.name === "subscriptions" &&
        type.state === "daily" &&
        (type.variant && type.variant === "subscribed")
      ) {
        setSubscriptionsSubScribedChart({
          data: activeData,
          fetching: false
        });
      }
      if (
        type.name === "subscriptions" &&
        type.state === "daily" &&
        (type.variant && type.variant === "churn")
      ) {
        setUnsubscriptionsSubScribedChart({
          data: activeData,
          fetching: false
        });
      }
      if (
        type.name === "subscriptions" &&
        type.state === "total" &&
        !type.variant
      ) {
        setTotalSubscription({
          data: activeData,
          fetching: false
        });
      }
      if (
        type.name === "subscriptions" &&
        type.state === "total" &&
        type.variant === "today"
      ) {
        setTodaySubscription({
          data: activeData,
          fetching: false
        });
      }
      if (type.name === "products") {
        setTotalProducts({
          data: activeData,
          fetching: false
        });
      }
      if (type.name === "accounts" && type.state === "total") {
        setTotalAccounts({
          data: activeData,
          fetching: false
        });
      }
      if (type.name === "accounts" && type.state === "today") {
        setTodayAccounts({
          data: activeData,
          fetching: false
        });
      }
      if (type.name === "product" && type.state === "today") {
        setTodaylProducts({
          data: activeData,
          fetching: false
        });
      }
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  useEffect(() => {
    if (user_access.dashboard.data.total_revenue) {
      axiosFunc(
        "get",
        revenueSumUrl(`?status=SUCCESS&type=total`),
        null,
        "yes",
        onFetchData,
        { name: "revenue", state: "total" }
      );
      axiosFunc(
        "get",
        revenueSumUrl(`?status=SUCCESS&type=today`),
        null,
        "yes",
        onFetchData,
        { name: "revenue", state: "today" }
      );
    }

    if (user_access.dashboard.data.total_products) {
      axiosFunc(
        "get",
        productUrl("?dataType=count"),
        null,
        "yes",
        onFetchData,
        {
          name: "products"
        }
      );

      axiosFunc(
        "get",
        productUrl("?type=today&dataType=count"),
        null,
        "yes",
        onFetchData,
        {
          name: "product",
          state: "today"
        }
      );
    }

    if (user_access.dashboard.data.total_accounts) {
      axiosFunc(
        "get",
        providerUrl("dataType=count"),
        null,
        "yes",
        onFetchData,
        {
          name: "accounts",
          state: "total"
        }
      );
      axiosFunc(
        "get",
        providerUrl("dataType=count&stepType=today"),
        null,
        "yes",
        onFetchData,
        {
          name: "accounts",
          state: "today"
        }
      );
    }

    if (
      user_access.dashboard.data.total_subscribers ||
      user_access.subscriptions
    ) {
      axiosFunc(
        "get",
        subscriptionUrl2(
          `counts?stepType=total&type=count&dataType=subscribed`
        ),
        null,
        "yes",
        onFetchData,
        {
          name: "subscriptions",
          state: "total"
        }
      );
      axiosFunc(
        "get",
        subscriptionUrl({
          stepType: "total",
          dateFrom: today.format("YYYY-MM-DD"),
          dateTo: today.format("YYYY-MM-DD")
        }),
        null,
        "yes",
        onFetchData,
        {
          name: "subscriptions",
          state: "total",
          variant: "today"
        }
      );
      axiosFunc(
        "get",
        subAccountUrl(`?dataType=count&type=total`),
        null,
        "yes",
        onFetchData,
        {
          name: "accounts",
          state: "total"
        }
      );
      axiosFunc(
        "get",
        subAccountUrl(`?dataType=count&type=today`),
        null,
        "yes",
        onFetchData,
        {
          name: "accounts",
          state: "today"
        }
      );
    }

    getSubData();
  }, []);

  const getSubData = (type = "new", newStartDate, newEndDate) => {
    let startDate = dates.startDate;
    let endDate = dates.endDate;

    if (type === "refresh") {
      setRevenueInfo({
        ...revenueInfo,
        fetching: true
      });

      setSubscriptionsSubScribedChart({
        ...subscriptionsSubScribedChart,
        fetching: true
      });

      setUnsubscriptionsSubScribedChart({
        ...unsubscriptionsSubScribedChart,
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

    if (user_access.dashboard.data.revenue_graph) {
      axiosFunc(
        "get",
        revenueUrl(
          `?stepType=daily&type=sum&dateFrom=${startDate.format(
            "YYYY-MM-DD"
          )}&dateTo=${endDate.format("YYYY-MM-DD")}`
        ),
        null,
        "yes",
        onFetchData,
        { name: "revenue", state: "daily" }
      );
    }
    if (user_access.dashboard.data.subscriptions_graph) {
      axiosFunc(
        "get",
        subscriptionUrl({
          dateFrom: startDate.format("YYYY-MM-DD"),
          dateTo: endDate.format("YYYY-MM-DD")
        }),
        null,
        "yes",
        onFetchData,
        {
          name: "subscriptions",
          state: "daily",
          variant: "subscribed"
        }
      );
      axiosFunc(
        "get",
        subscriptionUrl({
          dataType: "unsubscribed",
          dateFrom: startDate.format("YYYY-MM-DD"),
          dateTo: endDate.format("YYYY-MM-DD")
        }),
        null,
        "yes",
        onFetchData,
        {
          name: "subscriptions",
          state: "daily",
          variant: "churn"
        }
      );
    }
  };

  useEffect(() => {
    !props.history.location.hash && setActiveTab("dashboard");
    props.history.location.hash === "#contents" && setActiveTab("contents");
    props.history.location.hash === "#transactions" &&
      setActiveTab("transactions");
    props.history.location.hash === "#subscriptions" &&
      setActiveTab("subscriptions");
  }, [window.location.href]);

  return (
    <div className={"max-width-1200"}>
      <br />
      <div className="flex align-c justify-between">
        <div className="breadcrum">
          {user_access.dashboard.status && (
            <Link
              to={"/admin"}
              onClick={e => {
                e.preventDefault();
                props.history.replace(props.history.location.pathname);
              }}
              className={activeTab === "dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
          )}
          {user_access.payment_transactions && (
            <Link
              className={activeTab === "transactions" ? "active" : ""}
              to={"#transactions"}
            >
              Payment Transactions
            </Link>
          )}

          {user_access.subscriptions && (
            <Link
              className={activeTab === "subscriptions" ? "active" : ""}
              to={"#subscriptions"}
            >
              Subscriptions
            </Link>
          )}
        </div>
      </div>
      {activeTab === "dashboard" && (
        <React.Fragment>
          <div className="grid-auto">
            {user_access.dashboard.data.total_subscribers && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#74b9ff", color: "white" }}
              >
                <div className={"title"}>Total Subscriptions</div>
                <div className="inner-content">
                  {totalSubscription.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        <span>{totalSubscription.data}</span>
                      </div>
                      <small>
                        Today: <span>{todaySubscription.data}</span>
                      </small>
                    </React.Fragment>
                  )}
                </div>
              </Card>
            )}
            {user_access.dashboard.data.total_products && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#ff7675", color: "white" }}
              >
                <div className={"title"}>Total Products</div>
                <div className="inner-content">
                  {totalProducts.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        <span>{totalProducts.data}</span>
                      </div>
                      <small>
                        Today: <span>{todayProducts.data}</span>
                      </small>
                    </React.Fragment>
                  )}
                </div>
              </Card>
            )}
            {user_access.dashboard.data.total_accounts && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#a29bfe", color: "white" }}
              >
                <div className={"title"}>Total Accounts</div>
                <div className="inner-content">
                  {totalAccounts.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        <span>{totalAccounts.data}</span>
                      </div>
                      <small>
                        Today: <span>{todayAccounts.data}</span>
                      </small>
                    </React.Fragment>
                  )}
                </div>
              </Card>
            )}
            {user_access.dashboard.data.sub_accounts && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#a29bfe", color: "white" }}
              >
                <div className={"title"}>Sub Accounts</div>
                <div className="inner-content">
                  {totalAccounts.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        <span>{totalAccounts.data}</span>
                      </div>
                      <small>
                        Today: <span>{todayAccounts.data}</span>
                      </small>
                    </React.Fragment>
                  )}
                </div>
              </Card>
            )}
            {user_access.dashboard.data.total_revenue && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#fd79a8", color: "white" }}
              >
                <div className={"title"}>Total Revenue Generated</div>
                <div className="inner-content">
                  {totalRevenue.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        <span>
                          &#8358;{formatCurrency(totalRevenue.data) || 0}
                        </span>
                      </div>
                      <small>
                        Today:{" "}
                        <span>
                          &#8358;{formatCurrency(todayRevenue.data) || 0.0}
                        </span>
                      </small>
                    </React.Fragment>
                  )}
                </div>
              </Card>
            )}
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
          <div className="grid-auto">
            {user_access.dashboard.data.revenue_graph && (
              <Card round heading={"Revenue"}>
                <div className="padding-20">
                  <div style={{ width: "100%" }}>
                    {revenueInfo.fetching ? (
                      <div className="flex justify-content-center align-c">
                        <Spinner color={primaryColor} />
                      </div>
                    ) : revenueInfo.revenueChart.length < 1 ? (
                      <div className="flex justify-content-center align-c">
                        No Revenue found!
                      </div>
                    ) : (
                      <React.Fragment>
                        <div style={{ width: "100%", height: 300 }}>
                          <ResponsiveContainer>
                            <LineChart
                              data={ChartDataRev(revenueInfo.revenueChart)}
                              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" interval={0} />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="date"
                                stroke="#000000"
                              />
                              <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8884d8"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </Card>
            )}
            {user_access.dashboard.data.subscriptions_graph && (
              <Card round heading={"Subscription/Churn"}>
                <div className="padding-20">
                  <div style={{ width: "100%", height: "auto" }}>
                    {subscriptionsSubScribedChart.fetching ||
                    unsubscriptionsSubScribedChart.fetching ? (
                      <div className="flex justify-content-center align-c">
                        <Spinner color={primaryColor} />
                      </div>
                    ) : subscriptionsSubScribedChart.data.length < 1 &&
                      unsubscriptionsSubScribedChart.data.length < 1 ? (
                      <div className="flex justify-content-center align-c">
                        No subscription found
                      </div>
                    ) : (
                      <React.Fragment>
                        <div style={{ width: "100%", height: 300 }}>
                          <ResponsiveContainer>
                            <LineChart
                              data={ChartData(
                                subscriptionsSubScribedChart.data,
                                unsubscriptionsSubScribedChart.data,
                                "subscription",
                                "sub",
                                "churn"
                              )}
                              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="4 4" />
                              <XAxis dataKey="label" interval={0} />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="date"
                                stroke="#000000"
                              />
                              <Line
                                type="monotone"
                                dataKey="subscription"
                                stroke="#8884d8"
                              />
                              <Line
                                type="monotone"
                                dataKey="churn"
                                stroke="#ff7675"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </React.Fragment>
      )}

      {activeTab === "transactions" && (
        <React.Fragment>
          {/*<Transactions*/}
          {/*  {...props}*/}
          {/*  data={null}*/}
          {/*  activeId={"admin"}*/}
          {/*  fetching={null}*/}
          {/*/>*/}
        </React.Fragment>
      )}
      {activeTab === "subscriptions" && (
        <React.Fragment>
          {/*<Subscriptions*/}
          {/*  {...props}*/}
          {/*  data={null}*/}
          {/*  activeId={"admin"}*/}
          {/*  fetching={null}*/}
          {/*/>*/}
        </React.Fragment>
      )}
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
