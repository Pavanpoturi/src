import { Card, Modal } from "antd";
import { isUndefined } from "lodash";
import moment from "moment";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SuspectAccused from "../SuspectAccused";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { first, isEmpty } from "lodash";
const { Meta } = Card;

export default function DeceasedCard({ deceasedPersonalDetails, title="" }) {
  const { deceasedList } = useSelector((state) => state.CommonRequest);
  const { personalDetails, contactDetails } =
    !isUndefined(deceasedPersonalDetails) && deceasedPersonalDetails;
  const { gender, dateOfBirth, occupation } =
    !isUndefined(personalDetails) && personalDetails;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewRecord, setviewRecord] = useState(null);

  useEffect(() => {
    if (!isEmpty(deceasedList)) {
      setviewRecord(
        first(
          deceasedList.filter(
            (item) =>
              item.isSuspectOrAccused === "Accused" &&
              deceasedPersonalDetails?._id === item?.person?._id
          )
        )
      );
    }
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="widgetPageStyle" style={{ paddingTop: "10px" }}>
      <Card style={{ width: 250 }}>
        <Meta
          avatar={<Avatar shape="square" size={50} icon={<UserOutlined />} />}
          title={deceasedPersonalDetails?.label}
          description={
            <>
              <p>
                {gender || ""}
                {gender ? ", " : ""}{" "}
                {dateOfBirth
                  ? `${moment().diff(dateOfBirth, "years")} Years`
                  : ""}
              </p>
              <p>{occupation || ""}</p>
              <p>
                {contactDetails?.length > 0
                  ? contactDetails[0]?.phoneNumber
                  : ""}
              </p>
              <div className="linkStyle" onClick={showModal}>
                View Details
              </div>
            </>
          }
        />
        <Modal
          title={title || "Accused Details"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          <SuspectAccused hideRecords={true} viewRecord={viewRecord} />
        </Modal>
      </Card>
    </div>
  );
}
