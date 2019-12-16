import React from "react";
import {
  Button,
  Card,
  FormGroup,
  Input,
  Notification,
  Select,
  Spinner,
  TextAreaField,
  Upload
} from "../../../../components/common";
import { Link } from "react-router-dom";
import cloneDeep from "clone-deep";
import { axiosFunc } from "../../../utils/helper";
import {
  fetchFileUploadStream,
  fileUpload,
  payChannelUrl,
  primaryColor,
  secondaryColor,
} from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

const initialState = {
  control: {
    logo: null,
    name: "",
    type: "AIRTIME",
    description: ""
  },
  submit: false
};

class CreateChannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...cloneDeep(initialState), edit: props.edit };

    if (props.edit) {
      this.state = {
        ...this.state,
        fetching: true,
        activeChannel: null,
        activeChannelId: null
      };
    }
  }

  state = cloneDeep(initialState);

  onFetchData = (status, payload) => {
    if (status) {
      let activeChannel = payload.data.data;
      let control = {
        logo: activeChannel.logo,
        name: activeChannel.name,
        type: activeChannel.type,
        description: activeChannel.description
      };
      this.setState({ fetching: false, activeChannel, control });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  componentDidMount() {
    if (this.state.edit) {
      let activeUrl = this.props.history.location.pathname.split("/");
      let activeChannelId = activeUrl[activeUrl.length - 1];
      this.setState({ activeChannelId });
      axiosFunc(
        "get",
        `${payChannelUrl("fetch")}?paymentChannelId=${activeChannelId}`,
        null,
        "yes",
        this.onFetchData
      );
    }
  }

  onChange = evt => {
    const { control } = this.state;
    control[evt.target.name] = evt.target.value;
    this.setState({
      control
    });
  };

  onSubmit = (status, payload) => {
    this.setState({ submit: false });
    if (status) {
      Notification.bubble({
        type: "success",
        content: `Payment Channel ${
          this.state.edit ? "Updated" : "Added"
        } successfully`
      });
      setTimeout(() => {
        this.props.history.push("/admin/settings?channel")
      })
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });

      this.setState({ submit: false });

    }
  };

  submit = () => {
    this.setState({ submit: true });
    let data = this.state.control;

    if (!data.logo) {
      Notification.bubble({
        type: "error",
        content: "Logo cannot be empty..."
      });
      this.setState({ submit: false });
      return;
    }
    if (this.state.edit) {
      data = {
        ...this.state.control,
        paymentChannelId: this.state.activeChannelId
      };
    }
    axiosFunc("post", payChannelUrl(), data, "yes", this.onSubmit);
  };

  imageUploaded = e => {
    const { control } = this.state;
    control.logo = e.data.id;
    this.setState({
      control
    });
  };

  render() {
    return (
      <div className={"max-width-1200"}>
        <div className="breadcrum">
          <Link to={"/admin/settings?channel"}>Channels</Link>
          <Link
            to={"/admin"}
            className={"active"}
            onClick={e => e.preventDefault()}
          >
            {this.state.edit ? "Edit" : "Create"} Channel
          </Link>
        </div>
        <Card
          round
          heading={`${this.state.edit ? "Edit" : "Create"} Payment Channel`}
        >
          {this.state.fetching ? (
            <div className={"padding-20"}>
              <Spinner color={secondaryColor} />
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                this.submit();
              }}
            >
              <div className={"padding-20 max-width-600"}>
                <Upload
                  single
                  onUploadComplete={this.imageUploaded}
                  fileUploadName={"file_url"}
                  uploadUrl={fileUpload}
                  files={
                    this.state.edit
                      ? [
                          {
                            id: 1,
                            image: fetchFileUploadStream(
                              this.state.control.logo
                            )
                          }
                        ]
                      : null
                  }
                />
                <div className="clear" />
                <div
                  className={"upload-title"}
                  style={{
                    fontSize: "13px",
                    color: primaryColor,
                    marginTop: "10px",
                    marginLeft: "10px"
                  }}
                >
                  Upload Channel logo
                </div>
                <br />
                <br />
                <FormGroup title={"Channel name"}>
                  <Input
                    name={"name"}
                    value={this.state.control.name || ""}
                    secondary
                    required
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup title={"Channel type"}>
                  <Select
                    value={this.state.control.type || ""}
                    onChange={this.onChange}
                    name={"type"}
                  >
                    <Select.Option value={"AIRTIME"}>AIRTIME</Select.Option>
                    <Select.Option value={"PAYMENT_GATEWAY"}>
                      PAYMENT GATEWAY
                    </Select.Option>
                  </Select>
                </FormGroup>
                <FormGroup title={"Channel description"}>
                  <TextAreaField
                    placeholder={""}
                    secondary
                    name={"description"}
                    value={this.state.control.description}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <br />

                <Button
                  type={"submit"}
                  color={"secondary"}
                  disabled={this.state.submit}
                  loading={this.state.submit}
                >
                  {this.state.edit ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    );
  }
}

export default CreateChannel;
