import React from "react";
import {
  Button,
  Card,
  FormGroup,
  Input,
  Notification,
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
  networkUrl,
  primaryColor,
  secondaryColor
} from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

const initialState = {
  control: {
    icon: "",
    name: "",
    description: ""
  },
  submit: false
};

class CreateNetwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...cloneDeep(initialState), edit: props.edit };

    if (props.edit) {
      this.state = {
        ...this.state,
        fetching: true,
        activeNetwork: null,
        activeNetworkId: null
      };
    }
  }

  state = cloneDeep(initialState);

  onFetchData = (status, payload) => {
    if (status) {
      let activeNetwork = payload.data.data;
      let control = {
        icon: activeNetwork.icon,
        name: activeNetwork.name,
        description: activeNetwork.description
      };
      this.setState({ fetching: false, activeNetwork, control });
    } else {
    }
  };

  componentDidMount() {
    if (this.state.edit) {
      let activeUrl = this.props.history.location.pathname.split("/");
      let activeNetworkId = activeUrl[activeUrl.length - 1];
      this.setState({ activeNetworkId });
      axiosFunc(
        "get",
        `${networkUrl("fetch")}?networkId=${activeNetworkId}`,
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
        content: `Network ${this.state.edit ? "Updated" : "Added"} successfully`
      });
      setTimeout(() => {
        this.props.history.push("/admin/settings?network");
      });
    } else {
    }
  };

  submit = () => {
    this.setState({ submit: true });
    let data = this.state.control;
    if (!data.icon) {
      Notification.bubble({
        type: "error",
        content: "Icon cannot be empty..."
      });
      return;
    }
    if (this.state.edit) {
      data = { ...this.state.control, networkId: this.state.activeNetworkId };
    }
    axiosFunc("post", networkUrl(), data, "yes", this.onSubmit);
  };

  imageUploaded = e => {
    const { control } = this.state;
    control.icon = e.data.id;
    this.setState({
      control
    });
  };

  render() {
    return (
      <div className={"max-width-1200"}>
        <div className="breadcrum">
          <Link to={"/admin/settings?network"}>Networks</Link>
          <Link
            to={"/admin"}
            className={"active"}
            onClick={e => e.preventDefault()}
          >
            {this.state.edit ? "Edit" : "Create"} Network
          </Link>
        </div>
        <Card round heading={`${this.state.edit ? "Edit" : "Create"} Network`}>
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
                              this.state.control.icon
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
                  Upload Network logo
                </div>
                <br />
                <br />
                <FormGroup title={"Network name"}>
                  <Input
                    name={"name"}
                    value={this.state.control.name || ""}
                    secondary
                    required
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup title={"Network description"}>
                  <TextAreaField
                    placeholder={""}
                    secondary
                    name={"description"}
                    value={this.state.control.description || ""}
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

export default CreateNetwork;
