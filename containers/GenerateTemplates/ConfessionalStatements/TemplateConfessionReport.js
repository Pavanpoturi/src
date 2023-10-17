export default function TemplateConfessionReport({ fileName, data }) {
  console.log(data);
  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <br />
              <h4 style={{ textAlign: "center", padding: "0" }}>
                <u>CONFESSIONAL STATEMENT</u>
              </h4>
              <br />
              <br />
              <br />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
