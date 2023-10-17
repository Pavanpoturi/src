import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";

export default function LetterToACP({ fileName, data }) {
  const {
    policeStation = "",
    district,
    firNumber = "",
    sectionOfLaw = "",
  } = !isUndefined(data) && data;

  return (
    <div
      id={fileName}
      style={{ width: "100%", padding: "0 10%", fontSize: 17 }}
    >
      <table>
        <tbody>
          <tr>
            <TemplatesLogo />
          </tr>
          <tr style={{ textAlign: "center" }}>
            <h4>
              GOVERNMENT OF TELANGANA <br /> ( POLICE DEPARTMENT )
            </h4>
          </tr>
          <br />
          <tr style={{ marginLeft: 400, float: "right" }}>
            <table>
              <tbody>
                <tr>
                  <td>Police Station: </td>
                  <td>{policeStation}</td>
                </tr>
                <tr>
                  <td>District/Unit: </td>
                  <td>{district}</td>
                </tr>
                <tr>
                  <td>Date: </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </tr>
          <tr>
            No.
            <br />
            To <br /> The Assistant Commissioner of Police <br />
            Division
            <br />
            <hr
              style={{ width: "25%", marginLeft: "3px", marginTop: "20px" }}
            />
            sir
          </tr>
          <table
            style={{
              width: "100%",
              marginTop: "25px",
              fontSize: 17,
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "5%" }}>Sub:-</td>
                <td>
                  {`P S  .....${policeStation}....`} Forwarding of material
                  objects to FSL – reg
                </td>
              </tr>
              <tr>
                <td>Ref:-</td>
                <td>
                  {`Cr.No .....${firNumber}....`} U/S .....{sectionOfLaw}.....
                  {`of PS .....${policeStation}.....`}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: "30px" }}>
            <td>
              I submit that material objects have been seized in the above
              referred case. In this connection, I am submitting herewith Letter
              of Advice and MOs seized and request to forward the same to the
              Forensic Science Labs................................ for analysis
              and report.
            </td>
          </div>
          <div style={{ marginTop: 50, marginLeft: 500 }}>
            <tr>
              <td>Yours faithfully,</td>
            </tr>
          </div>
          <div style={{ marginTop: 10, marginLeft: 500 }}>
            <tr>
              <td>INVESTIGATING OFFICER</td>
            </tr>
          </div>
          <div>
            <tr>
              <td>Place:</td>
            </tr>
            <tr>
              <td>Date and time:</td>
            </tr>
          </div>
          <div style={{ marginTop: "10px" }}>
            <tr>
              <td>Encl: 1) Letter of advice </td>
            </tr>
            <tr>
              <td style={{ marginLeft: 39 }}>2) Material objects</td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
  );
}
