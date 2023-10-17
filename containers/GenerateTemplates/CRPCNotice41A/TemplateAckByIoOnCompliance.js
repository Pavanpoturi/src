import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";

export default function TemplateAckByIoOnCompliance({ fileName, data }) {
  const {
    policeStation = "",
    currentDate = "",
    accusedName = "",
    IOName = "",
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
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="6%"> No :</td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td width="30%"> </td>
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Date:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        textAlign: "left",
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      {currentDate
                        ? moment(currentDate).format(DATE_FORMAT)
                        : moment().format(DATE_FORMAT)}
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
                textAlign: "center",
              }}
            >
              <br />
              <b style={{ textAlign: "center", padding: "0" }}>
                <u>ACKNOWLEDGMENT</u>
              </b>
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;In compliance with the above mentioned
                notice dated{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {currentDate ? moment(currentDate).format(DATE_FORMAT) : ""}
                </span>{" "}
                issued under Sec.41A Cr.P.C. the notice has appeared on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {currentDate
                    ? moment(currentDate).format(DATE_FORMAT)
                    : "__________"}
                </span>{" "}
                from{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  _________
                </span>{" "}
                to{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  _________
                </span>
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;That the noticee`s presence has been
                recorded in the register to be maintained by the police station{" "}
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;This acknowledgment is being issued in
                compliance with Sec.41A Cr.P.C. Documents produced by the notice
                have duly been seized vide seizure memo or production memo (copy
                enclosed). The notice undertakes to continue to comply with any
                further notices that she / he may receive during the course of
                the present investigation.
              </p>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <br />
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="30%">SIGNATURE OF ACCUSED </td>
                    <td
                      width="60%"
                      style={{ float: "right", marginLeft: "10%" }}
                    >
                      SIGNATURE OF INVESTIGATING OFFICER
                    </td>
                  </tr>
                  <tr>
                    <td width="30%">{accusedName}</td>
                    <td
                      width="60%"
                      style={{
                        float: "right",
                        textAlign: "center",
                        marginLeft: "10%",
                      }}
                    >
                      {IOName}
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
