import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateRoadAccidentInsurance({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    IOName = "",
    userDate = "",
  } = !isUndefined(data) && data;

  const firDate = data?.firDate;

  const InnerTableHeding = {
    fontSize: 15,
    textAlign: "left",
    fontWeight: "500",
  };

  const InnerTableBody = {
    fontWeight: "500",
    fontSize: 15,
    fontFamily: "Arial",
    lineHeight: "20px",
  };

  const tableStyleBody = {
    width: "30vw",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 15,
    fontFamily: "Arial",
    verticalAlign: "top",
    // fontWeight: "800",
  };

  const tableStyleBodyRight = {
    width: "2vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 15,
    fontFamily: "Arial",
    verticalAlign: "top",
    fontWeight: "600",
  };

  const tableStyleLeft = {
    width: "30vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 15,
    fontFamily: "Arial",
    verticalAlign: "top",
    // fontWeight: "600",
  };

  const tableStyleLeftLast = {
    width: "30vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 15,
    fontFamily: "Arial",
    // fontWeight: "600",
  };

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <tr>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    <u>
                      <b>
                        FORM-1
                        <br />
                        INTIMATION OF THE ROAD ACCIDENT BY THE INVESTIGTION
                        OFFICER TO THE
                        <br />
                        CLAIMS TRIBUNAL AND THE INSURANCE COMPANY{" "}
                      </b>
                    </u>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <table
            style={{
              width: "100%",
              fontFamily: "Arial",
              fontSize: 17,
              color: "black",
              display: "contents",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td>
                  <table
                    style={{
                      width: "96%",
                      fontFamily: "Arial",
                      color: "black",
                      border: "1px solid #262626",
                    }}
                  >
                    <tbody>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>1.</td>
                        <td style={tableStyleLeft}>
                          FIR No, Date and Under Section
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        >
                          {firNumber},
                          {firDate
                            ? moment(firDate).format(DATE_FORMAT)
                            : moment().format(DATE_FORMAT)}
                          ,{" U/S "}
                          {sectionOfLaw}
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>2.</td>
                        <td style={tableStyleLeft}>
                          Name of the Police Station
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        >
                          {policeStation}
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>3.</td>
                        <td style={tableStyleLeft}>
                          Date and place of the accident
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>4.</td>
                        <td style={tableStyleLeft}>
                          Source of the information{" "}
                          <table width="100%">
                            <tbody style={InnerTableBody}>
                              <th style={InnerTableHeding} colSpan={3}>
                                (Name, Address & Tel. No)
                              </th>
                              <tr>
                                <td>(a)</td>
                                <td>Driver / Owner</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Victim</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td> Witness</td>
                                <td />
                              </tr>
                              <tr>
                                <td>(d) </td>
                                <td>Hospital /Facility</td>
                                <td />
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>5.</td>
                        <td style={tableStyleLeft}>
                          Nature of the accident
                          <table width="100%">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>
                                  Whether resulted in death or injury or both
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Number of persons injured/death</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td>
                                  In case of injuries, whether simple or
                                  grievous
                                </td>
                                <td />
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>6.</td>
                        <td style={tableStyleLeft}>
                          Name and address of the injured or deceased
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>7.</td>
                        <td style={tableStyleLeft}>
                          Details of the hospital where taken
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>8.</td>
                        <td style={tableStyleLeft}>
                          Registration of the vehicles involved in the accident{" "}
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>9.</td>
                        <td style={tableStyleLeft}>
                          Name, address and contact no of the owner of the
                          offender vehicle{" "}
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>10.</td>
                        <td style={tableStyleLeft}>
                          Name, address and contact no of the driver of the
                          vehicle (s)
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>11.</td>
                        <td style={tableStyleLeft}>Insurance policy Number</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>12.</td>
                        <td style={tableStyleLeft}>
                          Period of Insurance Policy
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>13.</td>
                        <td style={tableStyleLeft}>
                          Name and address of the Insurance Company
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>14.</td>
                        <td style={tableStyleLeft}>
                          Name and contact no of the investigation officer
                        </td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <tr>
            <td style={{}}>
              <table
                style={{
                  width: "100%",
                }}
              >
                <TemplateSignature
                  IOName={IOName}
                  policeStation={policeStation}
                  district={district}
                  showurfaith={"2"}
                />
              </table>
            </td>
          </tr>
          <tr>
            <td>
              Date :{" "}
              {userDate
                ? moment(userDate).format(DATE_FORMAT)
                : moment().format(DATE_FORMAT)}
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
