import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateNotice175CrPCForPanchWitnesses({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateTime = "",
    district = "",
    accusedName = "",
    personAddress = "",
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
                  dateTime ? moment(dateTime).format(DATE_FORMAT) : ""
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
              {" "}
              <b>
                {" "}
                <u>NOTICE u/s 175 Cr.P.C. </u>
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br /> <br /> To,
              <br />
              THE TAHSILDAR
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Sir,</td>
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
                      Dist
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {district}{" "}
                      </span>
                      - PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>{" "}
                      - Summoning of panch witnesses u/s 175 Cr.P.C. - Holding
                      of inquest u/s 174 Cr.P.C - reg
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
                          padding: "15px",

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
                      . of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",

                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;You are hereby informed that it is
                proposed to hold inquest over the body of the deceased{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "500px",
                  }}
                >
                  {accusedName || "_____________"}{" "}
                  {personAddress || "____________"}
                </span>{" "}
                in the above referred case u/s 174 Cr.P.C.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Hence. You are hereby required to
                appear before the undersigned at the following address to act as
                panch witness to the proceedings.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "60%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>Date and time </td>
                    <td
                      style={{
                        width: "200px",
                      }}
                    >
                      {dateTime
                        ? moment(dateTime).format(DATE_TIME_FORMAT)
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Place</td>
                    <td
                      style={{
                        width: "200px",
                      }}
                    >
                      {policeStation}
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
