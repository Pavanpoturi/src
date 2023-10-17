import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateCPLetterSendingCDPolice({ fileName, data }) {
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
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">OFFICER</td>
                    <td width="20%" />
                    <td />
                    <td width="30%">Office of the UNIT OFFICER / ZONAL : </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {!!policeStation ? policeStation : "_________"}
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
                    <td width="15%">DATED: </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ______________
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <p align="center">
              <u>
                <strong>M E M O</strong>
              </u>
            </p>
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
                        {!!district ? district : "___________"}{" "}
                      </span>
                      - PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {!!policeStation ? policeStation : "_______"}{" "}
                      </span>
                      - Transfer of case file to other police station / agencies
                      - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">Ref:- </td>
                    <td>
                      {"1" + "    Cr.No"}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {!!firNumber ? firNumber : "_________________"}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {!!sectionOfLaw ? sectionOfLaw : "_________________"}
                      </span>
                      . of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {!!policeStation ? policeStation : "_________________"}
                      </span>
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td>
                      {"2" + "    Lr.No"}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {!!firNumber ? firNumber : "_________________"}
                      </span>{" "}
                      dated{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {!!sectionOfLaw ? sectionOfLaw : "_________________"}
                      </span>
                      . of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {!!policeStation ? policeStation : "_________________"}
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
              <p
                align="justify"
                style={{
                  textIndent: "50px",
                  fontSize: 17,
                  fontFamily: "Arial",
                }}
              >
                The CD file in Cr.No………………… u/s……………………………………………………. of
                P.S…………………… received from ………………… on the point of jurisdiction
                and you are hereby directed to re-register the case and take up
                investigation
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                float: "right",
                marginLeft: "50%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table>
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
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              Encl: CD file (_______) pages.
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              To
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Station House Officer
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              .............................
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Copy to the Dy Commissioner of Police,......... Zone for
              information
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Copy to the ACP/SDPO for information Both Unit officer/Zonal
              officer
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
