import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function Template164CrPcAccused({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedDetails = [],
    nameOfCourtRecorded = "",
    userDate = "",
    district = "",
    currentDate = "",
    complainantname = "",
    complainantaddress = "",
    dateOfFiling = "",
    complainantstatememt = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      <b>
                        IN THE COURT OF HONOURABLE{" "}
                        {nameOfCourtRecorded || "__________"}
                      </b>
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="56%"></td>
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      {" "}
                      Date:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 300,
                      }}
                    >
                      {" "}
                      {currentDate
                        ? moment(currentDate).format(DATE_FORMAT)
                        : moment().format(DATE_FORMAT)}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              Honoured Sir,
            </td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
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
                          width: 200,
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>
                      Request for recording statement of accused u/s 164
                      Cr.P.C.-0 Submission of report - reg.-{" "}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      Cr.No{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                      . PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>
                      .
                      <br />
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {dateOfFiling}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {(!isEmpty(complainantname) &&
                    complainantname.replace(" undefined", "")) ||
                    "___________"}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {complainantaddress || "___________"}
                </span>{" "}
                . presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {policeStation}
                </span>{" "}
                stating that
                <div
                  style={{
                    padding: "0 10px",
                    whiteSpace: "break-spaces",
                    marginTop: 5,
                  }}
                >
                  {complainantstatememt || "_______________"}
                </div>
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;As per the contents of the report, a
                case in Cr.No.{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {firNumber}
                </span>{" "}
                u/s{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {sectionOfLaw}
                </span>
                . was registered and investigation taken up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;
                <span style={{ textAlign: "left" }}>
                  During the course of investigation the scene of offence was
                  visited, statements of witnesses were recorded.
                </span>
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;In this connection, the following
                accused who were arrested that they want to turn as APPROVERS
                and support the prosecution.
              </p>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
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
                  {!isEmpty(accusedDetails) &&
                    accusedDetails.map((item, i) => {
                      return (
                        <tr>
                          {item?.accusedCode ? (
                            <td width="15%">{item?.accusedCode}</td>
                          ) : null}
                          <td
                            style={{
                              padding: "0 10px",
                              width: 200,
                            }}
                          >
                            {item?.accusedName || ""}
                          </td>
                          {item?.accusedAddress ? (
                            <td
                              style={{
                                padding: "0 10px",
                                textAlign: "justify",
                                lineHeight: "20px",
                                width: 200,
                              }}
                            >
                              {item?.accusedAddress}
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
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
                &emsp;&emsp;&emsp;&nbsp;Hence, it is prayed that this Hon`ble
                court may kindly record the statement of witness u/s 164 Cr.P.C.
                in the interest of prosecution. Copies of statements of
                witnesses are enclosed for favour of perusal.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              <br />
              <br />
              BE PLEASED TO CONSIDER.
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Date:
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {userDate ? moment(userDate).format(DATE_FORMAT) : ""}
              </span>
              <br />
              Place:
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {policeStation}
              </span>
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                    showurfaith={"2"}
                  />
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
