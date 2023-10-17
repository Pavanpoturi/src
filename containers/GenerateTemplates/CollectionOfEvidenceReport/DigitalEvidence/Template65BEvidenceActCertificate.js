import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";

export default function Template65BEvidenceActCertificate({ fileName, data }) {
  const {
    accusedName = "",
    accusedAge = "",
    accussedfather = "",
    occupation = "",
    personAddress = "",
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
              <h4>
                <u> CERTIFICATE U/SEC 65(B) OF INDIAN EVIDENCE ACT 1872</u>
              </h4>
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
              <b>
                I,{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {accusedName}
                </span>{" "}
                s/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {accussedfather}
                </span>{" "}
                aged{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {accusedAge}{" "}
                </span>
                yrs occ:{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {occupation}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {personAddress}
                </span>{" "}
              </b>
              do hereby declare and certify as follows..
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                    verticalAlign: "top",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        width: "8%",
                        verticalAlign: "top",
                        lineHeight: "20px",
                      }}
                    >
                      1.
                    </td>
                    <td style={{ verticalAlign: "top", lineHeight: "20px" }}>
                      The computer output in the form of computer printouts /
                      compact disc attached herewith is the correct
                      representation of its original as contained in the
                      computer systems assessed by me for providing the service.
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>
                      The information contained in the computer printouts /
                      compact disc has been produced from the aforesaid computer
                      systems during the period over which the computer was used
                      regularly.
                    </td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>
                      During the said period information of the kind contained
                      in the computer printouts / compact disc was regularly
                      recorded by the aforesaid computer systems in the ordinary
                      course of the activities.
                    </td>
                  </tr>
                  <tr>
                    <td>4.</td>
                    <td>
                      Throughout the material part of the said period, the
                      computer was operating properly and there have been no
                      such operational problems that affect the accuracy of the
                      electronic record contained in the aforesaid computer
                      systems.
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;The matter stated above is correct to the
              best of my knowledge and belief.
            </td>
          </tr>
          <tr>
            <td>
              <table
                style={{
                  paddingLeft: "35%",
                  float: "right",
                  fontSize: 17,
                  fontFamily: "Arial",
                  textAlign: "right",
                }}
              >
                <br />
                <br />
                <tr>
                  <td style={{ fontSize: 17, fontFamily: "Arial" }}>
                    Signature
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
                  <td>Name and Address</td>
                  <td
                    style={{
                      padding: "0 10px",
                      width: 200,
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    {accusedName} {personAddress}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
