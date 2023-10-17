import { isUndefined } from "lodash";
import TemplatesFooter from "../../../TemplatesFooter";
import TemplatesLogo from "../../../TemplatesLogo";
import TemplateSignature from "../../../TemplateSignature";
import TemplateHeader from "../../../TemplateHeader";

export default function TemplateLetterForPMEClarification({ fileName, data }) {
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
              Dr
              <span>__________</span>
              <br />
              Asst /Associate/Professor,
              <br />
              Department of Forensic Medicine
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
                      - POSTMORTEM EXAMINATION REPORT – Request for
                      clarifications - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      1) Cr.No{" "}
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
                      2) PME no{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>{" "}
                      dated{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>{" "}
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
              &emsp;&emsp;&emsp;&nbsp;With reference to the subject cited,
              Postmortem Examination over the body of Sri / Smt{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>{" "}
              Was conducted on{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>{" "}
              Further, the PME report was furnished and it was opined that the
              deceased died due to{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>{" "}
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;In this connection, it is requested to
              furnish following clarification.
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
                style={{ width: "100%", cellspacing: "1", cellpadding: "1" }}
                className="tablebgborder"
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
                    <td width="5%" style={{ verticalAlign: "top" }}>
                      1.
                    </td>
                    <td width="70%">
                      There are injuries noted in col.No.9 of the PME Report.
                      How the injuries could have been caused.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>Which of the injury is vital for causing death.</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>
                      Whether the injuries are accidental / homicidal in nature.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td>4.</td>
                    <td>
                      Whether the injuries have been caused by fall on a hard
                      surface .
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td>5.</td>
                    <td>
                      Whether the injuries could have been caused due to fall
                      from a height?
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td>6.</td>
                    <td>
                      If caused with a weapon, what could be the type of weapon
                      with which it is caused.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td>7.</td>
                    <td>
                      The deceased died of hanging. Over there are injuries in
                      column no.9. How they could have occurred and whether any
                      of the injuries are vital for causing death ?
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
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
