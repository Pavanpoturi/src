import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";
import moment from "moment";
import { DATE_FORMAT, TIME_FORMAT } from "@containers/FirDetails/fir-util";

export default function TemplateNotice160CrPC({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateOfIssue = "",
    accusedName = "",
    personAddress = "",
    district = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                GOVERNMENT OF TELANGANA
              </div>
              <div
                style={{
                  fontSize: 17,
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
            <td>
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={
                  dateOfIssue
                    ? moment(dateOfIssue).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
                shownum={"2"}
              />
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <b style={{ textAlign: "center", padding: "0" }}>
                <u>NOTICE u/s 160 Cr.P.C.</u>
              </b>
              <br />
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
                      Sub:-
                    </td>
                    <td>
                      {" "}
                      Dist{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {district}{" "}
                      </span>{" "}
                      P S
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      {`- Appearance of witnesses - Reg`}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-
                    </td>
                    <td>
                      {" "}
                      Cr.No
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {firNumber}{" "}
                      </span>
                      u/s
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {sectionOfLaw}{" "}
                      </span>
                      . of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      .
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp; You are hereby informed that as per
                your complaint, a case under reference was registered and
                investigation taken up.
              </p>
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp; In this connection, you are hereby
                requested to appear before the undersigned on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {dateOfIssue ? moment(dateOfIssue).format(DATE_FORMAT) : ""}
                </span>{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  at{" "}
                  {dateOfIssue ? moment(dateOfIssue).format(TIME_FORMAT) : ""}
                  {""}
                </span>{" "}
                hrs{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {policeStation}{" "}
                </span>{" "}
                for recording your detailed statement.
              </p>
              <br />
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp;Please acknowledge receipt of notice
                comply within ( 3 ) days.
              </p>
            </td>
          </tr>
          <tr>
            <td>
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
            <td>To</td>
          </tr>
          <tr>
            <td>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        padding: "15px",
                        width: 200,
                      }}
                    >
                      {accusedName || ""}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 250,
                      }}
                    >
                      {personAddress || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
