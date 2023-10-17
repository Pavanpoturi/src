import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateppOpinionform67({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateOfFiling = "",
    IOName = "",
    district = "",
    dateOfSendingCD = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ textAlign: "right" }}>
              <b>
                FORM - 67
                <br />
                Chapter – 28 & 32 <br />
                See Order No.479-3 & 5 and 573-8-B <br />
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>
              <b>
                <u>
                  INVESTIGATING OFFICER’S REPORT TO A.P.P., ON COMPLETION OF
                  INVESTIGATION FOR OPINION/DRAFT CHARGE SHEET
                </u>
              </b>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%" style={{ verticalAlign: "top" }}>
                      1
                    </td>
                    <td width="40%">Police Station</td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">2</td>
                    <td width="40%">Crime Number</td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {firNumber}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">3</td>
                    <td width="40%">Date of FIR</td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {dateOfFiling}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">4</td>
                    <td width="40%">Sections of law registered</td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">5</td>
                    <td width="40%">Date of completion of investigation</td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">6</td>
                    <td width="40%">Date of arrest of accused, if any </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">7</td>
                    <td width="40%">
                      Whether the remand after 60/90- days is under expiry, if
                      so, furnish date of expiry{" "}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">8</td>
                    <td width="40%">No of accused </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">9</td>
                    <td width="40%">No of witnesses examined </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">10</td>
                    <td width="40%">
                      Whether sanction required for any offence / offrender{" "}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">11</td>
                    <td width="40%">
                      Messenger through whom the CD file sent to A PP (details
                      of PC/HC){" "}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">12</td>
                    <td width="40%">Date of sending file to A PP </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {dateOfSendingCD}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">13</td>
                    <td width="40%">
                      Whether the investigating officer discussed personally
                      with APP earlier or after completion of investigation{" "}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">14</td>
                    <td width="40%">
                      Brief facts of the case, nature of evidence gathered, each
                      accused and the witnesses supporting each charge and the
                      opinion of the Investigating officer.{" "}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        - Separate sheet enclosed with complete facts and
                        investigation-
                      </span>
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
              }}
            >
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
