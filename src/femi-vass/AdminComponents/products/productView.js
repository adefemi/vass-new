import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-dates";
import {
  Card,
  Icon,
  Notification,
  Spinner,
  Button,
  Modal
} from "../../../components/common";
import { Link } from "react-router-dom";
import "./Product.css";
import {
  billingUrl,
  newProductUrl,
  newSubscriptionUrl,
  primaryColor,
  productUrl,
  revenueUrl,
  secondaryColor,
  subscriptionsUrl,
  subscriptionUrl,
  USERACCESSCONTROL,
  USERTOKEN,
  contentURL
} from "../../utils/data";
import Contents from "./components/contents";
import { axiosFunc, axiosMed, formatCurrency } from "../../utils/helper";
import { errorHandler } from "../../../components/utils/helper";
import Configuration from "./components/configuration";
import moment from "moment";
import ContentManagement from "../contents/serviceContentEdit";
import Transactions from "./components/transactions";
import Subscriptions from "./components/subscriptions";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartData, ChartDataRev } from "../dashboard/Dashboard";

const newDate = new Date();

function ProductView(props) {
  const getActiveId = () => {
    let activeUrl = props.history.location.pathname.split("/");
    if (props.child || props.hasSub) {
      return props.subscription;
    }
    return activeUrl[activeUrl.length - 1];
  };

  const activeId = getActiveId();
  const [contents, setContents] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [fetchContents, setFetchContent] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [fetchingSubs, setFetchingSubs] = useState(false);
  const [revenue, setRev] = useState([]);
  const [fetchingRev, setFetchingRev] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [fetchingSubscriptions, setFetchingSubscriptions] = useState(true);
  const [focus, setFocus] = useState(null);
  const [activeTab, setActiveTab] = useState(
    props.child ? "dashboard" : "config"
  );
  const [submit, setSubmit] = useState(false);

  const [
    subscriptionsSubScribedChart,
    setSubscriptionsSubScribedChart
  ] = useState({
    data: [],
    fetching: true
  });

  const [subData, setSubData] = useState({
    data: {},
    fetching: true
  });

  const [contentData, setContentData] = useState({
    data: {},
    fetching: true
  });

  const [
    unsubscriptionsSubScribedChart,
    setUnsubscriptionsSubScribedChart
  ] = useState({
    data: [],
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

  const onFetchData = (status, payload, type) => {
    if (status) {
      let activeData = payload.data.data;

      if (type === "product") {
        setActiveProduct(activeData);
        setFetching(false);
      } else if (type === "subscribers") {
        setSubscribers(activeData);
        setFetchingSubs(false);
      } else if (type === "revenue") {
        setSubscriptions(payload.data);
        setFetchingRev(false);
      } else if (type === "subscriptions") {
        setSubscriptions(payload.data);
        setFetchingSubscriptions(false);
      } else if (type === "subDaily") {
        setSubscriptionsSubScribedChart({
          data: activeData,
          fetching: false
        });
      } else if (type === "churnDaily") {
        setUnsubscriptionsSubScribedChart({
          data: activeData,
          fetching: false
        });
      } else if (type === "revChart") {
        setRevenueInfo({
          revenueChart: activeData,
          fetching: false
        });
      } else {
        setFetchContent(false);
        setContents(payload.data);
      }
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const getSubData = (type = "new", newStartDate, newEndDate) => {
    let startDate = dates.startDate;
    let endDate = dates.endDate;

    let idName = `productId=${activeId}`;
    if (props.hasSub) {
      idName = `providerId=${activeId}`;
    }

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

    axiosFunc(
      "get",
      revenueUrl(
        `?stepType=daily&type=sum&dateFrom=${startDate.format("YYYY-MM-DD")}
        &dateTo=${endDate.format("YYYY-MM-DD")}&${idName}`
      ),
      null,
      "yes",
      onFetchData,
      "revChart"
    );

    axiosFunc(
      "get",
      subscriptionUrl({
        dateFrom: startDate.format("YYYY-MM-DD"),
        dateTo: endDate.format("YYYY-MM-DD"),
        extra: `productId=${idName}`
      }),
      null,
      "yes",
      onFetchData,
      "subDaily"
    );
    axiosFunc(
      "get",
      subscriptionUrl({
        dataType: "unsubscribed",
        dateFrom: startDate.format("YYYY-MM-DD"),
        dateTo: endDate.format("YYYY-MM-DD"),
        extra: `productId=${idName}`
      }),
      null,
      "yes",
      onFetchData,
      "churnDaily"
    );
  };

  const getAllData = () => {
    let idName = `productId=${activeId}`;
    if (props.hasSub) {
      idName = `providerId=${activeId}`;
    }

    Promise.all([
      axiosMed(
        "get",
        contentURL(`/count?product_id=${activeId}&stepType=total`),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        contentURL(`/count?product_id=${activeId}&stepType=today`),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        contentURL(`?product_id=${activeId}&limit=10&page=1`),
        null,
        "yes"
      )
    ]).then(
      ([total, today, list]) => {
        setContentData({
          data: {
            total: total.data.data,
            today: today.data.data,
            contents: list.data
          },
          fetching: false
        });
      },
      err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        });
      }
    );

    axiosFunc(
      "get",
      newSubscriptionUrl(`fetch?productId=${idName}&page=1&limit=10`),
      null,
      "yes",
      onFetchData,
      "subscribers"
    );

    axiosFunc(
      "get",
      billingUrl(`transactions?page=1&limit=10&stepType=total&${idName}`),
      null,
      "yes",
      onFetchData,
      "revenue"
    );
    axiosFunc(
      "get",
      productUrl(`?${idName}`),
      null,
      "yes",
      onFetchData,
      "product"
    );
    axiosFunc(
      "get",
      subscriptionsUrl(`counts?${idName}&page=1&limit=10&stepType=total`),
      null,
      "yes",
      onFetchData,
      "subscriptions"
    );

    Promise.all([
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?${idName}&dataType=subscribed&stepType=total&type=count`
        ),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?${idName}&dataType=subscribed&stepType=today&type=count`
        ),
        null,
        "yes"
      )
    ]).then(
      ([total, today]) => {
        setSubData({
          data: {
            total: total.data.data,
            today: today.data.data
          },
          fetching: false
        });
      },
      err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        });
      }
    );
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.products.data.single_product;

  useEffect(() => {
    if (!user_access.status) {
      Notification.bubble({
        type: "error",
        content: "You don't have access to this page!!!"
      });
      props.history.goBack();
    } else {
      getAllData();
    }
    if (!props.child) {
      getSubData();
    }
  }, []);

  useEffect(() => {
    if (!props.child) {
      !props.history.location.hash && setActiveTab("dashboard");
      props.history.location.hash === "#contents" && setActiveTab("contents");
      props.history.location.hash === "#transactions" &&
        setActiveTab("transactions");
      props.history.location.hash === "#config" && setActiveTab("config");
      props.history.location.hash === "#create-content" &&
        setActiveTab("createContent");
      props.history.location.hash === "#subscriptions" &&
        setActiveTab("subscriptions");
    }
  }, [window.location.href]);

  const onApproved = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation Successful"
      });
      setActiveProduct({
        ...activeProduct,
        status:
          activeProduct.status.toLowerCase() === "approved"
            ? "DISAPPROVED"
            : "APPROVED"
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const onProductApprove = (id, status) => {
    setSubmit(true);
    axiosFunc(
      "patch",
      productUrl(`/status?productId=${id}&status=${status}`),
      null,
      "yes",
      onApproved
    );
  };

  const approveProduct = (status = "APPROVED") => {
    Modal.confirm({
      title: `Product ${status === "APPROVED" ? "Approval" : "Disapproval"}`,
      content: `You are about to ${
        status === "APPROVED" ? "approve" : "disapprove"
      } this product, do you want to content...`,
      okText: "Yes",
      onOK: () => onProductApprove(activeProduct.productId, status)
    });
  };

  let check = fetching || !activeProduct || activeProduct.length;
  if (props.child) {
    check = fetching;
  }

  return (
    <div className={"category-container max-width-1200"}>
      {check ? (
        <Spinner color={secondaryColor} />
      ) : (
        <React.Fragment>
          {!props.child && (
            <>
              <br />
              <div className="flex justify-between align-c">
                <div className="heading-content" style={{ fontSize: "20px" }}>
                  {props.hasSub ? (
                    <span>
                      {props.basicData && props.basicData.name + "'s"} Dashboard
                    </span>
                  ) : (
                    <span>Product: {activeProduct.name}</span>
                  )}
                </div>

                {!props.hasSub && (
                  <div>
                    {user_access.data.edit_product && (
                      <small
                        className="link font-size-small"
                        onClick={() =>
                          window.open(
                            newProductUrl(
                              `${localStorage.getItem(
                                USERTOKEN
                              )}&productId=${activeId}&redirectUrl=`
                            ),
                            "_blank"
                          )
                        }
                      >
                        Edit Product
                      </small>
                    )}
                    &nbsp; &#183; &nbsp;
                    {user_access.data.settings && (
                      <span
                        onClick={() => {
                          props.history.push(
                            props.history.location.pathname + "#config"
                          );
                        }}
                      >
                        <Icon
                          name={"settings"}
                          type={"feather"}
                          color={secondaryColor}
                          className={"settings_gear"}
                        />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {!props.child && !props.hasSub && (
            <>
              <br /> <br />
              <div className="flex align-c justify-between">
                <div className="breadcrum">
                  <Link to={"/admin/services"}>
                    <span style={{ marginBottom: "5px" }}>
                      <Icon name={"chevronLeft"} type={"feather"} />
                    </span>
                    Back
                  </Link>
                  {user_access.data.dashboard_product_tab.status && (
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
                  {user_access.data.content.status && (
                    <Link
                      className={activeTab === "contents" ? "active" : ""}
                      to={"#contents"}
                    >
                      Contents
                    </Link>
                  )}
                  {user_access.data.transactions && (
                    <Link
                      className={activeTab === "transactions" ? "active" : ""}
                      to={"#transactions"}
                    >
                      Transactions
                    </Link>
                  )}
                  {user_access.data.subscriptions && (
                    <Link
                      className={activeTab === "subscriptions" ? "active" : ""}
                      to={"#subscriptions"}
                    >
                      Subscriptions
                    </Link>
                  )}
                </div>
                {user_access.data.approve && (
                  <Button
                    onClick={() =>
                      activeProduct.status.toLowerCase() === "approved"
                        ? approveProduct("DISAPPROVED")
                        : approveProduct()
                    }
                    loading={submit}
                    disabled={submit}
                    color={
                      activeProduct.status.toLowerCase() === "approved"
                        ? "danger"
                        : "primary"
                    }
                  >
                    {activeProduct.status.toLowerCase() === "approved"
                      ? "Disapprove"
                      : "Approve"}
                  </Button>
                )}
              </div>
              <br />
            </>
          )}

          {activeTab === "dashboard" &&
          user_access.data.dashboard_product_tab.status ? (
            <React.Fragment>
              <br />
              <div className="grid-auto">
                {user_access.data.dashboard_product_tab.data
                  .total_subscribers && (
                  <Card
                    round
                    className={"productCardInfo"}
                    style={{ backgroundColor: "#74b9ff", color: "white" }}
                  >
                    <div className={"title"}>Number of Subscriptions</div>
                    <div className="inner-content">
                      <div className={"mainFig"}>
                        {subData.fetching ? (
                          <Spinner />
                        ) : (
                          <span>{subData.data.total}</span>
                        )}
                      </div>
                      <small>
                        Today:{" "}
                        {subData.fetching ? (
                          <Spinner />
                        ) : (
                          <span>{subData.data.today}</span>
                        )}
                      </small>
                    </div>
                  </Card>
                )}
                {user_access.data.dashboard_product_tab.data.total_contents && (
                  <Card
                    round
                    className={"productCardInfo"}
                    style={{ backgroundColor: "#ff7675", color: "white" }}
                  >
                    <div className={"title"}>Total Contents</div>
                    <div className="inner-content">
                      <div className={"mainFig"}>
                        {contentData.fetching ? (
                          <Spinner />
                        ) : (
                          <span>{contentData.data.total}</span>
                        )}
                      </div>
                      <small>
                        Today:{" "}
                        {contentData.fetching ? (
                          <Spinner />
                        ) : (
                          <span>{contentData.data.today}</span>
                        )}
                      </small>
                    </div>
                  </Card>
                )}
                {user_access.data.dashboard_product_tab.data.total_revenue && (
                  <Card
                    round
                    className={"productCardInfo"}
                    style={{ backgroundColor: "#a29bfe", color: "white" }}
                  >
                    <div className={"title"}>Total Revenue Generated</div>
                    <div className="inner-content">
                      <div className={"mainFig"}>
                        {fetchingRev ? (
                          <Spinner />
                        ) : (
                          <span>
                            {" "}
                            &#8358;
                            {revenue.length < 1
                              ? 0.0
                              : formatCurrency(
                                  revenue.reduce(
                                    (total, item) =>
                                      total + parseFloat(item.amount),
                                    0
                                  )
                                )}
                          </span>
                        )}
                      </div>
                      <small>
                        Today:{" "}
                        {fetchingRev ? (
                          <Spinner />
                        ) : (
                          <span>
                            {" "}
                            &#8358;
                            {revenue.length < 1
                              ? 0.0
                              : formatCurrency(
                                  revenue.reduce((total, item) => {
                                    if (
                                      moment(new Date(item.createdAt)).format(
                                        "DD-MM-YYYY"
                                      ) ===
                                      moment(new Date()).format("DD-MM-YYYY")
                                    ) {
                                      return total + parseFloat(item.amount);
                                    }
                                    return 0;
                                  }, 0)
                                )}
                          </span>
                        )}
                      </small>
                    </div>
                  </Card>
                )}
              </div>

              {!props.child && (
                <>
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
                </>
              )}

              {!props.child && (
                <>
                  <br />
                  <br />
                  <div className="grid-auto">
                    {user_access.data.dashboard_product_tab.data
                      .revenue_graphs && (
                      <Card
                        round
                        heading={
                          <small className="font-size-small">Revenue</small>
                        }
                      >
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
                                      data={ChartDataRev(
                                        revenueInfo.revenueChart
                                      )}
                                      margin={{
                                        top: 5,
                                        right: 30,
                                        left: 0,
                                        bottom: 5
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" interval={0} />
                                      <YAxis />
                                      <Tooltip />
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
                    {user_access.data.dashboard_product_tab.data
                      .subscriptions_graphs && (
                      <Card
                        round
                        heading={
                          <small className="font-size-small">
                            Subscriber Acquisition/Churn
                          </small>
                        }
                      >
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
                                      margin={{
                                        top: 5,
                                        right: 30,
                                        left: 0,
                                        bottom: 5
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" interval={0} />
                                      <YAxis />
                                      <Tooltip />
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
                </>
              )}
            </React.Fragment>
          ) : null}
          {activeTab === "contents" && user_access.data.content.status ? (
            <React.Fragment>
              <br />
              <Contents
                {...props}
                data={contentData.data.contents}
                activeId={null}
                fetching={contentData.fetching}
                id={activeId}
              />
              <Card round>
                <div className="padding"></div>
              </Card>
              <br />
              <br />
            </React.Fragment>
          ) : null}
          {activeTab === "transactions" && user_access.data.transactions ? (
            <React.Fragment>
              <br />
              <Card
                round
                heading={<div className="heading-content">Transactions</div>}
              >
                <div className="padding">
                  <Transactions
                    {...props}
                    data={revenue}
                    activeId={null}
                    fetching={fetchingRev}
                  />
                </div>
              </Card>
              <br />
              <br />
            </React.Fragment>
          ) : null}
          {activeTab === "subscriptions" && user_access.data.subscriptions ? (
            <React.Fragment>
              <br />
              <Subscriptions
                {...props}
                data={subscriptions}
                activeId={null}
                fetching={fetchingSubscriptions}
              />
              <br />
              <br />
            </React.Fragment>
          ) : null}
          {activeTab === "config" && <Configuration productId={activeId} />}
          {activeTab === "createContent" && <ContentManagement {...props} />}
        </React.Fragment>
      )}
      <br />
      <br />
    </div>
  );
}

export default ProductView;
