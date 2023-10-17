import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateDisposalOfUnknownDeadBodies({
  fileName,
  data,
}) {
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
              <br /> To,
              <br />
              __________
              <br />
              __________
              <br />
            </td>
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
                    <td>Disposal of unknown dead bodies - reg</td>
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;I am to state that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling !== "" ? dateOfFiling : "__________"}
                </span>{" "}
                the complainant Sri/Smt
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {complainantname !== "" ? complainantname : "__________"}{" "}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {complainantaddress || "____________"}{" "}
                </span>{" "}
                presented a report / recorded statement wherein the complainant
                stated that
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt !== ""
                    ? complainantstatememt
                    : "_______________________"}
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
                &emsp;&emsp;&emsp;&nbsp;&nbsp;During the course of investigation
                scene of offence was visited, inquest held over the body of
                deceased and finger prints and other articles preserved for
                establishing identity of deceased. Messages, look out notices
                have been sent to all concerned. The particulars of the deceased
                got published in daily news papers. Inspite of best efforts, the
                identity of the deceased could not be established so far.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Since considerable time elapsed
                and the identity of the deceased is not established, the body is
                decomposed beyond identification. Hence, it is requested to
                dispose of the body and issue necessary certificate to the
                effect.
              </p>
              &emsp;&emsp;&emsp;&nbsp;&nbsp;Please acknowledge receipt of this
              letter.
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
          <table style={{ width: "75%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td width="5%"> Note: </td>
                <td>
                  <small>
                    As per guidelines the disposal of the dead body has to be
                    done after 72 hours.{" "}
                  </small>
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
