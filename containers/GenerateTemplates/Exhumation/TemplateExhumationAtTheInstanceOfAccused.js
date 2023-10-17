import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplateHeader from "../TemplateHeader";
import TemplateSignature from "../TemplateSignature";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";

export default function TemplateExhumationAtTheInstanceOfAccused({
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
    placeOfExhumation = "",
    dateOfExhumation = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    dateofFiling = "",
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
              <b style={{ fontSize: 17, fontFamily: "Arial" }}>
                GOVERNMENT OF TELANGANA
                <br /> (POLICE DEPARTMENT)
              </b>
            </td>
          </tr>
          <tr>
            <td>
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={
                  dateOfExhumation
                    ? moment(dateOfExhumation).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <br /> To,
              <br />
              THE TAHSILDAR
              <br />
              _________
              <br />
            </td>
          </tr>
          <tr>
            <td>Sir,</td>
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
                      Request for Exhumation of deadbody and inquest - reg
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
                        {sectionOfLaw}{" "}
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateofFiling
                    ? moment(dateofFiling).format(DATE_FORMAT)
                    : "________"}
                </span>{" "}
                the complaint of Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "____________"}{" "}
                  {complainantaddress || "_________"}
                </span>{" "}
                a case under reference was registered and investigation taken
                up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;During the course of investigation the
                scene of offence was visited, statements of witnesses recorded.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;While the investigation is in progress
                the following accused is / are arrested:
              </p>
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
                    <td
                      style={{
                        padding: "5px",

                        width: "150px",
                      }}
                    >
                      {" "}
                      {accusedName || ""}{" "}
                    </td>
                    <td
                      style={{
                        width: "100px",
                      }}
                    >
                      {accusedAge ? `${accusedAge} Years` : ""}
                    </td>
                    <td
                      style={{
                        width: "200px",
                      }}
                    >
                      {personAddress || ""}{" "}
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
                lineHeight: "20px",
              }}
            >
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;On interrogation the accused confessed
                to have killed the deceased . Sri / Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  _________{" "}
                </span>
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>
                and buried / burnt the body at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {placeOfExhumation || "________"}
                </span>{" "}
                place and confessed that he/they would show the place where the
                body was buried / burnt.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;Hence, in the light of the above
                confession, it is requested to visit the spot and order for
                exhuming the body by following the due procedures and conduct
                inquest and subject the body for post-mortem examination.
              </p>
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
                    <td>
                      <br />
                      Place: {policeStation}
                      <br />
                      Date and time:{" "}
                      {dateOfExhumation
                        ? moment(dateOfExhumation).format(DATE_TIME_FORMAT)
                        : ""}
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
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
