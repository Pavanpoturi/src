import { isUndefined } from "lodash";
import TemplateSignature from "../../TemplateSignature";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";

export default function Template50ACrPCNotice({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    accusedName = "",
    accusedAge = "",
    accusedCaste = "",
    sectionOfLaw = "",
    relationToAccused = "",
    gender = "",
    residenceName,
    district = "",
    IOName = "",
    courtName = "",
    completeintimateddetails = "",
    accussedfather = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <b>
                GOVERNMENT OF TELANGANA
                <br /> (POLICE DEPARTMENT)
              </b>
              <br /> <br />
            </th>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="30%" />
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      Police Station :{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                        verticalAlign: "top",
                      }}
                    >
                      {policeStation || "__________"}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="30%" />
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      District / Unit :{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                        verticalAlign: "top",
                      }}
                    >
                      {district || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "center",
                padding: 3,
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <h5>
                <u> NOTICE u/s 50A Cr.P.C.</u>
              </h5>
              <br />
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;This is to inform you, that Mr/Ms
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {accusedName || "__________"}{" "}
                </span>
                {gender === "Female" ? "d/o " : "s/o "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {accussedfather || "__________"}
                </span>{" "}
                aged
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {accusedAge || "__________"}{" "}
                </span>
                yrs caste:{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {accusedCaste || "__________"}{" "}
                </span>
                Resident of
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {residenceName || "__________"}{" "}
                </span>
                is arrested in Cr.No{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {firNumber || "__________"}{" "}
                </span>
                u/s{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {sectionOfLaw || "__________"}
                </span>
                . Of Police Station and is being produced before Honourable
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {courtName || "________"}
                </span>{" "}
                Court.
              </p>
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
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>To</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "justify", lineHeight: "20px" }}>
                      {`${
                        completeintimateddetails || "__________"
                      }  ${relationToAccused} `}
                    </td>
                  </tr>
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
