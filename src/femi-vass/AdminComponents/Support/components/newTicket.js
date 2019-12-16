import React, { useEffect, useState } from "react";
import { axiosFunc } from "../../../utils/helper";
import { fileUpload, supportUrlMain } from "../../../utils/data";
import {
  Notification,
  Card,
  Input,
  FormGroup,
  TextAreaField,
  Select,
  Button,
  Upload
} from "../../../../components/common";
import { errorHandler } from "../../../../components/utils/helper";
import AppIcon from "../../../../components/common/icons/Icon";
import { withRouter } from "react-router-dom";

function NewTicket(props) {
  const [groupData, setGroupData] = useState({});
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  useEffect(() => {
    fetchSupportGroup(1);
  }, []);

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
  const onChange = e => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value
    });
  };
  const onSaveGroup = e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...groupData,
      fileIds: fileUrls,
      url: `${window.location.origin}/admin/support`
    };
    axiosFunc(
      "post",
      supportUrlMain("tickets/create"),
      data,
      "yes",
      (status, data) => {
        if (status) {
          Notification.bubble({
            type: "success",
            content: "Ticket created successfully"
          });
          setTimeout(() => props.history.push("/admin/support"), 1000);
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(data)
          });
        }
      }
    );
  };

  const fileUploadComplete = e => {
    setFileUrls([...fileUrls, e.data.id]);
  };

  const fileDeleteComplete = e => {
    if (fileUrls.includes(e)) {
      setFileUrls(fileUrls.filter(item => item !== e));
    }
  };

  return (
    <div className="max-width-1400">
      <div className="link" onClick={() => props.history.goBack()}>
        <AppIcon name="arrowLeft" type="feather" />
      </div>
      <br />
      <Card round heading="Create a Ticket">
        <form onSubmit={onSaveGroup} className="max-width-600 padding-20">
          <FormGroup title="Title">
            <Input
              required
              name="title"
              onChange={onChange}
              value={groupData.title || ""}
            />
          </FormGroup>
          <FormGroup title="Category">
            <Select
              required
              name="categoryId"
              onChange={onChange}
              defaultOption
              value={groupData.categoryId || ""}
            >
              <Select.Option value="">--select category--</Select.Option>
              {fetching
                ? [<Select.Option value="">Loading...</Select.Option>]
                : categories.map((item, key) => (
                    <Select.Option key={key} value={item.categoryId}>
                      {item.name}
                    </Select.Option>
                  ))}
            </Select>
          </FormGroup>
          <FormGroup title="Critical Status">
            <Select
              required
              name="critical"
              onChange={onChange}
              value={groupData.critical || ""}
            >
              <Select.Option value="">--select level--</Select.Option>
              <Select.Option value={true}>Critical</Select.Option>
              <Select.Option value={false}>Not critical</Select.Option>
            </Select>
          </FormGroup>
          <FormGroup title="Message">
            <TextAreaField
              required
              name="message"
              onChange={onChange}
              value={groupData.message || ""}
            />
          </FormGroup>
          <FormGroup title="Add files">
            <Upload
              validFileTypes={[
                "jpg",
                "jpeg",
                "png",
                "gif",
                "pdf",
                "doc",
                "docx"
              ]}
              validImageTypesSrc={[
                "jpg",
                "jpeg",
                "png",
                "gif",
                "pdf",
                "doc",
                "docx"
              ]}
              onUploadComplete={fileUploadComplete}
              fileUploadName={"file_url"}
              deleteUrl={fileUpload}
              onDeleteComplete={fileDeleteComplete}
              uploadUrl={fileUpload}
            />
          </FormGroup>
          <br />
          <Button type="submit" loading={loading} disabled={loading}>
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default withRouter(NewTicket);
