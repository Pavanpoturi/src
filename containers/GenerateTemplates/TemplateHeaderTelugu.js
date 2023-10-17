export default function TemplateHeaderTelugu({
  policeStation = "",
  district = "",
  currentDate = "",
  shownum = 1,
}) {
  return (
    <table style={{ width: "100%" }}>
      <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
        <tr>
          <td width="10%" />
          <td width="20%" />
          <td width="30%" />
          <td
            width="20%"
            style={{
              textAlign: "right",
              verticalAlign: "top",
            }}
          >
            పోలీసుస్టేషన్ :{" "}
          </td>
          <td
            style={{
              textAlign: "left",
              padding: "0 10px",
              width: 200,
              verticalAlign: "top",
            }}
          >
            {policeStation || "__________"}
          </td>
        </tr>
        <tr>
          <td width="10%" />
          <td width="20%" />
          <td width="30%" />
          <td
            width="18%"
            style={{
              textAlign: "right",
              verticalAlign: "top",
            }}
          >
            జిల్లా :{" "}
          </td>
          <td
            style={{
              textAlign: "left",
              padding: "0 10px",
              width: 200,
              verticalAlign: "top",
            }}
          >
            {district || "__________"}
          </td>
        </tr>
        <tr>
          <td
            width="6%"
            style={{
              verticalAlign: "top",
            }}
          >
            {" "}
            {shownum === 1 ? "NO." : ""}{" "}
          </td>
          <td
            width="20%"
            style={{
              padding: "0 10px",
              textAlign: "left",
              width: 200,
            }}
          >
            {shownum === 1 ? "__________" : ""}
          </td>
          <td width="30%" />
          <td
            width="18%"
            style={{
              textAlign: "right",
              verticalAlign: "top",
            }}
          >
            తేది:{" "}
          </td>
          <td
            width="40%"
            style={{
              textAlign: "left",
              width: 200,
              padding: "0 10px",
              verticalAlign: "top",
            }}
          >
            {currentDate || "__________"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
