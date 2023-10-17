import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateTransferOfOriginalRecord({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    courtName = "",
    district = "",
    alteredsections = [],
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateofcomplaint = "",
    timeofcomplaint = "",
    tocourt = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tr>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    <b>
                      IN THE COURT OF HONOURABLE {courtName || "__________"}{" "}
                    </b>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br />
              <br />
              Honoured Sir,
            </td>
          </tr>

          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                paddingLeft: "5.5%",
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
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      - Alteration of section of law – Submission of{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        ________
                      </span>
                      Memo – reg.
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      {" "}
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
                      . of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;The facts of the case are that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateofcomplaint || "________"}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {timeofcomplaint || "________"}
                </span>{" "}
                hrs on the complaint / statement of Sri / Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "________"}{" "}
                  {complainantaddress || "________"}
                </span>
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "______________"}
                </span>
                a case in Cr.No.{" "}
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
                was registered and investigation taken up.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp; During the course of investigation the
                scene of offence was visited, statements of witnesses recorded.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;While the investigation is in progress
                the following further developments taken place
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "75%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td style={{ width: "10%" }}> 1 </td>
                    <td>Change in the Nature Of Injury </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}> 2 </td>
                    <td>Sexual assault on missing girl </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}> 3 </td>
                    <td>Sexual assault on kidnapped girl/woman </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}> 4 </td>
                    <td>Death of Injured / victim </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}> 5 </td>
                    <td>PME report findings </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}>6 </td>
                    <td>Allegation by relatives </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%" }}> 7 </td>
                    <td>New facts during investigation (specify) </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <br />
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;In the light of the above, section of
                law is altered from{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {sectionOfLaw}
                </span>{" "}
                to Sec{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {alteredsections.map((item, index) => {
                    return (
                      <span>
                        {item.act + " " + item.section || "_________"}{" "}
                      </span>
                    );
                  })}
                </span>
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp; Hence, it is prayed that the Honourable
                Court may kindly transfer the original record of investigation
                to the court of Honourable{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {tocourt}
                </span>
              </p>
            </td>
          </tr>

          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <br />
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
