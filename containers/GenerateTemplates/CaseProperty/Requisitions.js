import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";

export default function Requisitions({ fileName, data }) {
  const { formData = [] } = !isUndefined(data) && data;

  return (
    <div
      id={fileName}
      style={{ width: "100%", padding: "0 10%", fontSize: 17 }}
    >
      <TemplatesLogo />
      <table>
        <tbody>
          <tr>
            <td>
              <table style={{ textAlign: "center" }}>
                <tbody>
                  <tr style={{ textDecoration: "underLine" }}>
                    <td>
                      <b>
                        IN THE COURT OF HONOURABLE
                        .....................................{" "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <span />
              <span />
              Present:
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ marginTop: "24px" }}>
                <tbody>
                  <tr>
                    <td>Dis.No.</td>
                    <td />
                    <td style={{ width: "40%" }}></td>
                    <td>
                      Dated:{" "}
                      <span style={{ borderBottom: "1px dashed #ccc" }}>
                        {formData[0]
                          ? moment(formData[0].dateCreated).format(
                              DATE_TIME_FORMAT
                            )
                          : ""}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <b style={{ marginTop: "24px" }}>
                <u>O R D E R</u>
              </b>
              <br />
              <br />
              TO <br></br>Send To FSL/Govt Examiner<br></br>......
            </td>
          </tr>
          <td> Sir,</td>
          <br />
          <br />
          <tr>
            <td>
              <span />
              The facts of the case are that in the above referred crime,
              material objects have been seized. Further, the material objects
              have to be forwarded to Forensic Science Labs for analysis and
              report.
            </td>
          </tr>
          <tr>
            <td>
              <span />
              In this connection, a letter of advice has been prepared and it is
              prayed that the Honourable court may kindly forward the material
              objects to Forensic Science Labs for analysis and report.
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td>
              <b> Encl:</b>
              <br />
              <span />
              <b>1) Letter of advice</b>
              <br />
              <span />
              <b>2) Material objects</b>
            </td>
          </tr>
          <tr>
            <br />
            <td style={{ position: "absolute", marginLeft: "55%" }}>
              <b>MAGISTRATE</b>
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td style={{ position: "absolute", marginLeft: "55%" }}>
              <span>{data?.IOName}</span>
            </td>
          </tr>
          <br />
          <tr>
            <td style={{ position: "absolute", marginLeft: "55%" }}>
              <span>{data?.policeStation} </span>
            </td>
          </tr>
          <br />
          <tr>
            <td style={{ position: "absolute", marginLeft: "55%" }}>
              <span>{data?.district}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
