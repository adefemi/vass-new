import React from "react";
import PropTypes from "prop-types";
import Icon from "react-icons-kit";
import { arrows_remove as arrowsRemove } from "react-icons-kit/linea/arrows_remove";
import ReactDOM from "react-dom";

import "./Modal.css";
import { randomIDGenerator } from "../../utils/helper";
import { getIconType } from "../notification/Notification";
import { Button } from "../button";
import { addClass } from "../select/Select";

const modalTypes = Object.freeze({
  confirm: "confirm",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
  default: "default"
});

const modalNodeCreator = () => {
  let el = document.getElementById("modal-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "modal-root";
    document.body.appendChild(el);
  }

  let node = document.createElement("div");
  let id = randomIDGenerator(6);
  node.id = "modal-node-" + id;
  addClass(node, "modal-node");
  el.prepend(node);
  return { node, id, el };
};

const ModalElement = ({
  type,
  onClick,
  closable,
  icon,
  title,
  footer,
  children,
  extra
}) => (
  <div className={`modal-main ${type}`}>
    {closable && (
      <div className={"close-button"} onClick={onClick}>
        <Icon size={30} icon={arrowsRemove} />
      </div>
    )}

    {icon && (
      <div className={"icon-contain"}>
        <Icon size={30} icon={icon} />
      </div>
    )}

    <div className="contents">
      {title && <div className={"title"}>{title}</div>}

      <div
        className={children ? "children" : "hide"}
        dangerouslySetInnerHTML={{ __html: children }}
      />
      {extra && extra}
      {footer && <div className="footer">{footer}</div>}
    </div>
  </div>
);

const removeFromDom = (parent, child) => {
  addClass(child, "closed");
  setTimeout(() => {
    if (parent.contains(child)) {
      parent.removeChild(child);
    }

    if (!parent.hasChildNodes() && document.body.contains(parent)) {
      document.body.removeChild(parent);
    }
  }, 500);
};

const Modal = props => {
  let id = randomIDGenerator(6);

  if (!props.visible) {
    return null;
  }

  return (
    <div className={`modal-root-fixed ${props.className}`}>
      <div id={id} className="modal-bubble-fixed">
        {props.closable && (
          <div className={"close-button"} onClick={props.onClose}>
            <Icon size={30} icon={arrowsRemove} />
          </div>
        )}
        {props.title && <div className="title">{props.title}</div>}

        <div className="contents">{props.children}</div>
        {props.footer && (
          <div className="footer">
            <Button
              onClick={props.onClose}
              className="closebutt"
              color={"danger"}
            >
              {props.cancelText ? props.cancelText : "Close"}
            </Button>
            <Button onClick={props.onOK} type="default" className="closebutt">
              {props.okText ? props.okText : "Ok"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

Modal.comps = props => {
  let { node, id, el } = modalNodeCreator();

  ReactDOM.render(
    <div
      id={id}
      className={`modal-bubble ${props.className}`}
      style={{ ...props.style }}
    >
      <ModalElement
        title={props.title}
        closable={true}
        type={props.type}
        icon={getIconType(props.type)}
        onClick={() => removeFromDom(el, node)}
        extra={props.extra}
      >
        {props.content}
      </ModalElement>

      <div className="components">
        <Button
          onClick={() => removeFromDom(el, node)}
          className="closebutt"
          color={"danger"}
        >
          {props.cancelText ? props.cancelText : "Close"}
        </Button>
        {props.type === modalTypes.confirm && (
          <Button
            type="default"
            onClick={val => {
              props.onOK(val);
              removeFromDom(el, node);
            }}
            className="closebutt"
          >
            {props.okText ? props.okText : "Ok"}
          </Button>
        )}
      </div>
    </div>,
    node
  );
};

Modal.success = props => {
  let type = modalTypes.success;
  return Modal.comps({
    ...props,
    type
  });
};

Modal.warning = props => {
  let type = modalTypes.warning;
  return Modal.comps({
    ...props,
    type
  });
};

Modal.error = props => {
  let type = modalTypes.error;
  return Modal.comps({
    ...props,
    type
  });
};

Modal.info = props => {
  let type = modalTypes.info;
  return Modal.comps({
    ...props,
    type
  });
};

Modal.confirm = props => {
  let type = modalTypes.confirm;
  return Modal.comps({
    ...props,
    type
  });
};

document.onclick = e => {
  let target = e.target;
  if (target.id === "modal-root") {
    document.body.removeChild(target);
  } else {
    if (target.id) {
      let stringArray = target.id.split("-");
      if (stringArray[0] === "modal" && stringArray[1] === "node") {
        let parent = document.getElementById("modal-root");
        for (let i = 0; i < parent.children.length; i++) {
          removeFromDom(parent, parent.children[i]);
        }
      }
    }
  }
};

Modal.defaultProps = {
  closable: true,
  visible: false
};

Modal.propTypes = {
  title: PropTypes.string,
  footer: PropTypes.bool,
  closable: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOK: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string
};

export default Modal;
