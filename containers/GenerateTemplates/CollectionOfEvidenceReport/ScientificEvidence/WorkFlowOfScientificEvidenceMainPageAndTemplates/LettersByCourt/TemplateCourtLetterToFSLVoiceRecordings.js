import { isUndefined } from "lodash";
import TemplatesFooter from "../../../../TemplatesFooter";
import TemplatesLogo from "../../../../TemplatesLogo";

export default function TemplateCourtLetterToFSLVoiceRecordings({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    nameOfCourt = "",
    accusedname = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <b>
                        {" "}
                        IN THE COURT OF HONOURABLE{" "}
                        {nameOfCourt || "___________________"}
                      </b>
                    </td>
                    <br />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{ textAlign: "center", fontSize: 17, fontFamily: "Arial" }}
            >
              Present:
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%"> Dis.No. :</td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      __________
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
                      {currentDate || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{ fontSize: 17, fontFamily: "Arial", textAlign: "center" }}
            >
              <label style={{ textAlign: "center", float: "center" }}>
                <b>
                  <u>O R D E R</u>
                </b>
              </label>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              To
              <br />
              <span>__________</span>
              <br />
              Forensic Science Labs
              <br />
              <span>__________</span>
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{ paddingLeft: "5.5%", fontSize: 17, fontFamily: "Arial" }}
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
                      Division{" "}
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
                      </span>{" "}
                      – Forwarding of material objects for analysis – reg
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
                      PS{" "}
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
              &emsp;&emsp;&emsp;&nbsp;I am herewith forwarding sample voice
              recording of accused{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {accusedname ? accusedname : "__________"}{" "}
              </span>{" "}
              collected in open court together with the voice records contained
              in Mobile Phone / CD and you are hereby directed to arrange for
              analysis and furnish opinion in the light of the letter of advice
              and forward the report to this court at the earliest.
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              be pleased to consider <br />
              <br />
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{
                width: "25%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              <b>MAGISTRATE</b>
              <br />
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Encl:
              <br />
              <span style={{ paddingLeft: "5%" }}></span>1. Letter of advice
              <br />
              <span style={{ paddingLeft: "5%" }}></span>2. Mobile / CD
              containing questioned voice
              <br />
              <span style={{ paddingLeft: "5%" }}></span>3. Voice recording
              collected in court in CD
              <br />
              <br />
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
