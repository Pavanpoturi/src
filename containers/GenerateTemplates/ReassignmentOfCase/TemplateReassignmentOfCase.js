import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";

export default function TemplateReassignmentOfCase({ fileName, data }) {
  const {
    dateOfReAssignment = "",
    presentIONameAndRank = "",
    newIONameAndRank = "",
    courtOrderDate = "",
    reasonForReAssigning = "",
    orderNo = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td width="10%">
                  <br />1<br />
                </td>
                <td width="40%">
                  <br />
                  Present I.O. name and rank
                  <br />
                </td>
                <td>
                  <br />
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {presentIONameAndRank
                      ? presentIONameAndRank
                      : "______________"}
                  </span>
                  <br />
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <br />2<br />
                </td>
                <td width="40%">
                  <br />
                  Date of Re-assignment
                  <br />
                </td>
                <td>
                  <br />
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {dateOfReAssignment ? dateOfReAssignment : "____________"}
                  </span>
                  <br />
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <br />3<br />
                </td>
                <td width="40%">
                  <br />
                  Name and rank of new IO
                  <br />
                </td>
                <td>
                  <br />
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {newIONameAndRank ? newIONameAndRank : "___________"}
                  </span>
                  <br />
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <br />4<br />
                </td>
                <td width="40%">
                  <br />
                  Reason for re-assigning
                  <br />
                </td>
                <td>
                  <br />
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {reasonForReAssigning ? reasonForReAssigning : "__________"}
                  </span>
                  <br />
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <br />5<br />
                </td>
                <td width="40%">
                  <br />
                  Order No and date
                  <br />
                </td>
                <td>
                  <br />
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {orderNo ? orderNo + "  " + courtOrderDate : "__________"}
                  </span>
                  <br />
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <br />6<br />
                </td>
                <td width="40%">
                  <br />
                  Upload Order
                  <br />{" "}
                </td>
                <td>
                  <br />
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {"__________"}
                  </span>
                  <br />
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
