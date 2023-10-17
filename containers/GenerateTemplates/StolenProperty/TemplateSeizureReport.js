import { isUndefined, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  getPersonPersonalAddress,
  shortAddress,
  getPersonShortAddress,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";

export default function TemplateSeizureReport({ fileName, data }) {
  const {
    policeStation = "",
    sectionOfLaw = "",
    district = "",
    IOName = "",
    selectedStolenProperty,
    savedFir = "",
    formData = "",
  } = !isUndefined(data) && data;
  const selectedFir = loadState("selectedFir");
  const { panchWitnessList } = useSelector((state) => state.FIR);
  const address = shortAddress(selectedStolenProperty);
  const placeOfSeizure = getPersonShortAddress(formData?.placeOfSeizure);
  const seizedDate = formData?.seizedDate;
  const seizedBy = formData?.seizedBy;

  const leftStyle = {
    fontSize: 16,
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    color: "#010203",
  };

  const rightContentStyle = {
    fontSize: 15,
    fontFamily: "Arial",
    color: "#010203",
  };

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 16, fontFamily: "Arial" }}>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Arial",
              }}
            >
              <br />
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                GOVERNMENT OF TELANGANA
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                (POLICE DEPARTMENT)
              </div>
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Arial",
              }}
            >
              <b style={{ textAlign: "center", padding: "0" }}>
                <h3>
                  <u>S E I Z U R E &nbsp; R E P O R T</u>
                </h3>
              </b>
              <br />
            </td>
          </tr>

          <table
            style={{
              width: "100%",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 16,
              color: "black",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td>
                  <table
                    style={{
                      width: "96%",
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      color: "black",
                      border: "1px solid #262626",
                      // marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            color: "black",
                            width: "40%",
                          }}
                        >
                          District : {district}
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: 200,
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                          colspan="3"
                        >
                          Police Station : {policeStation}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              width: "100%",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 16,
              color: "black",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td>
                  <table
                    style={{
                      width: "96%",
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      color: "black",
                      border: "1px solid #262626",
                      marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            color: "black",
                            width: "40%",
                          }}
                        >
                          Crime NO :{" "}
                          <b>
                            {selectedFir?.firNum ? selectedFir?.firNum : ""}
                          </b>
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: 200,
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                          colspan="3"
                        >
                          Section of law : {sectionOfLaw}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              width: "100%",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 16,
              color: "black",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td>
                  <table
                    style={{
                      width: "96%",
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      color: "black",
                      border: "1px solid #262626",
                      marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            color: "black",
                            width: "40%",
                          }}
                        >
                          Place of Seizure Report
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: 200,
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                          colspan="3"
                        >
                          {address !== "  " ? address : placeOfSeizure}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              marginLeft: "1.5%",
              marginTop: "5px",
              width: "90%",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td style={{ ...leftStyle, width: "90%" }}>
                  <u>Names and Addresses of Panch Witnesses</u>
                </td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              marginLeft: "1.5%",
              marginTop: "5px",
              marginBottom: "5px",
              width: "96%",
            }}
          >
            <tbody>
              {panchWitnessList &&
                !isEmpty(panchWitnessList) &&
                panchWitnessList.map((data, index) => {
                  const fullvictimDetails =
                    data?.person && data?.person?.personalDetails;
                  const name = fullvictimDetails?.name;
                  const surname = fullvictimDetails?.surname;
                  const presentAddress =
                    data?.person && data?.person?.presentAddress;
                  const address = getPersonPersonalAddress(presentAddress);
                  return (
                    <>
                      <tr>
                        <td
                          style={{
                            ...leftStyle,
                            width: "2%",
                            verticalAlign: "top",
                          }}
                        >
                          {" "}
                          {index + 1}.
                        </td>
                        <td style={{ ...rightContentStyle, width: "75%" }}>
                          {name ? name : ""} {surname ? surname : ""},{" "}
                          {address ? address : ""}
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>

          <table
            style={{
              width: "100%",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 16,
              color: "black",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td>
                  <table
                    style={{
                      width: "96%",
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      color: "black",
                      border: "1px solid #262626",
                      marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            borderRight: "1px solid #262626",
                            color: "black",
                          }}
                        >
                          1.
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            paddingLeft: 10,
                            color: "black",
                          }}
                        >
                          Date and time of conducting seizure{" "}
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: "40%",
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                        >
                          {seizedDate
                            ? moment(seizedDate).format(DATE_TIME_FORMAT)
                            : moment().format(DATE_TIME_FORMAT)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            borderRight: "1px solid #262626",
                            color: "black",
                          }}
                        >
                          2.
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            paddingLeft: 10,
                            color: "black",
                          }}
                        >
                          Name of the officer conducting seizure
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: "40%",
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                        >
                          {seizedBy}
                        </td>
                      </tr>
                      <tr
                        style={{
                          borderBottom: "1px solid #262626",
                          color: "black",
                        }}
                      >
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            borderRight: "1px solid #262626",
                            color: "black",
                          }}
                        >
                          3.
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            paddingLeft: 10,
                            color: "black",
                          }}
                        >
                          Where, at whose instance seizure made
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: "40%",
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        ></td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            borderRight: "1px solid #262626",
                            color: "black",
                          }}
                        >
                          4.
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            paddingLeft: 10,
                            color: "black",
                          }}
                        >
                          Details of seizure
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: "40%",
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                        ></td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #262626" }}>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            padding: 5,
                            borderRight: "1px solid #262626",
                            color: "black",
                          }}
                        >
                          5.
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            paddingLeft: 10,
                            color: "black",
                          }}
                        >
                          Reasons for seizure
                        </td>
                        <td
                          style={{
                            padding: "0 5px",
                            width: "40%",
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 16,
                            borderLeft: "1px solid #262626",
                            textAlign: "center",
                            color: "black",
                          }}
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            style={{
              marginLeft: "1.5%",
              marginTop: "5px",
              width: "90%",
            }}
          >
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "90%" }}>
                Signatures of Panch witnesses :
              </td>
            </tr>
            <tbody>
              <tr>
                <td
                  style={{
                    ...leftStyle,
                    width: "2%",
                    marginTop: "10px",
                  }}
                >
                  1.
                </td>
                <td style={{ width: "75%" }} />
              </tr>
              <tr>
                <td
                  style={{
                    ...leftStyle,
                    width: "2%",
                    marginTop: "10px",
                  }}
                >
                  2.
                </td>
                <td style={{ width: "75%" }} />
              </tr>
            </tbody>
          </table>

          <tr>
            <td style={{ fontSize: 16, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody>
                  <div style={{ textAlign: " right ", marginTop: "2px" }}>
                    <b
                      style={{
                        fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                        fontSize: 16,
                        color: "black",
                        marginRight: "65px",
                      }}
                    >
                      Signature of Investigating Officer
                    </b>
                  </div>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                    showurfaith={2}
                  />
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
