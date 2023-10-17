import { isUndefined } from "lodash";
import TemplatesFooter from "../../../TemplatesFooter";
import TemplatesLogo from "../../../TemplatesLogo";
import TemplateSignature from "../../../TemplateSignature";
import TemplateHeader from "../../../TemplateHeader";

export default function TemplateLetterToExperts({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
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
                currentDate={currentDate}
              />
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
              <br /> To,
              <br />
              <span>__________</span>
              <br />
              <span>__________</span>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
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
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      Dist{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {district}
                      </span>{" "}
                      - PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      - Request for furnishing Expert report - reg
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
                      </span>{" "}
                      of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
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
              &emsp;&emsp;&emsp;&nbsp;With reference to the subject cited, the
              Expert from your organization visited the scene of crime in the
              above referred case. In this connection, you are requested to
              expedite the following report. <br />
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
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <th width="10%">Sl.No.</th>
                    <th>Date of Visit</th>
                    <th>Visited by</th>
                    <th>Report requested</th>
                  </tr>
                  <tr>
                    <td>1.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Fire Brigade</td>
                    <td>Fire Brigade Report</td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Electrical Engineer</td>
                    <td>Electricity Engineer Report as to short circuit</td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>MVI</td>
                    <td>MVI report </td>
                  </tr>
                  <tr>
                    <td>4.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Inspector of Factories</td>
                    <td>Expert Report</td>
                  </tr>
                  <tr>
                    <td>5.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Inspector of Boilers</td>
                    <td>Expert Report</td>
                  </tr>
                  <tr>
                    <td>6.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Pollution Control Board Inspector</td>
                    <td>PCB report</td>
                  </tr>
                  <tr>
                    <td>7.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Drugs Control Inspector</td>
                    <td>Drugs Controller Report</td>
                  </tr>
                  <tr>
                    <td>8.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Archaeology Department </td>
                    <td>
                      Expert report as to age of Antiques seized and its value
                    </td>
                  </tr>
                  <tr>
                    <td>9.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>FP Bureau</td>
                    <td>FP Expert Report.</td>
                  </tr>
                  <tr>
                    <td>10.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>F S L </td>
                    <td>
                      1) Serology
                      <br />
                      2)Toxology
                      <br />
                      3) Documents
                      <br />
                      4)Computers
                      <br />
                      5) DNA
                      <br />
                      6) Any other
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      * Note: For reminders to FSL the letter is to be addressed
                      by ACP/SDPO
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp; Please furnish the report at the
              earliest.
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody>
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
