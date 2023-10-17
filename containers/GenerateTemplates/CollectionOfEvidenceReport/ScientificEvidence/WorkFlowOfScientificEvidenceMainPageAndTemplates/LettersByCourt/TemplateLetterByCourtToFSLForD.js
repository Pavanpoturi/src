import { isUndefined } from "lodash";
import TemplatesLogo from "../../../../TemplatesLogo";
import TemplatesFooter from "../../../../TemplatesFooter";

export default function TemplateLetterByCourtToFSLForD({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    nameOfCourt = "",
    accusedname = "",
    personAddress = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody>
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
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
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
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
              }}
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
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                      </span>{" "}
                      –Collection of blood samples for DNA Examination – reg.
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
              &emsp;&emsp;&emsp;&nbsp;The photograph of following persons the
              above referred case whose blood samples are required for DNA
              examination is affixed below and attested by me.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "50px",
                }}
              >
                <b>
                  <u>NAME AND ADDRESS OF PERSON</u>
                </b>
                {accusedname} {personAddress}
              </div>
            </td>
          </tr>
          <br />
          <br />
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
              <br />
              &emsp;&emsp;&emsp;&nbsp; Hence, you are directed to arrange for
              collection of the blood samples of the above said PERSON for DNA
              examination.
            </td>
          </tr>
          <br />
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
          <tr>
            <td
              style={{
                width: "25%",
                float: "right",
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "right",
              }}
            >
              <br />
              <br />
              <b>M A G I S T R A T E </b>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ paddingLeft: "5%" }}>
              <br />
              <br />
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "25px",
                  textAlign: "center",
                  width: "15%",
                  fontSize: 17,
                  fontFamily: "Arial",
                }}
              >
                PHOTOGRAPH
              </div>
              Attested
            </td>
          </tr>
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
              <b>M A G I S T R A T E </b>
              <br />
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
