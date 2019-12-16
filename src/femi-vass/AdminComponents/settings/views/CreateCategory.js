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
  categoryUrl,
  fetchFileUploadStream,
  fileUpload,
  secondaryColor
} from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

const initialState = {
  control: {
    icon: null,
    name: "",
    description: "",
    dependencies: []
  },
  submit: false
};

class CreateCategory extends React.Component {
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

  onChange = evt => {
    const { control } = this.state;
    control[evt.target.name] = evt.target.value;
    this.setState({
      control
    });
  };

  onFetchData = (status, payload) => {
    if (status) {
      let activeChannel = payload.data.data[0];
      let control = {
        icon: activeChannel.icon,
        name: activeChannel.name,
        description: activeChannel.description
      };
      this.setState({ fetching: false, activeChannel, control });
    } else {
    }
  };

  componentDidMount() {
    if (this.state.edit) {
      let activeUrl = this.props.history.location.pathname.split("/");
      let activeChannelId = activeUrl[activeUrl.length - 1];
      this.setState({ activeChannelId });
      axiosFunc(
        "get",
        `${categoryUrl}?categoryId=${activeChannelId}`,
        null,
        "yes",
        this.onFetchData
      );
    }
  }

  onSubmit = (status, payload) => {
    this.setState({ submit: false });
    if (status) {
      Notification.bubble({
        type: "success",
        content: `Category ${
          this.state.edit ? "Updated" : "Added"
        } successfully`
      });
      setTimeout(() => {
        this.props.history.push("/admin/settings?category");
      }, 500);
    } else {
    }
  };

  submit = () => {
    let data = this.state.control;
    if (!data.icon) {
      Notification.bubble({
        type: "error",
        content: "Icon cannot be empty..."
      });
      return;
    }
    if (this.state.edit) {
      data = {
        ...this.state.control,
        categoryId: this.state.activeChannelId,
        dependencies: []
      };
    }
    this.setState({ submit: true });
    axiosFunc("post", categoryUrl, data, "yes", this.onSubmit);
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
          <Link to={"/admin/settings?category"}>Categories</Link>
          <Link
            to={"/admin"}
            className={"active"}
            onClick={e => e.preventDefault()}
          >
            Create Category
          </Link>
        </div>
        <Card round heading={"Create Category"}>
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
              <div className={"padding-20 create-category-top"}>
                <div className={"flex-left"}>
                  <FormGroup title={"Category name"}>
                    <Input
                      name={"name"}
                      value={this.state.control.name}
                      secondary
                      required
                      onChange={this.onChange}
                    />
                  </FormGroup>
                  <FormGroup title={"Category description"}>
                    <TextAreaField
                      placeholder={""}
                      secondary
                      name={"description"}
                      value={this.state.control.description}
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </div>

                <div className={"flex-right"}>
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
                  <div className={"upload-title"}>Upload Category Icon</div>
                </div>
              </div>

              {/*<div className="divider" />*/}
              {/*<br />*/}
              {/*<div className={"padding-20"}>*/}
              {/*<small>Specified Documents required for Category</small>*/}
              {/*<br />*/}
              {/*<br />*/}
              {/*<div className={"max-width-700"}>*/}
              {/*{this.state.control.dependencies.map((item, index) => (*/}
              {/*<div className={"flex align-c"} key={index}>*/}
              {/*<FormGroup*/}
              {/*className={"flex-1 margin-r-20"}*/}
              {/*title={"Document name"}*/}
              {/*>*/}
              {/*<Input*/}
              {/*id={index}*/}
              {/*secondary*/}
              {/*value={item.name || ""}*/}
              {/*required*/}
              {/*name={"name"}*/}
              {/*onChange={this.onChangeDependency}*/}
              {/*/>*/}
              {/*</FormGroup>*/}
              {/*<FormGroup title={"Effective From"}>*/}
              {/*<Input*/}
              {/*id={index}*/}
              {/*secondary*/}
              {/*type={"date"}*/}
              {/*value={item.effectiveFrom || ""}*/}
              {/*required*/}
              {/*name={"effectiveFrom"}*/}
              {/*onChange={this.onChangeDependency}*/}
              {/*/>*/}
              {/*</FormGroup>*/}

              {/*{this.state.control.dependencies.length > 1 && (*/}
              {/*<Icon*/}
              {/*style={{ marginLeft: "10px" }}*/}
              {/*name={"x"}*/}
              {/*size={25}*/}
              {/*onClick={() => this.removeItem(index)}*/}
              {/*type={"feather"}*/}
              {/*/>*/}
              {/*)}*/}
              {/*</div>*/}
              {/*))}*/}
              {/*</div>*/}

              {/*<div*/}
              {/*className={"flex align-c c-pointer add-new"}*/}
              {/*onClick={this.addNew}*/}
              {/*>*/}
              {/*<Add size={"15px"} color={secondaryColor} /> &nbsp;{" "}*/}
              {/*<small>Add Category</small>*/}
              {/*</div>*/}
              {/*<br />*/}
              {/*<br />*/}

              <div className="padding-20">
                <Button
                  color={"secondary"}
                  type={"submit"}
                  disabled={this.state.submit}
                  loading={this.state.submit}
                >
                  {this.state.edit ? "Update" : "Continue"}
                </Button>
              </div>
              {/*</div>*/}
            </form>
          )}
        </Card>
      </div>
    );
  }
}

export default CreateCategory;
