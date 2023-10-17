import { loadState } from "@lib/helpers/localStorage";

export default function TemplateSignature({
  IOName = "",
  policeStation = "",
  district = "",
  showurfaith = 1,
}) {
  return (
    <tr>
      <td>
        <br />
        <table width="100%" style={{ marginTop: 5 }}>
          <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
            <tr>
              <td width="10%" />
              <td width="20%" />
              <td width="25%" />
              <td width="45%">
                {" "}
                {showurfaith === 1 ? "Your's faithfully," : ""}{" "}
              </td>
            </tr>
            <tr>
              <td width="10%" />
              <td width="20%" />
              <td width="25%" />
              <td width="45%"> {IOName} </td>
            </tr>
            <tr>
              <td width="10%" />
              <td width="20%" />
              <td width="25%" />
              <td width="45%"> {policeStation} </td>
            </tr>
            <tr>
              <td width="10%" />
              <td width="20%" />
              <td width="25%" />
              <td width="45%"> {district} </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
