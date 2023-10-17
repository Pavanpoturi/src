import TemplatesLogo from "../TemplatesLogo";
import { isUndefined } from "lodash";

const tableStyle = {
  width: "100%",
  tableLayout: "auto",
};
const bodyStyle = {
  textIndent: "40px",
  textAlign: "justify",
};

const signStyle = {
  textIndent: "40px",
  textAlign: "right",
  direction: "rtl",
};

const subRefStyle = {
  textIndent: "10px",
};

const pStyle = {
  fontFamily: "Arial",
  fontSize: "13.5px",
};

const hr1Style = {
  borderTop: "1px solid black",
};

export default function TemplateCPLetterSendingCDFileToOthers({
  fileName,
  data,
}) {
  console.log("fileName,data", fileName, data);
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    IOName = "",
  } = !isUndefined(data) && data;
  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <div>
        <center>
          <p style={pStyle}>GOVERNMENT OF TELANGANA</p>
          <p style={pStyle}>(POLICE DEPARTMENT)</p>
        </center>
        <br />
        <table style={{ ...tableStyle, ...pStyle }}>
          <tbody>
            <tr>
              <td>From</td>
              <td>:</td>
              <td>To</td>
            </tr>
            <tr>
              <td>Commissioner of Police/</td>
              <td>:</td>
              <td>Commissioner of Police/</td>
            </tr>
            <tr>
              <td>Superintendent of Police</td>
              <td>:</td>
              <td>Superintendent of Police</td>
            </tr>
            <tr>
              <td>Unit Name</td>
              <td>:</td>
              <td>Unit Name</td>
            </tr>
          </tbody>
        </table>

        <hr style={hr1Style} />
        <center>
          <p style={pStyle}>
            <u>No……………………………………… dated: ………………</u>
          </p>
        </center>
        <p style={pStyle}>Sir,</p>
        <p style={{ ...subRefStyle, ...pStyle }}>
          Sub: UNIT NAME - PS NAME - Transfer of CD file on the point of
          jurisdiction - Reg
        </p>
        <p style={{ ...subRefStyle, ...pStyle }}>
          Ref:
          <ol>
            <li style={pStyle}>
              Cr.no {!!firNumber ? <u>{firNumber}</u> : "    _________________"}
              . u/s{"   "}
              {!!sectionOfLaw ? <u>{sectionOfLaw}</u> : "  _________________"}.
              Of P S
              {!!policeStation ? <u>{"  " + policeStation}</u> : "   _________"}
              .
            </li>
            <li style={pStyle}>
              Lr.No{" "}
              {!!firNumber ? <u>{"  " + firNumber}</u> : "  _________________"}.
              dated ……………………………. Of PS
              {!!policeStation ? <u>{"  " + policeStation}</u> : "  _________"}.
            </li>
          </ol>
        </p>
        <br />

        <p style={{ ...bodyStyle, ...pStyle }}>
          With reference to the subject cited, I am herewith forwarding the
          original CD file in Cr.No{" "}
          {!!firNumber ? <u>{firNumber}</u> : "  _________________"}   u/s {"   "}
          {!!sectionOfLaw ? <u>{sectionOfLaw}</u> : "  _________________"}. of
          P.S {"  "}
          {!!policeStation ? <u>{"  " + policeStation}</u> : "  _________"}{" "}
          together with detailed report of the IO on the point of jurisdiction
          with a request to arrange for re-registration and further
          investigation at your end.
        </p>
        <br />
        <p style={{ ...signStyle, ...pStyle }}>Yours faithfully</p>
        <p style={{ ...signStyle, ...pStyle }}>UNIT OFFICER</p>
        <br />
        <p style={pStyle}>Encl Original CD file containing ( ) pages</p>
        <p style={pStyle}>
          Copy to the Dy Commissioner of Police, …………… Zone for information
        </p>
        <p style={pStyle}>Copy to the ACP / SDPO for information</p>
        <p style={pStyle}>Copy to the SHO ………………………… PS for information</p>
      </div>

      <div />
    </div>
  );
}
