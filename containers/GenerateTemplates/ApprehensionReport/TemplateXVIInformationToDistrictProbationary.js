import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateXVIInformationToDistrictProbationary({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedName = "",
    personAddress = "",
    accusedAge = "",
    producedDateBeforeDPO = "",
    IOName = "",
    district = "",
    firbrief = "",
    religion = "",
    caste = "",
    fatherHusbandGuardianName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <h5
                style={{
                  padding: 0,
                  textAlign: "center",
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "strong",
                }}
              >
                <u>
                  INFORMATION OF APPREHNISON OF C C L TO THE DISTRICT PROBATION
                  OFFICER VIDE SECTION 13 OF THE J.J.ACT 2000
                </u>
              </h5>
              <br />
            </td>
          </tr>

          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="5%">1 </td>
                    <td width="50%">
                      Name of the Child in Conflict with Law (CCL){" "}
                    </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {accusedName || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Age / Religion / Caste</td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {accusedAge ? `${accusedAge} Years,` : ""} {caste || ""}{" "}
                      {religion || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>3 </td>
                    <td>Son / daughter of </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {fatherHusbandGuardianName}
                    </td>
                  </tr>
                  <tr>
                    <td>4 </td>
                    <td>Residing at </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {personAddress || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>5 </td>
                    <td>Under the case of </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Cr. No. {firNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Date and time of apprehension </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {producedDateBeforeDPO
                        ? moment(producedDateBeforeDPO).format(DATE_TIME_FORMAT)
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td>7 </td>
                    <td>Place of apprehension</td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td>8 </td>
                    <td>Section under which apprehended</td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {sectionOfLaw} u/s
                    </td>
                  </tr>
                  <tr>
                    <td>9 </td>
                    <td>Brief History of the case </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {firbrief || "_________-"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>10 </td>
                    <td>
                      Whether kept in the observation home. If so the address of
                      the same.
                    </td>
                    <td
                      width="70%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {personAddress || ""}
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
              <br />
              <br />
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
