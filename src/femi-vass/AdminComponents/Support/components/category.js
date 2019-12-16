import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/common/button";
import { Card } from "../../../../components/common/card";
import { Modal } from "../../../../components/common/modal";
import { Input } from "../../../../components/common/input";
import { FormGroup } from "../../../../components/common/formGroup";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";
import { axiosFunc } from "../../../utils/helper";
import { supportUrlMain } from "../../../utils/data";
import { Notification } from "../../../../components/common/notification";
import { errorHandler } from "../../../../components/utils/helper";
import { withRouter } from "react-router-dom";

const columns = [
  {
    title: "Group Id",
    dataIndex: "group_id",
    key: "group_id"
  },
  {
    title: "Group Name",
    dataIndex: "group_name",
    key: "group_name"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

const fillData = (props, dataList) => {
  const newArray = [];

  dataList.map((item, id) => {
    newArray.push({
      key: id,
      group_id: item.categoryId,
      group_name: item.name,
      action: (
        <div>
          <span
            className="link"
            onClick={() =>
              props.history.push(`/admin/support/assign/${item.categoryId}`)
            }
          >
            Assign Role
          </span>
        </div>
      )
    });
    return null;
  });
  return newArray;
};

function CategorySupport(props) {
  const [showModal, setShowModal] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);

  const onChange = e => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchSupportGroup(1);
  }, []);

  const onSaveGroup = e => {
    e.preventDefault();
    setLoading(true);
    axiosFunc(
      "post",
      supportUrlMain("categories"),
      groupData,
      "yes",
      (status, data) => {
        if (status) {
          Notification.bubble({
            type: "success",
            content: "Support group created successfully"
          });
          fetchSupportGroup(1);
          setShowModal(false);
          setLoading(false);
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(data)
          });
        }
      }
    );
  };

  const fetchSupportGroup = page => {
    setFetching(true);
    axiosFunc(
      "get",
      supportUrlMain("categories?limit=10&page=1"),
      null,
      "yes",
      (status, data) => {
        if (status) {
          setCategories(data.data.data);
          setFetching(false);
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(data)
          });
        }
      }
    );
  };

  return (
    <div className="max-width-1400">
      <Modal
        title="Create Support Group"
        onClose={() => setShowModal(false)}
        visible={showModal}
      >
        <form onSubmit={onSaveGroup}>
          <FormGroup title="Group Name">
            <Input
              required
              name="name"
              onChange={onChange}
              value={groupData.name || ""}
            />
          </FormGroup>
          <br />
          <Button type="submit" disabled={loading} loading={loading}>
            Create
          </Button>
        </form>
      </Modal>
      <div className="flex align-c justify-between">
        <div className="heading-main">Support Group</div>
        {props.access.createCategories && (
          <Button onClick={() => setShowModal(true)}>Create Group</Button>
        )}
      </div>
      <br />

      <Card round>
        {props.access.viewCategories ? (
          <>
            <Table
              loading={fetching}
              columns={columns}
              dataSource={fetching ? [] : fillData(props, categories)}
              pagination={false}
            />
            <br />
            <div className="tab-content padding-20">
              <div className="flex justify-between align-c">
                <div />
                <Pagination
                  onChange={page => null}
                  defaultCurrent={fetching ? 1 : 1}
                  total={10}
                />
              </div>
            </div>
          </>
        ) : (
          <div>You can't view categories</div>
        )}
      </Card>
    </div>
  );
}

export default withRouter(CategorySupport);
