import { isUndefined } from "lodash";
import TemplateHeader from "../TemplateHeader";
import TemplatesLogo from "../TemplatesLogo";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateExhumationOfUnknownBody({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
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
                  dateOfExhumation
                    ? moment(dateOfExhumation).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              {" "}
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
                &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateofFiling ? moment(dateofFiling).format(DATE_FORMAT) : ""}
                </span>{" "}
                Sri / Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "__________"}{" "}
                  {complainantaddress || "____________"}
                </span>
                Presented a report in P S{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                stating that the parts of the unknown dead body are protruding
                to sky at the{" "}
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {placeOfExhumation || ""}
                </span>{" "}
                (place) and requested necessary action.
              </p>{" "}
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;A case under reference was registered
                and investigation taken up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;Hence, in the light of the above facts,
                it is requested to visit the spot and order for exhuming the
                body by following the due procedures and conduct inquest and
                subject the body for post-mortem examination.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody>
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
