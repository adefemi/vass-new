import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Icon,
  Notification,
  Spinner
} from "../../../../components/common";
import { Link } from "react-router-dom";
import { axiosFunc } from "../../../utils/helper";
import {
  categoryUrl,
  fetchFileUploadStream,
  secondaryColor
} from "../../../utils/data";
import moment from "moment";

function ViewCategory(props) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [activeId, setActiveId] = useState(true);

  const onFetchCategory = (status, payload) => {
    if (status) {
      setActiveCategory(payload.data.data[0]);
      setFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: "An error occurred while trying to fetch data. Try again later"
      });
    }
  };

  useEffect(() => {
    let activeUrl = props.history.location.pathname.split("/");
    let categoryId = activeUrl[activeUrl.length - 1];
    setActiveId(categoryId);

    axiosFunc(
      "get",
      categoryUrl + `?categoryId=${categoryId}`,
      null,
      "yes",
      onFetchCategory
    );
  }, []);

  return (
    <div className={"max-width-1200"}>
      <div className="breadcrum">
        <Link to={"/admin/settings?category"}>Categories</Link>
        <Link
          to={"/admin"}
          className={"active"}
          onClick={e => e.preventDefault()}
        >
          View Category
        </Link>
      </div>
      <Card round>
        {fetching ? (
          <div className={"padding-20"}>
            <Spinner color={secondaryColor} />
          </div>
        ) : (
          <React.Fragment>
            <div className="flex flex-wrap category-view-main">
              <div className="flex-left flex-1 padding-20">
                <div className="heading-content">Basic Information</div>

                <div className="img-con">
                  <img
                    src={fetchFileUploadStream(activeCategory.icon)}
                    alt=""
                  />
                </div>

                <table>
                  <tr>
                    <th>Name:</th>
                    <td>{activeCategory.name}</td>
                  </tr>
                  {activeCategory.description && (
                    <tr>
                      <th>Description:</th>
                      <td>{activeCategory.description}</td>
                    </tr>
                  )}
                </table>
              </div>

              <div className="flex-right flex-1 padding-20">
                <div className="heading-content">Dependencies</div>

                {activeCategory.dependencies &&
                activeCategory.dependencies.length > 0 ? (
                  <ul>
                    {activeCategory.dependencies.map((item, id) => {
                      return (
                        <li>
                          <div className="title">{item.name}</div>
                          <div className="ext">
                            {moment(item.effectiveFrom).format("DD/MM/YYYY")}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div>
                    <i>No dependency found...</i>
                  </div>
                )}
              </div>
            </div>

            <div className="padding-20">
              <Button
                onClick={() =>
                  props.history.push(`/admin/category/edit/${activeId}`)
                }
              >
                <span style={{ marginRight: "5px" }}>Edit</span>{" "}
                <Icon name={"edit"} type={"feather"} />
              </Button>
            </div>
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}

export default ViewCategory;
