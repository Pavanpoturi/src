import { isUndefined, isNull } from "lodash";
import TemplatesFooter from "../../../TemplatesFooter";
import TemplatesLogo from "../../../TemplatesLogo";

export default function TemplateDnaVictimThroughACP({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    victimarrList = [],
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="45%">
                      From
                      <br />
                    </td>
                    <td width="5%">
                      :<br />
                    </td>
                    <td>
                      To
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>Asst Commissioner of Police, </td>
                    <td>:</td>
                    <td>The Director,</td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      Division
                    </td>
                    <td>:</td>
                    <td>Forensic Science Laboratories,</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>:</td>
                    <td>
                      <b>
                        <u>RED HILLS, HYDERABAD</u>
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              No.<span style={{ paddingLeft: "3%" }}></span>/
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              date:{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {currentDate}
              </span>
            </th>
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
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      – Request for collection of blood samples of VICTIM
                      /WITNESS for DNA Examination – reg.
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
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
                      </span>{" "}
                      of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
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
              &emsp;&emsp;&emsp;&nbsp;The photograph of following VICTIM person
              in the above referred case whose blood samples are required for
              DNA examination is affixed below and attested by me.
              <br />
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
              <div style={{ border: "1px solid #ccc", padding: "50px" }}>
                <b>
                  <u>NAME AND ADDRESS OF VICTIM/WITNESS</u>
                </b>
                <br />
                {victimarrList.map((item, index) => {
                  return (
                    <label key={index}>
                      {`${item.accusedName} ${
                        !isNull(item.personAddress) ? ", r/o : " : ""
                      } ${item.personAddress || ""}`}
                    </label>
                  );
                })}
              </div>
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
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;Hence, it is requested to collect the
              blood samples of the above said VICTIM person for DNA examination.
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td
              style={{
                width: "35%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              Yours faithfully, <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "35%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              <b>
                Asst Commissioner of Police
                <br />
                <span style={{ textAlign: "center" }}>DIVISION,</span>
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <br />
              <div
                style={{
                  width: "15%",
                  padding: "25px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                PHOTOGRAPH
              </div>
              Attested
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "35%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              <b>
                Asst Commissioner of Police
                <br />
                <span style={{ textAlign: "center" }}>DIVISION,</span>
              </b>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
