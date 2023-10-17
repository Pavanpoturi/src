import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "./../../FirDetails/fir-util";
import TemplateSignature from "../TemplateSignature";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateHeader from "../TemplateHeader";

export default function TemplateRequisitionToProidePanchWitnesses({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateTime = "",
    district = "",
    accusedName = "",
    personAddress = "",
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
            <td>
              {" "}
              <br /> <br />
              To,
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
                      Dist{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {district}
                      </span>{" "}
                      PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      Request for deputing two panch witnesses u/s 175 Cr.P.C.
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>{" "}
                      Holding of inquest u/s 174 Cr.P.C - reg
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
              <br />
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;&nbsp;With reference to the subject
                cited, I am to submit that inquest over the body of deceased{" "}
                <br />
                <div
                  style={{
                    padding: "0 10px",
                    textAlign: "left",
                    width: "500px",
                  }}
                >
                  {accusedName || "___________"}{" "}
                  {personAddress || "____________"}
                </div>
                <br />
              </p>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;&nbsp; In the above referred case is
                proposed to be held u/s 174 Cr.P.C. Hence, it is requested to
                depute two officials to act as panch witnesses for the above
                said proceedings to the following place:
              </p>
              <br />
              <br />
            </td>
          </tr>
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td>
                  <br />
                  Place: <span>__________</span>
                  <br />
                  Date and time: <span>__________</span>
                </td>{" "}
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
