import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/common/button";
import { Card } from "../../../../components/common/card";
import { Modal } from "../../../../components/common/modal";
import { FormGroup } from "../../../../components/common/formGroup";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";
import { axiosFunc } from "../../../utils/helper";
import { supportUrlMain } from "../../../utils/data";
import { Notification } from "../../../../components/common/notification";
import { errorHandler } from "../../../../components/utils/helper";
import { withRouter } from "react-router-dom";
import moment from "moment";
import TicketInfo from "./ticketInfo";
import { Select } from "../../../../components/common/select";

const columns = [
  {
    title: "Created",
    dataIndex: "created",
    key: "created"
  },
  {
    title: "Ticket ID",
    dataIndex: "ticket_id",
    key: "ticket_id"
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Critical",
    dataIndex: "critical",
    key: "critical"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

const fillData = (
  props,
  dataList,
  setActiveTicket,
  updateTicket,
  setShowModal,
  setTicketData
) => {
  const newArray = [];

  dataList.map((item, id) => {
    newArray.push({
      key: id,
      created: moment(new Date(item.createdAt)).format("DD-MM-YYYY"),
      ticket_id: item.ticketId,
      title: item.title,
      status: item.status,
      critical: item.isCritical ? "Critical" : "Not critical",
      action: (
        <div>
          <span className="link" onClick={() => setActiveTicket(item)}>
            View Ticket
          </span>
          {updateTicket && (
            <>
              {" "}
              |{" "}
              <span
                className="link"
                onClick={() => {
                  setTicketData(item);
                  setShowModal(true);
                }}
              >
                Update Ticket
              </span>
            </>
          )}
        </div>
      )
    });
    return null;
  });
  return newArray;
};

function Tickets(props) {
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketData, setTicketData] = useState({});

  const onChange = e => {
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchSupportGroup(1);
  }, []);

  const fetchSupportGroup = page => {
    setFetching(true);
    axiosFunc(
      "get",
      supportUrlMain("tickets?page=1&limit=10"),
      null,
      "yes",
      (status, data) => {
        if (status) {
          setCategories(data.data);
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

  const onSaveGroup = e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...ticketData
    };
    axiosFunc(
      "post",
      supportUrlMain("tickets/create"),
      data,
      "yes",
      (status, data) => {
        setLoading(false);
        if (status) {
          Notification.bubble({
            type: "success",
            content: "Ticket update successfully"
          });
          setShowModal(false);
          fetchSupportGroup(1);
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
        title="Update Ticket"
        onClose={() => setShowModal(false)}
        visible={showModal}
      >
        <form onSubmit={onSaveGroup}>
          <FormGroup heading="status">
            <Select
              value={ticketData.status || "OPEN"}
              onChange={onChange}
              name="status"
              required
            >
              <Select.Option value="OPEN">OPEN</Select.Option>
              <Select.Option value="CLOSED">CLOSED</Select.Option>
            </Select>
          </FormGroup>
          <FormGroup heading="status">
            <Select
              value={ticketData.isCritical || false}
              onChange={onChange}
              name="isCritical"
              required
            >
              <Select.Option value={false}>Not Critical</Select.Option>
              <Select.Option value={true}>Critical</Select.Option>
            </Select>
          </FormGroup>
          <Button type="submit" loading={loading} disabled={loading}>
            Update
          </Button>
        </form>
      </Modal>
      {activeTicket && (
        <TicketInfo
          activeTicket={activeTicket}
          close={() => setActiveTicket(null)}
        />
      )}
      <div className="flex align-c justify-between">
        <div className="heading-main">Tickets</div>
        {props.access.createTicket && (
          <Button
            onClick={() => props.history.push("/admin/support/ticket/new")}
          >
            Create Ticket
          </Button>
        )}
      </div>
      <br />
      <Card round>
        {props.access.viewTicket ? (
          <>
            <Table
              loading={fetching}
              columns={columns}
              dataSource={
                fetching
                  ? []
                  : fillData(
                      props,
                      categories.data,
                      setActiveTicket,
                      props.access.updateTicket,
                      setShowModal,
                      setTicketData
                    )
              }
              pagination={false}
            />
            <br />
            <div className="tab-content padding-20">
              <div className="flex justify-between align-c">
                <div />
                <Pagination
                  onChange={page => fetchSupportGroup(page)}
                  current={fetching ? 1 : parseInt(categories.page)}
                  total={fetching ? 1 : categories.total}
                />
              </div>
            </div>
          </>
        ) : (
          <div>You cannot view tickets</div>
        )}
      </Card>
    </div>
  );
}

export default withRouter(Tickets);
