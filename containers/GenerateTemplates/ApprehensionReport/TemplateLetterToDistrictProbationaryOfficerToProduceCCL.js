import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, TIME_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";
import TemplatesLogo from "../TemplatesLogo";

export default function TemplateLetterToDistrictProbationaryOfficerToProduceCCL({
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
    caste = "",
    producedDateBeforeDPO = "",
    religion = "",
    IOName = "",
    district = "",
    fatherHusbandGuardianName = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
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
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={
                  producedDateBeforeDPO
                    ? moment(producedDateBeforeDPO).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
              />
            </td>
          </tr>

          <tr>
            <td>
              <br /> To, The District Probation Officer
              <br />
              _________
              <br />
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Sir,</td>
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
                      Production of Child in Conflict with Law (CCL) - reg
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
                      .
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
                  {dateOfFiling}
                </span>{" "}
                the complainant{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "__________"}{" "}
                  {complainantaddress || "__________"}
                </span>{" "}
                presented a report stating that{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </span>
                .
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;As per contents of report a case
                under reference was registered and investigated into.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;During the course of investigation on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {producedDateBeforeDPO
                    ? moment(producedDateBeforeDPO).format(DATE_FORMAT)
                    : ""}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {producedDateBeforeDPO
                    ? moment(producedDateBeforeDPO).format(TIME_FORMAT)
                    : ""}
                </span>
                hrs the following Child in Conflict with law was apprehended at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                and seized material objects.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                    <td width="40%">Name of the Child in Conflict with law </td>
                    <td
                      width="60%"
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
                    <td>Age / Caste / Religion </td>
                    <td
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
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {personAddress}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;The apprehended Child in Conflict with
                Law is / are going to be produced before the Hon`ble Court.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;Therefore, the above named Child in
                Conflict with Law being produced before your Hon`ble authority
                for necessary proceedings.
              </p>
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
