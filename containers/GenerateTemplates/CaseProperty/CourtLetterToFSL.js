import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";

export default function CourtLetterToFSL({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    division,
  } = !isUndefined(data) && data;

  return (
    <div id={fileName}>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <TemplatesLogo />
          </tr>
          <br />
          <tr style={{ textAlign: "center" }}>
            <h3>
              IN THE COURT OF HONOURABLE ...............................
              METROPOLITAN MAGISTRATE :
            </h3>
          </tr>
          <div style={{ marginTop: "20px", marginLeft: "60px", fontSize: 17 }}>
            <table>
              <tbody>
                <tr>
                  <span>Present:</span>
                  <br />
                  <span>Dated: {moment().format(DATE_TIME_FORMAT)}</span>
                </tr>
                <div style={{ marginTop: "20px" }}>
                  <tr>
                    <span>Dis.No.</span>
                  </tr>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <tr>
                    <span>
                      <u>O R D E R</u>
                    </span>
                  </tr>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <tr>
                    <td>To</td>
                  </tr>
                  <br />
                  <tr>
                    <td>
                      <hr
                        style={{
                          borderStyle: "dashed",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Forensic Science Labs</td>
                  </tr>
                  <tr>
                    <td>
                      <hr
                        style={{
                          borderStyle: "dashed",
                        }}
                      />
                    </td>
                  </tr>
                </div>
                <table style={{ width: "100%", marginTop: 25 }}>
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
                        Division{" "}
                        <span
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {division}
                        </span>{" "}
                        P S{" "}
                        <span
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {policeStation}
                        </span>{" "}
                        Forwarding of material objects for analysis - reg{" "}
                        <span
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="6%" style={{ verticalAlign: "top" }}>
                        Ref:-
                      </td>
                      <td>
                        Cr.No
                        <span
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {firNumber}
                        </span>
                        u/s
                        <span
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {sectionOfLaw}
                        </span>
                        . of PS
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
                <br />
                <div style={{ marginTop: "30px" }}>
                  <td style={{ fontSize: 17 }}>
                    I am herewith forwarding the material objects together with
                    the letter of advice prepared by the Investigating officer
                    in the above referred case and you are hereby directed to
                    arrange for the examination in the light of Letter of Advice
                    and forward the report at the earliest.
                  </td>
                </div>
              </tbody>
            </table>
            <br />
            <div style={{ fontSize: 17 }}>
              <br />
              <tr>
                <td>MAGISTRATE</td>
              </tr>
              <tr>
                <td>Encl: 1) Letter of advice</td>
              </tr>
              <tr>
                <td>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2)
                  Material object
                </td>
              </tr>
            </div>
          </div>
        </tbody>
      </table>
    </div>
  );
}
