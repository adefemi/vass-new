import React, { useState, Fragment, useEffect } from "react";
import {
  Card,
  TextAreaField,
  Input,
  Select,
  Button,
  FormGroup,
  Upload,
  Spinner,
  Notification
} from "../../../components/common";
import {
  contentURL,
  fileUpload,
  productContentConfigUrl,
  secondaryColor
} from "../../utils/data";
import { axiosFunc } from "../../utils/helper";
import { errorHandler } from "../../../components/utils/helper";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import AppIcon from "../../../components/common/icons/Icon";
import qs from "query-string";

const TextComponent = props => {
  const [content, setContent] = useState(props.value || "");
  const totalCount = 160;

  const onChange = e => {
    setContent(e.target.value);
    props.onChange(e);
  };

  useEffect(() => {
    setContent(props.value || "");
  }, [props.value]);

  return (
    <React.Fragment>
      <TextAreaField
        required={props.required}
        name={props.name}
        value={content}
        onChange={e => onChange(e)}
      />
      <div className="counter float-right">
        {totalCount - (content.length % totalCount)} /{" "}
        {(content.length - (content.length % totalCount)) / totalCount + 1}
      </div>
      <div className="clear" />
    </React.Fragment>
  );
};

class UploadAdapter extends React.Component {
  constructor(props) {
    super(props);
    this.loader = props;
  }

  upload() {
    const data = new FormData();
    // data.append("typeOption", "upload_image");
    data.append("file_url", this.loader.file);

    return axios({
      url: fileUpload,
      method: "post",
      data
      // headers: {
      //   'Authorization': tokenCopyPaste()
      // },
      // withCredentials: true
    })
      .then(res => {
        let resData = res.data;
        resData.default = resData.url;
        return resData;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}

class ContentManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: null,
      deliveryName: "",
      smsType: null,
      ussdType: null,
      ivrType: null,
      webType: null,
      fetching: true,
      edit: props.edit ? true : false,
      productConfig: {},
      config: {},
      attribute: {},
      submit: false,
      webContent: "add content here"
    };
  }

  onChangeMain = e => {
    this.setState({
      ...this.state,
      attribute: {
        ...this.state.attribute,
        [e.target.name]: e.target.value
      }
    });
  };

  onChange = (e, key) => {
    this.setState({
      ...this.state,
      config: {
        ...this.state.config,
        [key]: {
          ...this.state.config[key],
          [e.target.name]: e.target.value
        }
      }
    });
  };

  onFetchData = (status, payload) => {
    if (status) {
      let activeChannel = payload.data.data;

      if (!activeChannel) {
        this.setState({
          fetching: false,
          productConfig: activeChannel
        });
      } else {
        this.setState(
          {
            fetching: false,
            productConfig: activeChannel,
            deliveryName: activeChannel.deliveryMethod.name,
            smsType:
              activeChannel.sources.sms && activeChannel.sources.sms.type,
            ussdType:
              activeChannel.sources.ussd && activeChannel.sources.ussd.type,
            ivrType:
              activeChannel.sources.ivr && activeChannel.sources.ivr.type,
            webType: activeChannel.sources.web && activeChannel.sources.web.type
          },
          () => {
            if (this.props.edit) {
              const parser = qs.parse(this.props.location.search);
              const contentId = parser.contentId;
              axiosFunc(
                "get",
                contentURL(`?content_id=${contentId}`),
                null,
                "yes",
                (status, payload) => {
                  if (status) {
                    this.setState({ edit: false });
                    this.setupEditData(payload.data.data);
                  } else {
                  }
                }
              );
            }
          }
        );
      }
    } else {
    }
  };

  setupEditData = data => {
    let new_data = {};
    new_data.attribute = data[0].attribute;
    data.map(item => {
      new_data.config = {
        ...new_data.config,
        [item.type === "ussd" ? "sms" : item.type]: item.content
      };
    });
    this.setState({ ...new_data });
  };

  componentDidMount() {
    let productId = this.props.match.params["slug"];
    this.setState({ productId });

    axiosFunc(
      "get",
      productContentConfigUrl(productId),
      null,
      "yes",
      this.onFetchData
    );
  }

  imageUploaded = (e, key = "ivr") => {
    if (key === "ivr") {
      this.setState({
        ...this.state,
        config: {
          ...this.state.config,
          [key]: {
            ...this.state.config[key],
            audio_file: e.data.id
          }
        }
      });
    } else {
      this.setState({
        ...this.state,
        config: {
          ...this.state.config,
          [key]: {
            ...this.state.config[key],
            featured_image: e.data.id
          }
        }
      });
    }
  };

  onComplete = (status, payload) => {
    this.setState({ submit: "" });
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Content created successfully"
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  onSave = () => {
    let attribute = { ...this.state.attribute };

    if (this.state.deliveryName.toLowerCase() === "daily") {
      if (!this.state.attribute.date) {
        alert("provide a delivery date");
        return;
      } else {
        attribute.name = "daily";
      }
    } else {
      if (
        !this.state.attribute["age"] ||
        !this.state.attribute["metric"] ||
        !this.state.attribute["description"]
      ) {
        alert("provide a delivery info");
        return;
      } else {
        attribute.name = this.state.deliveryName.toLowerCase();
      }
    }

    let config = this.state.config;
    if (config.sms && this.state.ussdType) {
      config.ussd = config.sms;
    } else if (config.ussd && this.state.smsType) {
      config.sms = config.ussd;
    }

    const data = {
      product_id: this.state.productId,
      contents: this.state.config,
      attribute
    };

    if (this.props.edit) {
      const parser = qs.parse(this.props.location.search);
      data.content_id = parser.contentId;
    }

    this.setState({ submit: true });

    axiosFunc("post", contentURL(), data, "yes", this.onComplete);
  };

  render() {
    const testFetching = this.props.edit
      ? this.state.edit
      : this.state.fetching;
    return (
      <React.Fragment>
        <br />{" "}
        {testFetching ? (
          <div className="max-width-1200">
            <Spinner color={secondaryColor} />
          </div>
        ) : !this.state.productConfig ? (
          <div className="max-width-1200">
            <div>No Configuration found</div>
          </div>
        ) : (
          <div className="max-width-1200">
            {this.props.edit && (
              <div style={{ marginBottom: 10 }}>
                <div className="flex align-center">
                  <div
                    className="link"
                    style={{ marginRight: 20 }}
                    onClick={() => this.props.history.goBack()}
                  >
                    <AppIcon type="feather" name="arrowLeft" />
                  </div>
                  <div
                    className="heading"
                    style={{ fontWeight: "500", fontSize: 18 }}
                  >
                    Edit
                  </div>
                </div>
              </div>
            )}
            <Card
              heading={
                <Fragment>
                  Delivery Method{" "}
                  <span
                    className="header-type"
                    style={{ textTransform: "capitalize" }}
                  >
                    {this.state.attribute.deliveryName}
                  </span>
                </Fragment>
              }
            >
              <div className={"padding-20 max-width-600"}>
                {this.state.deliveryName &&
                this.state.deliveryName.toLowerCase() === "daily" ? (
                  <div className="form-group">
                    <label htmlFor="date">Delivery Date</label>
                    <Input
                      onChange={this.onChangeMain}
                      type="date"
                      value={this.state.attribute.date || ""}
                      name="date"
                    />
                  </div>
                ) : (
                  <Fragment>
                    <FormGroup title={"Content Age"}>
                      <Input
                        onChange={this.onChangeMain}
                        type="text"
                        value={this.state.attribute.age || ""}
                        name="age"
                      />
                      <Select
                        required
                        onChange={this.onChangeMain}
                        name="metric"
                        id=""
                        value={this.state.attribute.metric || ""}
                      >
                        <Select.Option value="">
                          Select metric type
                        </Select.Option>
                        <Select.Option value="years">years</Select.Option>
                      </Select>
                    </FormGroup>
                    <FormGroup title={"Body"}>
                      <TextAreaField
                        onChange={this.onChangeMain}
                        required
                        value={this.state.attribute.description || ""}
                        name="description"
                      />
                    </FormGroup>
                  </Fragment>
                )}
              </div>
            </Card>{" "}
            <br />
            {(this.state.smsType || this.state.ussdType) && (
              <React.Fragment>
                <Card
                  className={
                    this.state.smsType &&
                    this.state.smsType.toLowerCase() !== "default" &&
                    (this.state.ussdType &&
                      this.state.ussdType.toLowerCase() !== "default")
                      ? "hide"
                      : ""
                  }
                  heading={
                    <Fragment>
                      {this.state.smsType &&
                        this.state.smsType.toLowerCase() === "default" &&
                        "SMS"}
                      {this.state.smsType &&
                        this.state.smsType.toLowerCase() === "default" &&
                        (this.state.ussdType &&
                          this.state.ussdType.toLowerCase() === "default") &&
                        " / "}
                      {this.state.ussdType &&
                        this.state.ussdType.toLowerCase() === "default" &&
                        "USSD"}
                    </Fragment>
                  }
                >
                  <div className="padding-20 max-width-600">
                    <FormGroup title={"Message"}>
                      <TextComponent
                        onChange={e => {
                          this.onChange(e, "sms");
                        }}
                        required
                        value={
                          (this.state.config["sms"] &&
                            this.state.config["sms"].message) ||
                          ""
                        }
                        name="message"
                      />
                    </FormGroup>
                  </div>
                </Card>{" "}
                <br />
              </React.Fragment>
            )}
            {this.state.ivrType && (
              <React.Fragment>
                <Card
                  className={
                    this.state.ivrType.toLowerCase() !== "default" ? "hide" : ""
                  }
                  heading={<Fragment>IVR</Fragment>}
                >
                  <div className="padding-20 max-width-600">
                    <div className="form-group">
                      <FormGroup title={"Product"}>
                        <Upload
                          single
                          validFileTypes={["mp3", "wav", "aff"]}
                          validImageTypesSrc={["mp3", "wav", "aff"]}
                          onUploadComplete={e => this.imageUploaded(e, "ivr")}
                          fileUploadName={"file_url"}
                          uploadUrl={fileUpload}
                        />
                      </FormGroup>
                      <div className="info input-small-top">
                        Supported types includes: Mp3, WAV and AFF
                      </div>
                    </div>
                  </div>
                </Card>{" "}
                <br />
              </React.Fragment>
            )}
            {this.state.webType && (
              <React.Fragment>
                <Card
                  className={
                    this.state.webType &&
                    this.state.webType.toLowerCase() !== "default" &&
                    this.state.webType &&
                    this.state.webType.toLowerCase() !== "default"
                      ? "hide"
                      : ""
                  }
                  heading={<Fragment>WEB</Fragment>}
                >
                  <div className="padding-20 max-width-600">
                    <FormGroup title={"Title"}>
                      <Input
                        onChange={e => this.onChange(e, "web")}
                        required
                        type="text"
                        value={
                          (this.state.config["web"] &&
                            this.state.config["web"].title) ||
                          ""
                        }
                        name="title"
                      />
                    </FormGroup>
                    <FormGroup title={"Featured Image"}>
                      <Upload
                        single
                        onUploadComplete={e => this.imageUploaded(e, "web")}
                        fileUploadName={"file_url"}
                        uploadUrl={fileUpload}
                      />
                    </FormGroup>
                    <div className="info input-small-top">
                      Supported types includes: JPG, PNG and JPEG
                    </div>
                  </div>
                  <div className="padding-20">
                    <FormGroup title={"Body"}>
                      <CKEditor
                        editor={ClassicEditor}
                        data={
                          (this.state.config["web"] &&
                            this.state.config["web"].html) ||
                          ""
                        }
                        onInit={editor => {
                          editor.plugins.get(
                            "FileRepository"
                          ).createUploadAdapter = function(loader) {
                            return new UploadAdapter(loader);
                          };
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          let e = {
                            target: {
                              name: "html",
                              value: data
                            }
                          };
                          this.onChange(e, "web");
                        }}
                      />
                    </FormGroup>
                  </div>
                </Card>
                <br />
              </React.Fragment>
            )}
            <br />
            <Button
              loading={this.state.submit}
              disabled={this.state.submit}
              onClick={this.onSave}
            >
              {this.props.edit ? "Update" : "Save"} Content
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ContentManagement;
