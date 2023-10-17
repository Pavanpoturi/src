import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateLetterToSurveyAndSettlement({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    complainantname = "",
    complainantaddress = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div
      id={fileName}
      style={{ width: "95%", margin: "0 auto", fontFamily: "Arial " }}
    >
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
                currentDate={currentDate}
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br /> To,
              <br />
              The Director
              <br />
              Survey and Land Settlement
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}> Sir,</td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
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
                      </span>
                      - Request for Survey of land in sy.no.
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      situated at
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
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
                      of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
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
              &emsp;&emsp;&emsp;&nbsp;It is submitted that as per complaint of{" "}
              <span
                style={{
                  padding: "0 10px",
                  borderBottom: "1px dashed #ccc",
                  width: 200,
                }}
              >
                {complainantname
                  ? complainantname + " " + complainantaddress
                  : "__________"}{" "}
              </span>
              a case under reference has been registered and investigation taken
              up.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;During the course of investigation the
              scene of offence was visited and witnesses examined. The documents
              from contending parties have been obtained and verified. There is
              dispute over survey number. Both the parties are claiming one and
              the same land on different documents. Thus, there is overlapping
              of survey number. Hence, it is requested to depute a team for
              conducting AD Survey and furnish the report.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table
                style={{
                  width: "75%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="15%">1.</td>
                    <td>Survey number</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ____________
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>Situation of land</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ____________
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br /> <br />
              &emsp;&emsp;&emsp;&nbsp;As the dispute is causing law and order
              problem at the spot, it is requested to arrange the survey at an
              early date.
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
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
