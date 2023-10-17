import { isEmpty, isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateAcknowledgement({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    courtName = "",
    district = "",
    IOName = "",
    userDate = "",
  } = !isUndefined(data) && data;

  const victimDetails = data?.savedFir?.victimDetails;
  const referenceNumber = data?.firDetails?.referenceNumber;

  const physicalStyle = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    fontFamily: "Arial",
  };

  const physicalStyleBody = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    fontFamily: "Arial",
  };

  const physicalStyleHead = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
    fontSize: 15,
    fontFamily: "Arial",
  };

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tr>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    <b>
                      IN THE COURT OF HONOURABLE{" "}
                      {courtName || "__________________________"}{" "}
                    </b>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%", marginBottom: "20px" }}>
                <tr>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    <b>
                      CUM MOTOR ACCIDENT CLAIMS TRIBUNAL AT{" "}
                      {courtName || "______________"}{" "}
                    </b>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%"> No. :</td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      <u>{referenceNumber}</u>
                    </td>
                    <td width="30%"> </td>
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Date:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        textAlign: "left",
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      {userDate
                        ? moment(userDate).format(DATE_FORMAT)
                        : moment().format(DATE_FORMAT)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br />
              <br />
              Honoured Sir,
              <br />
            </td>
          </tr>

          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                paddingLeft: "5.5%",
              }}
            >
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      - Submission of additional memo - Submission of{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                      Memo - reg.
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      {" "}
                      Cr.No{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                      . of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      .<br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;I submit that I am here with forwarding
                Form 54 in the above referred road accident case in respect of
                the following victim for favour of perusal.
              </p>
            </td>
          </tr>

          {/* Print Row-16 */}
          <table
            style={{
              border: "1px solid #ccc",
              width: "93%",
              marginLeft: "3%",
              marginTop: "4%",
            }}
          >
            <tbody>
              <tr style={{ ...physicalStyleHead, display: "contents" }}>
                <td style={physicalStyle}>Sl.No.</td>
                <td style={physicalStyle}>Name of the Victim</td>
                <td style={physicalStyle}>Type of victim</td>
              </tr>
              {victimDetails &&
                !isEmpty(victimDetails) &&
                victimDetails.map((data, index) => {
                  const fullvictimDetails =
                    data?.person && data?.person?.personalDetails;
                  const victimType = data.victimType;
                  return (
                    <tr style={physicalStyleBody} key={index}>
                      <td style={physicalStyleBody}>{index + 1}</td>
                      <td style={physicalStyleBody}>
                        {!isEmpty(data) && fullvictimDetails
                          ? fullvictimDetails?.name
                          : ""}
                      </td>
                      <td style={physicalStyleBody}>
                        {!isEmpty(data) && victimType ? victimType : ""}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <br />
              BE PLEASED TO CONSIDER.
            </td>
          </tr>
          <tr>
            <td>
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {userDate ? moment(userDate).format(DATE_FORMAT) : ""}
              </span>
            </td>
          </tr>
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
            <td>Encl : Form-54</td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
