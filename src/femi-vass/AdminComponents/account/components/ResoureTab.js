import React, {useEffect, useState} from "react";
import { Notification } from "../../../../components/common/notification";
import { errorHandler } from "../../../../components/utils/helper";
import { axiosFunc } from "../../../utils/helper";
import { providerBaseUrl } from "../../../utils/data";
import { FormGroup } from "../../../../components/common/formGroup";
import { Input } from "../../../../components/common/input";
import { Button } from "../../../../components/common/button";

const ResourceTab = props => {
  const [data, setData] = useState(props.data.throughPut || {});
  const [submit, setSubmit] = useState(false);

  const onUpdate = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Throughput Updated successfully"
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  useEffect(() => {
    axiosFunc(
        "get",
        providerBaseUrl(`?providerId=${props.providerId}`),
        null,
        "yes",
        (status, payload) => {
          if(status){
            setData(payload.data.data.throughPut || {})
          }
        }
    );
  }, [])

  const submitData = () => {
    setSubmit(true);
    axiosFunc(
      "post",
      providerBaseUrl("/update"),
      {
        throughPut: {
          ...data
        },
        providerId: props.providerId
      },
      "yes",
      onUpdate
    );
  };

  return (
    <React.Fragment>
      <div className="max-width-600">
        <div className="content-heading">Throughput per channel</div>
        <FormGroup title={"SMS"}>
          <Input
            name={"sms"}
            onChange={e =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            value={data.sms || ""}
          />
        </FormGroup>
        <FormGroup title={"USSD"}>
          <Input
            name={"ussd"}
            onChange={e =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            value={data.ussd || ""}
          />
        </FormGroup>
        <FormGroup title={"IVR"}>
          <Input
            name={"ivr"}
            onChange={e =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            value={data.ivr || ""}
          />
        </FormGroup>
        <FormGroup title={"WEB"}>
          <Input
            name={"web"}
            onChange={e =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            value={data.web || ""}
          />
        </FormGroup>

        <Button
          loading={submit}
          disabled={submit}
          onClick={submitData}
          color={"secondary"}
        >
          Update
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ResourceTab;
