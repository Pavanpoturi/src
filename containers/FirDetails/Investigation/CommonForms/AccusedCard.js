import { Card, Col, Modal, Row } from "antd";
import moment from "moment";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { first, isUndefined } from "lodash";

const { Meta } = Card;

const itemTitle = {
  color: "gray",
  textAlign: "right",
  paddingRight: 10,
};

export default function AccusedCard({ accusedPersonalDetails, title = "" }) {
  const { personalDetails, contactDetails, presentAddress } =
    !isUndefined(accusedPersonalDetails) && accusedPersonalDetails;
  const {
    name,
    surname,
    gender,
    occupation,
    caste,
    subCaste,
    religion,
    nationality,
  } = !isUndefined(personalDetails) && personalDetails;
  const {
    houseNo,
    streetRoadNo,
    wardColony,
    landmarkMilestone,
    localityVillage,
    areaMandal,
    district,
    stateUt,
    residencyType,
    pinCode,
  } = !isUndefined(presentAddress) && presentAddress;
  const contactDetail = !isUndefined(contactDetails) && first(contactDetails);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const doB = personalDetails?.dateOfBirth
    ? `${moment().diff(personalDetails?.dateOfBirth, "years")} Years `
    : "";
  const ageDetails = personalDetails?.age
    ? `${personalDetails?.age} Years`
    : doB;

  return (
    <div className="widgetPageStyle" style={{ paddingTop: "10px" }}>
      <Card style={{ width: 250 }}>
        <Meta
          avatar={<Avatar shape="square" size={50} icon={<UserOutlined />} />}
          title={accusedPersonalDetails?.label}
          description={
            <>
              <p>
                {name || ""} {surname || ""}, {gender || ""}{" "}
                {gender ? ", " : ""}
                {ageDetails || ""}
              </p>
              <p>{occupation || ""}</p>
              <p>
                {contactDetails?.length > 0 ? contactDetail?.phoneNumber : ""}
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
          <Row gutter={24}>
            <Col span={8}>
              <Card title="Personal Details" style={{ minHeight: 370 }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={itemTitle}>Full Name:</td>
                      <td>
                        {name} {surname}
                      </td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Alias Name:</td>
                      <td>{personalDetails?.alias || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Gender:</td>
                      <td>{gender || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>DOB:</td>
                      <td>{ageDetails || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Occupation:</td>
                      <td>{occupation || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Caste:</td>
                      <td>{caste || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>SubCaste:</td>
                      <td>{subCaste || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Religion:</td>
                      <td>{religion || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Nationality:</td>
                      <td>{nationality || ""}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Address Details" style={{ minHeight: 370 }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={itemTitle}>House No:</td>
                      <td>{houseNo || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Street / Road No:</td>
                      <td>{streetRoadNo || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Ward / Colony:</td>
                      <td>{wardColony || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Landmark/Milestone:</td>
                      <td>{landmarkMilestone || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Locality / Village:</td>
                      <td>{localityVillage || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Area / Mandal:</td>
                      <td>{areaMandal || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>District:</td>
                      <td>{district || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>State/UT:</td>
                      <td>{stateUt || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Residency Type:</td>
                      <td>{residencyType || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>PIN Code:</td>
                      <td>{pinCode || ""}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Identity Details" style={{ minHeight: 370 }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={itemTitle}>Phone Number:</td>
                      <td>{contactDetail?.phoneNumber || ""}</td>
                    </tr>
                    <tr>
                      <td style={itemTitle}>Email ID:</td>
                      <td>{contactDetail?.emailId || ""}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Col>
          </Row>
        </Modal>
      </Card>
    </div>
  );
}
