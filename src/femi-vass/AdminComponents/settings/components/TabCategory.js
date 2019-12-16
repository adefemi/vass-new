import React, { useState, useEffect } from "react";
import {
  Input,
  Icon,
  Spinner,
  Notification,
  Button,
  Modal
} from "../../../../components/common";
import {
  categoryUrl,
  fetchFileUploadStream,
  secondaryColor
} from "../../../utils/data";
import { axiosFunc } from "../../../utils/helper";

function TabCategory(props) {
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const onFetchData = (status, payload) => {
    if (status) {
      setCategories(payload.data.data);
      setFetching(false);
    } else {
      Notification.bubble({
        type: "error",
        content: "An error occurred while trying to fetch data. Try again later"
      });
    }
  };

  useEffect(() => {
    axiosFunc("get", categoryUrl, null, "yes", onFetchData);
  }, []);

  const setActiveCat = id => {
    setActiveCategory(categories.filter(item => item.categoryId === id)[0]);
    setShowModal(true);
  };

  return (
    <React.Fragment>
      <Modal
        onClose={() => setShowModal(false)}
        visible={showModal}
        footer={false}
      >
        {activeCategory && (
          <React.Fragment>
            <div className="flex flex-wrap category-view-main">
              <div className="flex-left flex-1 padding-20 max-width-600">
                <div className="img-con image-con-large2">
                  <img
                    src={fetchFileUploadStream(activeCategory.icon)}
                    alt=""
                  />
                </div>

                <table>
                  <tbody>
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
                  </tbody>
                </table>
              </div>
            </div>

            <div className="padding-20">
              <Button
                onClick={() =>
                  props.history.push(
                    `/admin/category/edit/${activeCategory.categoryId}`
                  )
                }
              >
                <span style={{ marginRight: "5px" }}>Edit</span>{" "}
                <Icon name={"edit"} type={"feather"} />
              </Button>
            </div>
          </React.Fragment>
        )}
      </Modal>
      <div>
        <div className="flex align-c justify-between">
          <Input
            iconLeft={<Icon name={"search"} type={"feather"} />}
            onChange={() => null}
            placeholder={"filter categories"}
          />
          <div
            className="flex align-c create-comp"
            onClick={() => props.history.push("category/add")}
          >
            <div>
              <Icon type={"feather"} name={"plusCircle"} />
            </div>
            <div>Create Category</div>
          </div>
        </div>
        <br />

        {fetching ? (
          <Spinner color={secondaryColor} />
        ) : (
          <React.Fragment>
            <div className="custom-flex">
              {categories.length < 1 && <i>No item found...</i>}
              {categories.map((item, ind) => (
                <TabCard
                  key={ind}
                  {...props}
                  item={item}
                  setActiveCat={setActiveCat}
                />
              ))}
            </div>

            {categories.length > 10 && (
              <div className="btn-more">
                Load more <Icon name={"chevronsDown"} type={"feather"} />
              </div>
            )}
          </React.Fragment>
        )}

        <br />
        <br />
      </div>
    </React.Fragment>
  );
}

const TabCard = props => {
  return (
    <div
      className="grid-item category-item"
      onClick={() => props.setActiveCat(props.item.categoryId)}
    >
      <div className="top">
        <div className="img-con image-con-large">
          <img src={fetchFileUploadStream(props.item.icon)} alt="" />
        </div>
      </div>
      <div className="title">
        <div className="text-inner">{props.item.name}</div>
      </div>
    </div>
  );
};

export default TabCategory;
