import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateSubmissionOfInquestToCourt({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateTime = "",
    accusedName = "",
    personAddress = "",
    IOName = "",
    district = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        fontSize: 17,
                        fontFamily: "Arial",
                      }}
                    >
                      <b>IN THE COURT OF HONOURABLE ______________ </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br />
              Honoured Sir, <br />
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
                    <td>Submission of original inquest report - reg</td>
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
                          width: "200px",
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          width: "200px",
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                      . of PS &nbsp;
                      <span
                        style={{
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp;&nbsp;I am herewith submitting the
                original inquest ({" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                pages ) in the above referred case conducted on the body of
                deceased
                <div
                  style={{
                    padding: "0 10px",
                    width: "500px",
                  }}
                >
                  {accusedName || "__________"}{" "}
                  {personAddress || "____________"}
                </div>
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;By MRO / Police and it is prayed
                that the same may please be taken on file.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              BE PLEASED TO CONSIDER
            </td>
          </tr>
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                        showurfaith={"2"}
                      />
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          Encl: Original Inquest.
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
