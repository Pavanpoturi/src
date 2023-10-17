import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateLetterToUnitOfficerForTransferOfCaseFile({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateTime = "",
    district = "",
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
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="18%" />
                    <td width="22%">POLICE STATION : </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="25%" />
                    <td width="15%">DISTRICT : </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {district}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">NO. </td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td width="25%" />
                    <td width="15%">DATE: </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {dateTime ? moment(dateTime).format(DATE_FORMAT) : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br /> <br /> To,
              <br />
              __________
              <br />
              <br />
              District
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Sir,
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
                }}
              >
                {dateOfFiling !== "" ? dateOfFiling : "__________"}
              </span>{" "}
              the complainant Sri/Smt
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
                }}
              >
                {" "}
                {complainantname !== "" ? complainantname : "__________"}{" "}
              </span>{" "}
              r/o{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
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
                  width: "200px",
                }}
              >
                {" "}
                {policeStation}
              </span>{" "}
              stating that
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
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
              &emsp;&emsp;&emsp;&nbsp; Therefore, it is requested that the CD
              file may be transferred to the other police station / other
              agencies for further investigation.
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
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              Encl: CD file (_______) pages.
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
