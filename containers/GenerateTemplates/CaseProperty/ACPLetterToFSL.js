import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";

export default function ACPLetterToFSL({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
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
        </tbody>
      </table>
      <table>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ width: "45%" }}>From:</td>
            <td style={{ width: "35%" }}>To:</td>
          </tr>
          <tr>
            <td style={{ width: "45%" }}>
              Asst Commissioner of Police, Science Labs
            </td>
            <td style={{ width: "35%" }}>
              The Director, Telangana State Forensic{" "}
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <br />
          <br />
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 10,
                fontFamily: "Arial",
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                <span style={{ borderBottom: "1px solid black" }}>
                  No. /...................... dt
                  .....................................
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Sir,</td>
          </tr>
          &nbsp;
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
                      </span>
                      -
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      ></span>
                      Request for furnishing Expert report - reg
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
              <p>
                &nbsp; I am herewith forwarding the material objects together
                with the letter of advice prepared by the Investigating officer
                in the above referred case with a request to arrange for the
                examination in the light of Letter of Advice and forward the
                report at the earliest.
              </p>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{
                position: "absolute",
                marginLeft: "50%",
                fontSize: 17,
                width: "60%",
              }}
            >
              Yours faithfully,
              <br />
              <b>Asst Commissioner of Police</b>
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "50%", fontSize: 17 }}
            >
              <span>{IOName}</span>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "50%", fontSize: 17 }}
            >
              <span>{policeStation}</span>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "50%", fontSize: 17 }}
            >
              <span>{district}</span>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ marginTop: "40px", fontSize: 17 }}>
                <tbody>
                  <tr>
                    <td>Encl:</td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        style={{
                          fontSize: 17,
                        }}
                      >
                        <strong>1. Letter of advice</strong>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        style={{
                          fontSize: 17,
                        }}
                      >
                        <strong>2. Matteial object</strong>
                      </span>
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
