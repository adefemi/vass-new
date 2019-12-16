import React from "react";
import shortId from "shortid";
import axios from "axios";
import propTypes from "prop-types";

import "./FileUpload.css";
import emptyFile from "./assets/file-blank.png";
import brokenFile from "./assets/file-broken.png";
import { addClass, hasClass } from "../select/Select";
import { Icon } from "../icons";
import { Notification } from "../notification";
import { isDescendant, validateFileInput } from "../../utils/helper";
import { Upload } from "../customIcon";

let proptypes = {
  files: propTypes.arrayOf(propTypes.object),
  validFileTypes: propTypes.array,
  validImageTypesSrc: propTypes.array,
  uploadUrl: propTypes.string.isRequired,
  deleteUrl: propTypes.string,
  previewFunc: propTypes.func,
  fileUploadName: propTypes.string,
  uploadMethod: propTypes.string,
  otherUploadData: propTypes.arrayOf(propTypes.object),
  className: propTypes.string,
  style: propTypes.object,
  single: propTypes.bool,
  showLocal: propTypes.bool,
  onUploadComplete: propTypes.func,
  onDeleteComplete: propTypes.func,
  raw: propTypes.bool,
  checkExtension: propTypes.bool
};

class FileUpload extends React.Component {
  fileRef = {};
  id = shortId.generate();
  state = {
    fileArray: []
  };

  validImageTypes = this.props.validFileTypes;
  validImageTypesSrc = this.props.validImageTypesSrc;
  url = this.props.uploadUrl;
  removeUrl = this.props.deleteUrl;

  controlLoader = (el, file, id) => {
    if (this.props.raw) {
      this.props.onUploadComplete(file[0]);
      return;
    }
    let method = this.props.uploadMethod;

    let filename = this.props.fileUploadName;
    let otherInfoArray = this.props.otherUploadData;

    let fileUpload = new FormData();
    fileUpload.append(filename, file[0]);

    if (otherInfoArray && otherInfoArray.length > 0) {
      for (let i = 0; i < otherInfoArray.length; i++) {
        fileUpload.append(
          otherInfoArray[parseInt(i, 10)].name,
          otherInfoArray[parseInt(i, 10)].value
        );
      }
    }

    axios({
      method,
      url: this.url,
      data: fileUpload,
      onUploadProgress: uploadEvt => {
        let percentCompleted = Math.round(
          (uploadEvt.loaded * 100) / uploadEvt.total
        );
        let progress = el.querySelector(".progress-circle");
        progress.dataset.progress = 0;
        progress.dataset.progress = percentCompleted;
      }
    }).then(
      res => {
        el.id = res.data.data.id;
        this.displayImageSrc(
          res.data.data[filename.toString()],
          res.data.data.id
        );
        setTimeout(() => {
          addClass(el.querySelector(".loading"), "close");
          if (this.props.onUploadComplete) {
            this.props.onUploadComplete(res.data);
          }
        }, 500);
      },
      err => {
        this.displayImageSrc("", id, true);
        if (!hasClass(el.querySelector(".loading"), "close")) {
          setTimeout(() => {
            addClass(el.querySelector(".loading"), "close");
          }, 500);
        }
      }
    );
  };

  deleteFile = (id, obj) => {
    if (!this.props.deleteUrl) {
      return;
    }
    axios({
      method: "delete",
      url: this.removeUrl + id
    })
      .then(res => {
        this.props.onDeleteComplete(id);
      })
      .catch(err => {
        this.props.onDeleteComplete(id);
      });
  };

  displayImage = (file, id) => {
    let files = file.files;

    let controlLoader = this.controlLoader;

    if (!this.validImageTypes.includes(files[0]["type"])) {
      setTimeout(() => {
        let el = document.getElementById(id);
        controlLoader(el, files, id);
        let imgNode = el.getElementsByTagName("img")[0];
        imgNode.src = emptyFile;
        imgNode.alt = files[0]["name"];
        return;
      }, 200);
      return;
    }

    let reader = new FileReader();

    reader.onload = function(frEvent) {
      let el = document.getElementById(id);

      controlLoader(el, files, id);
      let imgNode = el.getElementsByTagName("img")[0];
      imgNode.src = frEvent.target.result;
      imgNode.alt = files[0]["name"];
      return;
    };
    reader.readAsDataURL(files[0]);
  };

  displayImageSrc = (fileSrc, id, status = false) => {
    if (status) {
      setTimeout(() => {
        let el = document.getElementById(id);
        if (!hasClass(el, "error")) {
          addClass(el, "error");
        }
        let imgNode = el.getElementsByTagName("img")[0];
        imgNode.src = brokenFile;
        imgNode.alt = "File Corrupted";
        return null;
      }, 200);
      return;
    }

    if (!fileSrc) {
      return;
    }

    let srcPath = fileSrc.split("/");
    let filePath = srcPath[srcPath.length - 1].split(".");
    let extension = filePath[filePath.length - 1];

    let checkExtention = extension.split("?");
    if (checkExtention.length > 1) {
      extension = checkExtention[0];
    }
    if (extension) {
      if (!["gif", "jpeg", "png", "jpg"].includes(extension)) {
        setTimeout(() => {
          let el = document.getElementById(id);
          let imgNode = el.getElementsByTagName("img")[0];
          imgNode.src = emptyFile;
          imgNode.alt = srcPath[srcPath.length - 1];
          return null;
        }, 200);
        return;
      }
    }

    setTimeout(() => {
      let el = document.getElementById(id);
      let imgNode = el.getElementsByTagName("img")[0];
      imgNode.src = fileSrc;
      imgNode.alt = srcPath[srcPath.length - 1];
      return null;
    }, 200);
  };

  removeFile = e => {
    let parents = document.getElementsByClassName("file-upload-items");
    let child = e.target;

    let activeParent = parents[0];

    for (let i = 0; i < parents.length; i++) {
      if (isDescendant(parents[parseInt(i, 10)], child)) {
        activeParent = parents[parseInt(i, 10)];
        break;
      }
    }

    let el = document.getElementById(activeParent.id);
    let parentEl = document.getElementById(this.id);

    addClass(el, "close");
    if (!hasClass(el, "error")) {
      this.deleteFile(activeParent.id, activeParent);
    }
    setTimeout(() => parentEl.removeChild(el), 400);
  };

  previewFile = e => {
    let parents = document.getElementsByClassName("file-upload-items");
    let child = e.target;

    let activeParent = parents[0];

    for (let i = 0; i < parents.length; i++) {
      if (isDescendant(parents[parseInt(i, 10)], child)) {
        activeParent = parents[parseInt(i, 10)];
        break;
      }
    }

    let el = document.getElementById(activeParent.id);

    let imgFile = el.getElementsByTagName("img")[0];
    this.props.previewFunc(imgFile.src);
  };

  onChangeFile = e => {
    let files = e.target;

    let contentID = shortId.generate();

    if (!validateFileInput(files.files, this.props.validFileTypes)) {
      alert("invalid file type");
      return;
    }

    let content = (
      <div key={contentID} id={contentID} className="file-upload-items">
        {!this.props.raw && (
          <div className="loading">
            <div className="progress-circle" data-progress="0" />
            <p className="progress-info" variant="p" data-info="Uploading..." />
          </div>
        )}
        <div className="file-upload-controls">
          {this.props.previewFunc && (
            <button
              className="preview-button"
              type="button"
              onClick={this.previewFile}
            >
              <Icon type="metrize" name="eye" size={30} />
            </button>
          )}

          {!this.props.single && (
            <button type="button" onClick={this.removeFile}>
              <Icon type="metrize" name="cross" size={30} />
            </button>
          )}
          {this.props.single && (
            <button type="button" onClick={() => this.fileRef.click()}>
              <Icon type="feather" name="refreshCw" size={30} />
            </button>
          )}
        </div>
        <img src="" alt="" />
      </div>
    );

    const { fileArray } = this.state;
    if (this.props.single) {
      fileArray[0] = content;
    } else {
      fileArray.push(content);
    }

    this.setState({ fileArray }, this.displayImage(files, contentID));
  };

  loadExistingFiles = data => {
    const { fileArray } = this.state;
    data.map((file, key) => {
      let content = (
        <div key={key} id={file.id} className="file-upload-items">
          <div className="file-upload-controls">
            {this.props.previewFunc && (
              <button
                className="preview-button"
                type="button"
                onClick={this.previewFile}
              >
                <Icon type="metrize" name="eye" size={30} />
              </button>
            )}
            {!this.props.single && (
              <button type="button" onClick={this.removeFile}>
                <Icon type="metrize" name="cross" size={30} />
              </button>
            )}
            {this.props.single && (
              <button type="button" onClick={() => this.fileRef.click()}>
                <Icon type="feather" name="refreshCw" size={30} />
              </button>
            )}
          </div>
          <img src="" alt="" />
        </div>
      );

      fileArray.push(content);
      this.setState({ fileArray }, this.displayImageSrc(file.image, file.id));
      return null;
    });
  };

  componentDidMount() {
    if (this.props.files && this.props.files.length > 0) {
      this.loadExistingFiles(this.props.files);
    }
  }

  render() {
    const { fileArray } = this.state;
    return (
      <div
        className={`file-upload-main ${this.props.className} ${this.props
          .single && "single"}`}
        id={this.id}
        style={this.props.style}
      >
        {fileArray.map(file => file)}

        {this.props.single && fileArray.length > 0 ? null : (
          <button
            className="file-upload-button"
            type="button"
            onClick={() => this.fileRef.click()}
          >
            <div>
              <Upload color={"#ffffff"} size={"30px"} />
            </div>
          </button>
        )}

        <div className="clear" />

        <input
          onChange={this.onChangeFile}
          ref={ref => (this.fileRef = ref)}
          type="file"
          style={{ display: "none" }}
        />

        <div />
      </div>
    );
  }
}

FileUpload.propTypes = proptypes;

FileUpload.defaultProps = {
  validFileTypes: ["gif", "jpeg", "png", "jpg"],
  validImageTypesSrc: ["gif", "jpeg", "png", "jpg"],
  fileUploadName: "image",
  uploadMethod: "POST",
  single: false,
  showLocal: false,
  checkExtension: false,
  raw: false
};

export default FileUpload;
