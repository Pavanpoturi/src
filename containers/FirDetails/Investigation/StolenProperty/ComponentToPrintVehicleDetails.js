/* eslint-disable array-callback-return */
import * as React from "react";
import { Card, Typography } from "antd";

export class ComponentToPrintVehicleDetails extends React.PureComponent {
  render() {
    const vehicleDetails = this.props.vehicleDetails;
    const isFetching = this.props.isFetching;
    const { Title } = Typography;
    const leftStyle = {
      width: "40%",
      fontWeight: "bold",
      textAlign: "right",
      verticalAlign: "top",
    };
    const centerStyle = {
      width: "5%",
      textAlign: "center",
      verticalAlign: "top",
    };
    const rightStyle = { width: "55%", color: "#A8A8A8", verticalAlign: "top" };

    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <style type="text/css" media="print">
          {`
   @page { 
    margin: 20mm 17mm 25mm 17mm;
    size: portrait; 
  }
`}
        </style>
        <Card
          title={
            <Title
              level={4}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                width: "100%",
                marginTop: "5px",
              }}
            >
              Vehicle Details
            </Title>
          }
          headStyle={{ backgroundColor: "gray" }}
        >
          {!isFetching && (
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={leftStyle}>Vehicle Type</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.type}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Sub Classification of vehicle</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>
                    {vehicleDetails?.subClassification}
                  </td>
                </tr>
                <tr>
                  <td style={leftStyle}>Vehicle Make</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.make}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Vehicle Model</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.model}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Colour</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.color}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Registration No</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.registrationNo}</td>
                </tr>

                <tr>
                  <td style={leftStyle}>Chassis No</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.chassisNo}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Engine No</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.engineNo}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Fuel Type</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.fuel}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Mfg. Month and Year</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.manufactured}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Owner Name</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.ownerName}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Owner Father’s name</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.ownerFatherName}</td>
                </tr>

                <tr>
                  <td style={leftStyle}>RC Registration date</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.registrationDate}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>RC Valid Upto</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>
                    {vehicleDetails?.registrationValidUpto}
                  </td>
                </tr>
                <tr>
                  <td style={leftStyle}>Registration done at</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.registeredAt}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Registered Mobile No</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>
                    {vehicleDetails?.registeredMobileNo}
                  </td>
                </tr>
                <tr>
                  <td style={leftStyle}>Permanent Address</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.permanentAddress}</td>
                </tr>
                <tr>
                  <td style={leftStyle}>Present Address</td>
                  <td style={centerStyle}>:</td>
                  <td style={rightStyle}>{vehicleDetails?.presentAddress}</td>
                </tr>
              </tbody>
            </table>
          )}
        </Card>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  return <ComponentToPrintVehicleDetails ref={ref} text={props.text} />;
});
