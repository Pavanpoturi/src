import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateIntimationToCourtTransferOfCaseFile({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    courtName = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <th
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              IN THE COURT OF HONOURABLE {courtName || "__________"}{" "}
              METROPOLITAN MAGISTRATE
              <br />
              <br />
            </th>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Honoured Sir,
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
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">Sub:- </td>
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
                      - Transfer of case file to other police station / agencies
                      - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">Ref:- </td>
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
                      . of PS{" "}
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
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {dateOfFiling !== "" ? dateOfFiling : "__________"}
              </span>{" "}
              the complainant Sri/Smt
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {" "}
                {complainantname !== "" ? complainantname : "__________"}{" "}
              </span>{" "}
              r/o{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {" "}
                {complainantaddress !== ""
                  ? complainantaddress
                  : "______________"}{" "}
              </span>{" "}
              presented a report at PS{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {" "}
                {policeStation}
              </span>{" "}
              stating that
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {complainantstatememt !== ""
                  ? complainantstatememt
                  : "_______________________"}
              </span>
              for the alleged offence of Forgery of signatures in executing the
              sale deed.
              <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;As per the contents of the report a
              case in Cr.No{" "}
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
              was registered and investigation was taken up.
              <br /> <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;During the course of investigation
              the scene of offence was visited and panchanama of scene
              conducted. Statements of witnesses who were all well acquainted
              with facts and circumstances of the case recorded.
              <br /> <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;However, the case file needs to be
              transferred to following police station / other agencies.
              <br /> <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table
                style={{
                  width: "100%",
                  fontSize: 17,
                  fontFamily: "Arial",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">1</td>
                    <td>Other police station ( specify the name)</td>
                    <td>
                      On the point of jurisdiction as the scene of offence falls
                      under the jurisdiction of the Police station{" "}
                      {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">2</td>
                    <td>C C S</td>
                    <td>
                      As per directions of superior officers / court / gravity
                      of offence
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">3</td>
                    <td>C I D</td>
                    <td>-do-</td>
                  </tr>
                  <tr>
                    <td width="10%">4</td>
                    <td>C B I</td>
                    <td>-do-</td>
                  </tr>
                  <tr>
                    <td width="10%">5</td>
                    <td>N I A</td>
                    <td>-do-</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp; Hence, it is prayed that the Honourable
              Court may kindly forward the original record of investigation to
              the concerned court.
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
              BE PLEASED TO CONSIDER.
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
                    showurfaith={2}
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
