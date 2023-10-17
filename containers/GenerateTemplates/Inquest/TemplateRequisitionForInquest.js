import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateRequisitionForInquest({ fileName, data }) {
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
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={
                  dateTime ? moment(dateTime).format(DATE_FORMAT) : ""
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br /> <br />
              To, <br />
              THE TAHSILDAR
              <br />
              __________
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
                    <td>Request to conduct Inquest - reg</td>
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling || "__________"}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {complainantname || "__________"}{" "}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {complainantaddress || "__________"}{" "}
                </span>{" "}
                presented a report / recorded statement wherein the complainant
                stated that{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </span>
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;As per the contents of the report
                a case in Cr.No{" "}
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
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp; During the course of
                investigation, it is revealed that the deceased died within 7
                years of her marital life.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Hence, it is requested to visit{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  __________
                </span>{" "}
                (place) and hold inquest over the body of the deceased to
                establish:
              </p>
              <br />
              <div
                style={{
                  paddingLeft: "5.5%",
                  fontSize: 17,
                  fontFamily: "Arial",
                  lineHeight: "20px",
                  textAlign: "left",
                }}
              >
                i) Circumstances leading to the death of the deceased. <br />
                ii) Whether the death is suicidal, homicidal or accidental.
                <br />
                iii) Whether any allegations of dowry harassment leveled just
                prior to death. <br />
                iv) Whether any foul play is suspected in the death. <br />
                v) Whether any other allegations levelled on anybody. <br />
              </div>
              <br />
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is requested to forward the
                inquest report to the court of Hon`ble _________. Metropolitan
                Magistrate, Cyberabad.
              </p>
              <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;Please acknowledge receipt of this
              letter.
              <br />
              <br />
            </td>
          </tr>
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td>
                  <br />
                  Place: {policeStation}
                  <br />
                  Date and time:{" "}
                  {dateTime ? moment(dateTime).format(DATE_TIME_FORMAT) : ""}
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
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
