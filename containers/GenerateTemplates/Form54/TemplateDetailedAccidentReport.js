import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateDetailedAccidentReport({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    courtName = "",
    district = "",
    IOName = "",
    userDate = "",
  } = !isUndefined(data) && data;

  const firDate = data?.firDate;

  const InnerTableHeding = {
    textAlign: "left",
    fontSize: 15,
    fontWeight: "500",
  };

  const pageBreak = {
    pageBreakBefore: "always",
    pageBreakInside: "auto",
    display: "none",
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
                        FORM-II
                        <br />
                        DETAILED ACCIDENT REPORT (DAR){" "}
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
              pageBreakAfter: "always",
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
                          Offence as per report under sec 173 Cr.P.C
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
                          Date, time and place of accident
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
                          Who reported the accident to the Police{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <th style={InnerTableHeding} colSpan={3}>
                                (Give name, address & Contact No)
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
                                <td>Hospital/ medical facility</td>
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
                          Name of the person who took the victim to the
                          hospital, name of the hospital and at what time
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
                          Whether any hospital denied treatment to the victim
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
                          Nature of the accident{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
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
                        <td style={tableStyleBodyRight}>9.</td>
                        <td style={tableStyleLeft}>
                          Particulars of the offending vehicle (s){" "}
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
                          Number of persons in the offending vehicle
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
                        <td style={tableStyleLeft}>
                          Whether the victim was:
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Pedestrian/ bystander</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Cyclist</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td>Scooterist</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(d)</td>
                                <td>
                                  Travelling in a vehicle if so whether at
                                  driving seat, back seat, front seat , side
                                  car, travelling at rear guard cargo area etc.
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(e)</td>
                                <td>Victims vehicle no</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(f)</td>
                                <td>No. of persons in the victims vehicle</td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>12.</td>
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
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>13.</td>
                        <td style={tableStyleLeft}>
                          Name of the witness of the accident
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
                          Brief description of the accident
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART – II <br /> SITE PLAN
                          </b>
                        </td>
                      </tr>
                      {/* Past */}

                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>15.</td>
                        <td style={tableStyleLeft}>
                          Date of preparation of the site plan
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
                        <td style={tableStyleBodyRight}>16.</td>
                        <td style={tableStyleLeft}>
                          <b>
                            <u>Site plan shall indicate</u>
                          </b>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(1)</td>
                                <td>Place of accident</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(2)</td>
                                <td>Position of vehicles</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(3)</td>
                                <td>Position of victim</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(4)</td>
                                <td>Skid marks</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(5)</td>
                                <td>Road – whether one way or two way</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(6)</td>
                                <td>Lane in which the accident took place</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(7)</td>
                                <td>
                                  Permissible speed limits on the road at the
                                  site of the accident
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(8)</td>
                                <td>
                                  Whether traffic control such as presence of
                                  Police officer, road markings, Warning sign,
                                  stop sign were there?
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(9)</td>
                                <td>
                                  Location of zebra crossing of pedestrian zone
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(10)</td>
                                <td>
                                  Whether near traffic lights is so whether
                                  functional?
                                </td>
                                <td></td>
                              </tr>
                              <tr style={{ verticalAlign: "top" }}>
                                <td>(11)</td>
                                <td>
                                  Distance of speed breakers, if any, from the
                                  spot of accident
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(12)</td>
                                <td>
                                  Width and type of road – national high way /
                                  city road / express way/ rural road etc
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(13)</td>
                                <td>
                                  <div style={{ paddingRight: "200px" }}>
                                    <b>
                                      <u>Direction of the vehicle</u>
                                    </b>
                                  </div>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Same direction (rear end)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Same direction ( side swipe)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Right angle</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Opposite direction (angular)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Opposite direction side swipe</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Struck parked vehicle</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(g)</td>
                                    <td>Left turn</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(h)</td>
                                    <td>U-turn reversing</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (14)
                                </td>
                                <td>
                                  <b>
                                    <u>Direction of movement of vehicle</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>North</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>East</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>South</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>west</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (15)
                                </td>
                                <td>
                                  <b>
                                    <u>Road Divided by</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Barrio median</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Curbed median</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Grass median</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>None</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (16)
                                </td>
                                <td>
                                  <b>
                                    <u>Light Condition</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Daylight</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Dusk</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Dark ( No Street Light )</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Dark ( Street Lights On, Spot)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Dawn</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Dark ( Street Lights Off)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(g)</td>
                                    <td>
                                      Dark ( Street Lights on, Continuous)
                                    </td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (17)
                                </td>
                                <td>
                                  <b>
                                    <u>Visibility/ environmental Condition</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Clear</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Fog/Smog/Smoke</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Snow</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Severe Crosswinds</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Rain</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Blowing Sand or Dirt</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(g)</td>
                                    <td>Sun Glare</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (18)
                                </td>
                                <td>
                                  <b>
                                    <u>Road Character</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Son light And Level</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Straight And Grade</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Straight And Hillcrest</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Curve And Level</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Curve And Grade</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Under Construction/maintenance</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (19)
                                </td>
                                <td>
                                  <b>
                                    <u>Road Surface Type</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Concrete</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Blacktop</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Gravel</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Steel Grid</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Dirt</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Pot Holes</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(g)</td>
                                    <td>Cave in</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(h)</td>
                                    <td>Construction Maternal on road</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (20)
                                </td>
                                <td>
                                  <b>
                                    <u>Road Surface Condition</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Dry</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Wet</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Snowy</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Water ( Standing/moving)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Sand , Mud, Dirt</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Oil</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (21)
                                </td>
                                <td>
                                  <b>
                                    <u>Air bag deployed</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Front</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Side</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Multiple</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>None</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (22)
                                </td>
                                <td>
                                  <b>
                                    <u>Ejection from vehicle</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Not ejected</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Ejected</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Partial ejection</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Trapped</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (23)
                                </td>
                                <td>
                                  <b>
                                    <u>Temporary traffic zone</u>
                                  </b>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>None</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Construction zone</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Maintenance zone</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Utility zone</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Incident zone</td>
                                    <td></td>
                                  </tr>
                                </td>
                              </tr>
                              <tr style={{ fontFamily: "Arial" }}>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    fontFamily: "Arial",
                                  }}
                                >
                                  (24)
                                </td>
                                <td>
                                  <b>
                                    <u>
                                      Total number of entities involved in the
                                      crash
                                    </u>
                                  </b>
                                  <tr>
                                    <td></td>
                                    <td>
                                      {" "}
                                      <b>
                                        <u>Crash Type:</u>
                                      </b>
                                    </td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td colSpan={3}>
                                      With other motor vehicle as first event:
                                    </td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Same direction (Rear End)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Same direction (slide Sweep)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Right angle</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Opposite direction (Herron angular)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Opposite direction (Slide sweep)</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Struck parked vehicle</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(g)</td>
                                    <td>Left turn / u turn</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(h)</td>
                                    <td>Backing</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(i)</td>
                                    <td>Encroachment</td>
                                    <td></td>
                                  </tr>
                                  <tr
                                    style={{
                                      marginTop: "25px",
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    <td colSpan={3}>
                                      With blow as first event
                                    </td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(a)</td>
                                    <td>Overturn</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(b)</td>
                                    <td>Fixed object</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(c)</td>
                                    <td>Animal</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(d)</td>
                                    <td>Pedestrian</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(e)</td>
                                    <td>Pedal cyclist</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(f)</td>
                                    <td>Not fixed object</td>
                                    <td></td>
                                  </tr>
                                  <tr style={{ fontFamily: "Arial" }}>
                                    <td style={{ paddingLeft: "25px" }}>(g)</td>
                                    <td>Railcar vehicle</td>
                                    <td></td>
                                  </tr>
                                </td>
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART - III <br /> <u>PARTICULARS OF THE DRIVERS</u>
                            <br />
                            (In case of more than one driver submit separate
                            Part – III for each driver)
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>17.</td>
                        <td style={tableStyleLeft}>
                          Name, address and contact no of the driver
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
                        <td style={tableStyleBodyRight}>18.</td>
                        <td style={tableStyleLeft}>Age</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>19.</td>
                        <td style={tableStyleLeft}>Gender</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>20.</td>
                        <td style={tableStyleLeft}>Education</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>21.</td>
                        <td style={tableStyleLeft}>Occupation</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>22.</td>
                        <td style={tableStyleLeft}>Family</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>23.</td>
                        <td style={tableStyleLeft}>Income (monthly)</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>24.</td>
                        <td style={tableStyleLeft}>
                          Account no with name and address of the back in which
                          he driver is maintaining his account
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
                        <td style={tableStyleBodyRight}>25.</td>
                        <td style={tableStyleLeft}>
                          Driving License:{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr style={{ marginRight: 10, paddingRight: 10 }}>
                                <td>(a)</td>
                                <td>Driving license No</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Whether learning license?</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td>Period of validity</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(d)</td>
                                <td>Issued by</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(e)</td>
                                <td>Class of vehicle</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(f)</td>
                                <td>Whether license suspended / cancelled</td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>26.</td>
                        <td style={tableStyleLeft}>
                          In case of learning license{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Whether driving under supervision</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>
                                  Whether driving with lapsed learning license
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>27.</td>
                        <td style={tableStyleLeft}>
                          Whether driver is the owner paid driver /otherwise
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
                        <td style={tableStyleBodyRight}>28.</td>
                        <td style={tableStyleLeft}>
                          Whether driving with the knowledge / consent of the
                          owner
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
                        <td style={tableStyleBodyRight}>29.</td>
                        <td style={tableStyleLeft}>
                          Whether driving under influence of liquor/drugs?
                          Whether finding based on scientific report?
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
                        <td style={tableStyleBodyRight}>30.</td>
                        <td style={tableStyleLeft}>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(a)</td>
                                <td>
                                  Whether the driver reported the accident to
                                  the police/ family of the victim?
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(b)</td>
                                <td>
                                  Whether the driver took the victim to the
                                  hospital?
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(c)</td>
                                <td>
                                  Whether the driver visited the victim at the
                                  hospital?
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(d)</td>
                                <td>
                                  Whether the driver remained at the spot till
                                  arrival of the police
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(e)</td>
                                <td>
                                  Whether the driver did not remove the
                                  offending vehicle from the spot till the
                                  arrival of the police
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(f)</td>
                                <td>
                                  Whether the driver paid compensation/ medical
                                  compensation to the victim/ his family?
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>
                                  Whether the driver cooperated in investigation
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(h)</td>
                                <td>
                                  Whether the driver also suffered injuries in
                                  the accident
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(i)</td>
                                <td>
                                  Whether discharged duty under sec 132 & 134 of
                                  the MV act , 1988
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(j)</td>
                                <td>
                                  If not, whether the driver has been prosecuted
                                  under section 187 MV Act 1987
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>31.</td>
                        <td style={tableStyleLeft}>
                          Whether the driver fled from the spot? If so, the date
                          on which he appeared before the Police/ court or was
                          arrested?
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
                        <td style={tableStyleBodyRight}>32.</td>
                        <td style={tableStyleLeft}>
                          Any other relevant information relating to the driver
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART – IV <br />{" "}
                            <u>PARTICULARS OF THE OFFENDING VEHICLES (S)</u>
                            <br />
                            (in case of more than one vehicle, submit separate
                            Part – IV for each vehicle)
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>33.</td>
                        <td style={tableStyleLeft}>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(a)</td>
                                <td>Registration No</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(b)</td>
                                <td>Color</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(c)</td>
                                <td>Make</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(d)</td>
                                <td>Model</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(e)</td>
                                <td>Year</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(f)</td>
                                <td>Engine No</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>Chassis no</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(h)</td>
                                <td>Address of the Registering authority</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(i)</td>
                                <td>
                                  Private or commercial (public service vehicle
                                  goods carriage/ educational institution bus)
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>34.</td>
                        <td style={tableStyleLeft}>
                          Name, address occupation and contact number of the
                          owner:{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(a)</td>
                                <td>
                                  In case of company person in charge in terms
                                  section 199 of the MV act, 1988
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(b)</td>
                                <td>
                                  In case of sale of the vehicle, give
                                  particulars of the purchaser and date of
                                  transfer
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>35.</td>
                        <td style={tableStyleLeft}>
                          In case of commercial vehicle:{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Particulars of fitness</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Particulars of permit</td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>36.</td>
                        <td style={tableStyleLeft}>
                          Whether driver employed on monthly or daily basis?
                          Attach the proof of employment of driver such as
                          appointment letter, salary slip, duty register or
                          other relevant documents
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
                        <td style={tableStyleBodyRight}>37.</td>
                        <td style={tableStyleLeft}>
                          In case the driver fled from the spot, did the owner
                          produce the driver before the Police? If so when?
                          Attach the copy of the notice under section 133 MV Act
                          1988 and its reply
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
                        <td style={tableStyleBodyRight}>38.</td>
                        <td style={tableStyleLeft}>
                          Whether the owner reported the accident to the
                          insurance company? if so, when?
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
                        <td style={tableStyleBodyRight}>39.</td>
                        <td style={tableStyleLeft}>
                          Whether the owner co-operated in the investigation?
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
                        <td style={tableStyleBodyRight}>40.</td>
                        <td style={tableStyleLeft}>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(a)</td>
                                <td>
                                  Whether the owner discharged his duties under
                                  section 133 and 134 MV Act 1988
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(b)</td>
                                <td>
                                  If so, whether the owner prosecuted under
                                  Section 187 MV Ac t 1988
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>41.</td>
                        <td style={tableStyleLeft}>
                          In the case of un-insured vehicle{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(a)</td>
                                <td>
                                  Whether the owner /driver prosecuted under
                                  section 196 of the MV Act 1988
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(b)</td>
                                <td>
                                  Whether the owner/ driver made payment of
                                  compensation to the victim or his family? Give
                                  particulars, if available
                                </td>
                                <td></td>
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART – V <br />{" "}
                            <u>
                              PARTICULARS OF THE INSURANCE OF THE VEHICLES (S)
                            </u>
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>42.</td>
                        <td style={tableStyleLeft}>Policy number</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>43.</td>
                        <td style={tableStyleLeft}>Period of policy</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>44.</td>
                        <td style={tableStyleLeft}>
                          Issued by (give name and address of the insurance
                          company)
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
                        <td style={tableStyleBodyRight}>45.</td>
                        <td style={tableStyleLeft}>
                          Nature of policy, i.e., third party or comprehensive
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
                        <td style={tableStyleBodyRight}>46.</td>
                        <td style={tableStyleLeft}>
                          Name, address and contact number of the designated
                          officer of the insurance company
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
                        <td style={tableStyleBodyRight}>47.</td>
                        <td style={tableStyleLeft}>
                          Date of intimation of the accident by the
                          investigating officer to the insurance company
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
                        <td style={tableStyleBodyRight}>48.</td>
                        <td style={tableStyleLeft}>
                          Date of appointment of the designated officer by the
                          insurance company
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
                        <td style={tableStyleBodyRight}>49.</td>
                        <td style={tableStyleLeft}>
                          Account No with name and address of the bank in which
                          the insurance company is having its account
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART – VI <br />{" "}
                            <u>
                              MECHANICAL INSPECTON OF ALL VEHICLES INVOLVED IN
                              THE ACCIDENT
                            </u>
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>50.</td>
                        <td style={tableStyleLeft}>
                          Name and qualification of the Mechanical officer
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
                        <td style={tableStyleBodyRight}>51.</td>
                        <td style={tableStyleLeft}>
                          Date of mechanical inspection of the vehicles
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
                        <td style={tableStyleBodyRight}>52.</td>
                        <td style={tableStyleLeft}>
                          Date of mechanical inspection report
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
                        <td style={tableStyleBodyRight}>53.</td>
                        <td style={tableStyleLeft}>
                          Whether the mechanical inspection report is in terms
                          of Annexure- A? if no give reasons them of
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
                        <td style={tableStyleBodyRight}>54.</td>
                        <td style={tableStyleLeft}>
                          Whether any delay in mechanical inspection of
                          submitting report? If so give reasons thereof
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART – VII <br />{" "}
                            <u>IMPACT OF THE ACCIDENT ON THE VICTIM</u>
                            <br />
                            (in case of more then one victim, submit separate
                            Part VII for each victim)
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>55.</td>
                        <td style={tableStyleLeft}>
                          Death Cases:{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr style={{ marginRight: 10, paddingRight: 10 }}>
                                <td>(a)</td>
                                <td>Name and address of the deceased</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Age</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td>Gender</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(d)</td>
                                <td>Education</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(e)</td>
                                <td>Occupation</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(f)</td>
                                <td>Income (Monthly)</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>
                                  Legal heir / Guardian
                                  <tr>
                                    <td>(1.)</td>
                                    <td>Name</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td>(2.)</td>
                                    <td>Relationship</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td>(3.)</td>
                                    <td>Age</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td>(4.)</td>
                                    <td>Address</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td>(5.)</td>
                                    <td>Contact no</td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>56.</td>
                        <td style={tableStyleLeft}>
                          Injury cases{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Name and address of injured</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Age</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td>Gender</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(d)</td>
                                <td>Education</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(e)</td>
                                <td>Occupation</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(f)</td>
                                <td>Income (Monthly)</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>
                                  Details of family/ dependents of the victim
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(h)</td>
                                <td>MLC No</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(i)</td>
                                <td>Name of injures</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(j)</td>
                                <td>
                                  Name of hospital (s) where injured treated
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(k)</td>
                                <td>
                                  Whether victim refused medical treatment
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(l)</td>
                                <td>Period of hospitalization</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(m)</td>
                                <td>Period of treatment</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(n)</td>
                                <td>Whether treatment continuing</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(o)</td>
                                <td>
                                  Name, address and contact number of the doctor
                                  who treated the injured
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(p)</td>
                                <td>
                                  Whether injured underwent any surgery ? so
                                  give particulars
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(q)</td>
                                <td>
                                  Whether suffered any permanent disability? If
                                  yes give details
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(r)</td>
                                <td>
                                  Expenditure incurred on treatment conveyance,
                                  special diet, attendant etc., give detail, if
                                  available
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(s)</td>
                                <td>
                                  Whether the injured got reimbursement of
                                  medical expenses from list employer or under a
                                  medical policy give details, if available
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(t)</td>
                                <td>
                                  Whether the injured provided cashless
                                  treatment by the insurance company? Give
                                  details if available
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>57.</td>
                        <td style={tableStyleLeft}>
                          Any other relevant information
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART – VIII <br />{" "}
                            <u>APPARENT CONTRIBUTING CIRCUMSTANCES</u>
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>58.</td>
                        <td style={tableStyleLeft}>
                          Driving with valid driving license
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
                        <td style={tableStyleBodyRight}>59.</td>
                        <td style={tableStyleLeft}>
                          Driving while disqualified
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
                        <td style={tableStyleBodyRight}>60.</td>
                        <td style={tableStyleLeft}>
                          Learner driving without safety prevision
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
                        <td style={tableStyleBodyRight}>61.</td>
                        <td style={tableStyleLeft}>Vehicle not insured</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>62.</td>
                        <td style={tableStyleLeft}>Driving a stolen vehicle</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>63.</td>
                        <td style={tableStyleLeft}>
                          Vehicle taken without the consent of the owner
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
                        <td style={tableStyleBodyRight}>64.</td>
                        <td style={tableStyleLeft}>
                          Driving dangerously or excessive speed
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
                        <td style={tableStyleBodyRight}>65.</td>
                        <td style={tableStyleLeft}>
                          Under influence of liquor or drugs. Give quantity /
                          parameter / recovery if available
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
                        <td style={tableStyleBodyRight}>66.</td>
                        <td style={tableStyleLeft}>
                          Dangerously loaded vehicle
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
                        <td style={tableStyleBodyRight}>67.</td>
                        <td style={tableStyleLeft}>
                          Parking on the wrong side of the road
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
                        <td style={tableStyleBodyRight}>68.</td>
                        <td style={tableStyleLeft}>
                          Parking at prohibited places
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
                        <td style={tableStyleBodyRight}>69.</td>
                        <td style={tableStyleLeft}>
                          Non – observation of traffic rules
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
                        <td style={tableStyleBodyRight}>70.</td>
                        <td style={tableStyleLeft}>
                          Poorly maintained vehicles
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
                        <td style={tableStyleBodyRight}>71.</td>
                        <td style={tableStyleLeft}>
                          Fake / forged driving licence
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
                        <td style={tableStyleBodyRight}>72.</td>
                        <td style={tableStyleLeft}>
                          Previously conviction/ past history of bad driving
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
                        <td style={tableStyleBodyRight}>73.</td>
                        <td style={tableStyleLeft}>
                          Driving aggressively:{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Jumped Red Light</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Abrupt braking</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(c)</td>
                                <td>
                                  Neglected to keep to the left of the road
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(d)</td>
                                <td>Driving onss cross</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(e)</td>
                                <td>Driving into close to the vehicle front</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(f)</td>
                                <td>
                                  Persistent inappropriate attempts to overtake
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(g)</td>
                                <td>Cutting in after overtake</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(h)</td>
                                <td>Racing/ comparative driving</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(i)</td>
                                <td>Crossing speed limits</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(j)</td>
                                <td>Disregarding any warnings</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(k)</td>
                                <td>Driving on the wrong side</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(l)</td>
                                <td>Overtaking where prohibited</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(m)</td>
                                <td>driving with loud music</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(n)</td>
                                <td>improper reversing</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(o)</td>
                                <td>improper passing</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(p)</td>
                                <td>improper turning</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(q)</td>
                                <td>driving in no entry hours</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(r)</td>
                                <td>
                                  not showing down at crossing/ road junction
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(s)</td>
                                <td>turning without indication</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(t)</td>
                                <td>
                                  not respecting stop sign on road surface
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(u)</td>
                                <td>
                                  not respecting right of way to pedestrian
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(v)</td>
                                <td>using mobile phone while driving</td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>74.</td>
                        <td style={tableStyleLeft}>
                          Irresponsible behavior:{" "}
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Failing to stop after accident</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(b)</td>
                                <td>
                                  Ran away from the spot after leaving the
                                  vehicle
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(c)</td>
                                <td>
                                  Destruction or attempt to destroy the evidence
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(d)</td>
                                <td>
                                  Falsely claiming that one of the victim was
                                  responsible for the accident
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(e)</td>
                                <td>
                                  Trying to throw the victim off the bonnet of
                                  the vehicle by swerving in order to escape
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(f)</td>
                                <td>
                                  Causing death/ injury in the course of
                                  dangerous driving post commission of crime or
                                  chased by police in an attempt to avoid
                                  detection or apprehends on
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>
                                  Offence committed while the offender was on
                                  bail
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(h)</td>
                                <td>Misled the investigation</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(i)</td>
                                <td>
                                  Pest accident road rage behavior give details
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>75.</td>
                        <td style={tableStyleLeft}>
                          Any other contributing factor
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            Part IX <br />{" "}
                            <u>Other offences Committed at the same time</u>
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>76.</td>
                        <td style={tableStyleLeft}>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(a)</td>
                                <td>sections 3/181-Driving without license</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>section 4/181-Driving by minor</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(c)</td>
                                <td>
                                  section 5/181-Allowing Unauthorized person to
                                  drive
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(d)</td>
                                <td>Section 56/192-without flues</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(e)</td>
                                <td>Section 66/(1)/192A- Without permit</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(f)</td>
                                <td>Section 112/183(i)-Over Speed</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(g)</td>
                                <td> Section 113/194-Over Loading</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(h)</td>
                                <td> Section 119/177-Jumping light</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(i)</td>
                                <td>
                                  Section 119/277-Violation of mandatory signs
                                  (One way, No right turn, no left turn )
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(j)</td>
                                <td>
                                  Section 122/177. Improper Obstructive parking
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(k)</td>
                                <td>Section 145/196 Without Insurance</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(l)</td>
                                <td>
                                  Section 177/RRR17(1)- Violation of “One way”
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(m)</td>
                                <td>
                                  Section 177/RRR29- Carrying High/Long Load
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(n)</td>
                                <td>
                                  Section 177/CMVR 138(3)-Not Using Seat Belt
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(o)</td>
                                <td>
                                  Section 177/RRR6- Violation of “ No
                                  Overtaking”
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(p)</td>
                                <td>
                                  Section 177/CMVR 105-Without Light after
                                  sunset
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(q)</td>
                                <td>
                                  Section 179-Misbehaviour with police officer{" "}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(r)</td>
                                <td>section 184-Driving dangerously</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(s)</td>
                                <td>
                                  Section 184- Using mobile phone while driving
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(t)</td>
                                <td>
                                  Section 185- Drunken driving/under influence
                                  of drugs
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(u)</td>
                                <td>
                                  Section 187-violation of Section 132©,
                                  133and134
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(v)</td>
                                <td>Section Any other Offence </td>
                                <td></td>
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART X <br />{" "}
                            <u>Directions Required from claimed (removal)</u>
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>77.</td>
                        <td style={tableStyleLeft}>
                          The driver (s) involved in the accident have not
                          furnished information mentioned in Para(s)----------
                          (Para(s)18.19.20.21.22.23.24.25.26.27.28.29.30
                          and41(b)of part III) and the documents mentioned in
                          Para (s)-------------(Para(s)91.92.93.94.95.97.of part
                          XI) The driver (s) may be directed to furnish the
                          requisite information on affidavit along with the
                          original documents before the claims tribunal(copy of
                          the letter demanding the information/documents be
                          attached)
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
                        <td style={tableStyleBodyRight}>78.</td>
                        <td style={tableStyleLeft}>
                          The owner (s) of the vehicles involved in the failed
                          to furnish the information mentioned in
                          para(s)–––––––– (para(s) 34.35.36.38.40and 41(b) of
                          part IV and have not produced the documents mentioned
                          in para(s)–––(para(s)92.93.94.95.96 and 97) of part XI
                          The owner (s) may be directed to disclose the
                          requisite information on affidavit along with the
                          original documents before the claims tribunal.(copy of
                          the letter demanding the information/documents be
                          attached )
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
                        <td style={tableStyleBodyRight}>79.</td>
                        <td style={tableStyleLeft}>
                          The insurance Company has failed to disclose
                          information para(s)–––––– (para(s) 46.47.48.49.) of
                          part V.
                          <br />
                          The insurance Company may be directed to disclose the
                          requisite information on affidavit along with the
                          original documents before the claims tribunal (copy of
                          the letter demanding the information/documents be
                          attached )
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
                        <td style={tableStyleBodyRight}>80.</td>
                        <td style={tableStyleLeft}>
                          The claimant(s) have failed to disclose the
                          information mentioned in para(s)–––– (para(s)
                          55.and56) of part VIII and the documents mentioned in
                          para(s)–––– (para(s) 101 and 102) of part XI.
                          <br />
                          Para(s)––––– (para(s) may be directed to disclose the
                          requisite information on affidavit along with the
                          original documents before the claims tribunal ( copy
                          of the letter demanding the information/documents be
                          attached )
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
                        <td style={tableStyleBodyRight}>81.</td>
                        <td style={tableStyleLeft}>
                          The registration authority have failed to verify
                          documents ( registration certificate driving license
                          in terms of clause 5 of the modified claims tribunal
                          Agreed procedure and therefore, Necessary Dictions be
                          issued to the registration authority to produce the
                          same before the claims tribunal , (copy of the letter
                          demanding the information/documents be attached )
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
                        <td style={tableStyleBodyRight}>82.</td>
                        <td style={tableStyleLeft}>
                          –––––––– Hospital has failed to issue ( MLC/post
                          Mortem Report) Within 15 days of the Accident in terms
                          of clause 6 and , therefore, the necessary directions
                          be issued to the Hospital to produce the same before
                          the claims tribunal.(copy of the letter demanding the
                          information /documents be attached )
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
                        <td style={tableStyleBodyRight}>83.</td>
                        <td style={tableStyleLeft}>
                          Specify any Other direction that may be necessary
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
                        {" "}
                        <td colspan="3" style={{ textAlign: "center" }}>
                          <b>
                            PART-XI <br />{" "}
                            <u>RELEVANT DOCUMENTS TO BE ATTACHED</u>
                          </b>
                        </td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>84.</td>
                        <td style={tableStyleLeft}>First Information Report</td>
                        <td
                          style={{
                            ...tableStyleLeftLast,
                            marginLeft: "10px",
                            width: "250px",
                          }}
                        ></td>
                      </tr>
                      <tr style={tableStyleBody}>
                        <td style={tableStyleBodyRight}>85.</td>
                        <td style={tableStyleLeft}>
                          Site plan in terms of para 16
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
                        <td style={tableStyleBodyRight}>86.</td>
                        <td style={tableStyleLeft}>
                          Photographs of the scene of accident from all angles
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
                        <td style={tableStyleBodyRight}>87.</td>
                        <td style={tableStyleLeft}>
                          Photograph of all the vehicles involved in the
                          accident from all angles
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
                        <td style={tableStyleBodyRight}>88.</td>
                        <td style={tableStyleLeft}>
                          Photograph and admitted signature of the driver(s) of
                          the offending vehicle(s)
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
                        <td style={tableStyleBodyRight}>89.</td>
                        <td style={tableStyleLeft}>
                          Photograph and specimen signature of the owner (s) of
                          the offending vehicle
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
                        <td style={tableStyleBodyRight}>90.</td>
                        <td style={tableStyleLeft}>
                          Mechanical Inspection Report format of annexure A
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
                        <td style={tableStyleBodyRight}>91.</td>
                        <td style={tableStyleLeft}>
                          Driving license of the driver
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
                        <td style={tableStyleBodyRight}>92.</td>
                        <td style={tableStyleLeft}>
                          Proof of employment of driver such as appointment
                          letter, salary slips, duty register etc.
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
                        <td style={tableStyleBodyRight}>93.</td>
                        <td style={tableStyleLeft}>
                          Registration certificate of the offending vehicle(s)
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
                        <td style={tableStyleBodyRight}>94.</td>
                        <td style={tableStyleLeft}>
                          In case of transfer of vehicle , sale documents
                          ,possession letter or any other document relating to
                          transfer if any
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
                        <td style={tableStyleBodyRight}>95.</td>
                        <td style={tableStyleLeft}>
                          Insurance Policy of the offending vehicle (s)
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
                        <td style={tableStyleBodyRight}>96.</td>
                        <td style={tableStyleLeft}>
                          Permit (for commercial vehicle)
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
                        <td style={tableStyleBodyRight}>97.</td>
                        <td style={tableStyleLeft}>
                          Fitness Certificate (for Commercial vehicle)
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
                        <td style={tableStyleBodyRight}>98.</td>
                        <td style={tableStyleLeft}>
                          Report Under Section 173 Cr,P C.
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
                        <td style={tableStyleBodyRight}>99.</td>
                        <td style={tableStyleLeft}>
                          Statements of the witnesses recorded by the police
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
                        <td style={tableStyleBodyRight}>100.</td>
                        <td style={tableStyleLeft}>
                          Scientific report if the driver was under the
                          influence of liquor/drugs
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
                        <td style={tableStyleBodyRight}>101.</td>
                        <td style={tableStyleLeft}>
                          <b>
                            <u>In Case Of Death :</u>
                          </b>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>Post Mortem Report</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Death certificate</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(c)</td>
                                <td>
                                  Photograph and proof of the identity of the
                                  case
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(d)</td>
                                <td>
                                  Proof of age of the deceased which may be in
                                  form of
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>(i)</td>
                                    <td>Birth certificate</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (ii)
                                    </td>
                                    <td>School Certificate</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        verticalAlign: "top",
                                        paddingLeft: "25px",
                                      }}
                                    >
                                      (iii)
                                    </td>
                                    <td>
                                      {" "}
                                      Certificate from gram Panchayat( in case
                                      of illiterate )
                                    </td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(e)</td>
                                <td>
                                  Proof of Occupation and income of the deceased
                                  which may be in form of .
                                  <tr>
                                    <td
                                      style={{
                                        verticalAlign: "top",
                                        paddingLeft: "25px",
                                      }}
                                    >
                                      (i)
                                    </td>
                                    <td>
                                      Pay slip/salary certificate for salaried
                                      employees
                                    </td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (ii)
                                    </td>
                                    <td>
                                      Bank statements of the last six months
                                    </td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (iii)
                                    </td>
                                    <td>Income tax Returns</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (iv)
                                    </td>
                                    <td>Balance sheet</td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(f)</td>
                                <td>
                                  Proof of the legal representatives of the
                                  deceased
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>(i)</td>
                                    <td>Names</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (ii)
                                    </td>
                                    <td>Age</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (iii)
                                    </td>
                                    <td>Address</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (iv)
                                    </td>
                                    <td> Relationship</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>(v)</td>
                                    <td>Contact no:</td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>
                                  {" "}
                                  Photographs specimen signatures attested by
                                  true bank and identity proof of the legal
                                  representatives of deceased
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(h)</td>
                                <td>
                                  {" "}
                                  Treatment record medical bills and other
                                  expenditure
                                  <tr>
                                    <td
                                      style={{
                                        verticalAlign: "top",
                                        paddingLeft: "25px",
                                      }}
                                    >
                                      (i)
                                    </td>
                                    <td>
                                      Bank Account no of the legal
                                      representatives of the deceased with name
                                      and address of the bank
                                    </td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>102.</td>
                        <td style={tableStyleLeft}>
                          <b>
                            <u>In case of Injury :</u>
                          </b>
                          <table width="100%" cellspacing="1" cellpadding="1">
                            <tbody style={InnerTableBody}>
                              <tr>
                                <td>(a)</td>
                                <td>MLC</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>(b)</td>
                                <td>Multi angle Photographs of the injured</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(c)</td>
                                <td>
                                  Photographs , Specimen signatures attached by
                                  the bank and identity proof of the injured
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(d)</td>
                                <td>
                                  Proof of age of the injured with may be in
                                  form of
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>(i)</td>
                                    <td>Birth certificate</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (ii)
                                    </td>
                                    <td>School Certificate</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        verticalAlign: "top",
                                        paddingLeft: "25px",
                                      }}
                                    >
                                      (iii)
                                    </td>
                                    <td>
                                      {" "}
                                      Certificate from gram Panchayat( in case
                                      of illiterate )
                                    </td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(e)</td>
                                <td>
                                  Proof of occupational income of the injured at
                                  the time of the accident which any be in form
                                  of
                                  <tr>
                                    <td
                                      style={{
                                        verticalAlign: "top",
                                        paddingLeft: "25px",
                                      }}
                                    >
                                      (i)
                                    </td>
                                    <td>
                                      Pay slip/salary certificate for salaried
                                      employees
                                    </td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (ii)
                                    </td>
                                    <td>
                                      Bank Statements of the last six months of
                                      the deceased
                                    </td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (iii)
                                    </td>
                                    <td>Income tax Returns</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (iv)
                                    </td>
                                    <td>Balance sheet</td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(f)</td>
                                <td>
                                  Treatment record medical bills and other
                                  expenditure-In case of long term treatment the
                                  SHO/IO shall also record the details so that
                                  the Claims Tribunal .
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(g)</td>
                                <td>Disability Certificate</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(h)</td>
                                <td>
                                  Proof of absence from work where loss of
                                  income on account of injury is bring claimed
                                  which may be in the of:
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>(i)</td>
                                    <td>Certificate from the employer</td>
                                    <td></td>
                                  </tr>
                                  <tr>
                                    <td style={{ paddingLeft: "25px" }}>
                                      (ii)
                                    </td>
                                    <td>
                                      Extracts from the attendance register
                                    </td>
                                    <td></td>
                                  </tr>
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ verticalAlign: "top" }}>(i)</td>
                                <td>
                                  Proof of reimbursement of medical expenses by
                                  employer or under a mediclaim policy, if taken
                                </td>
                                <td></td>
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
                        <td style={tableStyleBodyRight}>103.</td>
                        <td style={tableStyleLeft}>
                          Copy of the letter of the Investigating Officer
                          demanding the relevant information/documents from the
                          driver as mentioned in para 77 above
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
                        <td style={tableStyleBodyRight}>104.</td>
                        <td style={tableStyleLeft}>
                          Copy of the letter of the investigating Officer
                          Demanding the relevant information/documents from the
                          owner as mentioned in para 78 above
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
                        <td style={tableStyleBodyRight}>105.</td>
                        <td style={tableStyleLeft}>
                          Copy of the letter of the investigating Officer
                          demanding the relevant information/documents from the
                          owner as mentioned in para 79 above
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
                        <td style={tableStyleBodyRight}>106.</td>
                        <td style={tableStyleLeft}>
                          Copy of the letter of the investigating Officer
                          demanding the relevant information/documents from the
                          owner as mentioned in para 80 above
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
                        <td style={tableStyleBodyRight}>107.</td>
                        <td style={tableStyleLeft}>
                          Copy of the letter of the investigating Officer
                          demanding the relevant information/documents from the
                          owner as mentioned in para 81 above
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
                        <td style={tableStyleBodyRight}>108.</td>
                        <td style={tableStyleLeft}>
                          Copy of the letter of the investigating Officer
                          demanding the relevant information/documents from the
                          owner as mentioned in para 82 above
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
                        <td style={tableStyleBodyRight}>109.</td>
                        <td style={tableStyleLeft}>
                          Any other relevant document(s)
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
          <table
            style={{
              width: "100%",
              fontFamily: "Arial",
              fontSize: 17,
              color: "black",
              display: "contents",
              paddingTop: "80px",
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
                      <tr>
                        <td
                          style={{
                            textAlign: "left",
                            paddingLeft: "80px",
                            paddingTop: "20px",
                          }}
                        >
                          <b>
                            <u>VERIFICATION</u>
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "25px", marginTop: "20px" }}>
                          Verified –––––––––––––– on this ––––––––––of
                          –––––––––– that the contents of the above report are
                          true and correct as per information and documents
                          gathered during investigation.
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            textAlign: "left",
                            paddingLeft: "350px",
                            paddingTop: "50px",
                          }}
                        >
                          Station House officer <br />
                          (Name and Stamp)
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            textAlign: "left",
                            paddingLeft: "350px",
                            paddingTop: "150px",
                            paddingBottom: "160px",
                          }}
                        >
                          Assistant Commissioner of police <br />
                          (Name and Stamp)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
