import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateReopeningOfChargedCase({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    courtName = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateofcomplaint = "",
    courtOrderDate = "",
    courtOrderNo = "",
    dateOfFiling = "",
    slNo = "",
    date = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <b>
                        IN THE COURT OF HONOURABLE {courtName || "__________"}
                      </b>
                    </td>
                    <br />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <br />
              Honoured Sir, <br />
            </td>
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
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "1px dashed #ccc",
                          width: "200px",
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "1px dashed #ccc",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      - REQUISITION TO COURT FOR REOPENING OF CHARGED CASE U/S
                      173(8) Cr P C{" "}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      {" "}
                      Cr.No{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "1px dashed #ccc",
                          width: "200px",
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "1px dashed #ccc",
                          width: "200px",
                        }}
                      >
                        {sectionOfLaw}
                      </span>{" "}
                      .PS
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "1px dashed #ccc",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      .<br />
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateofcomplaint}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "________"}
                </span>{" "}
                r/o .{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantaddress || "________"}
                </span>{" "}
                . presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                . stating that{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "________"}
                </span>{" "}
                for the alleged offence of Forgery of signatures in executing
                the sale deed.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;As per the contents of the report a case
                in Cr.No{" "}
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
                </span>{" "}
                was registered and investigation was taken up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;During the course of investigation the
                scene of offence was visited and panchanama of scene conducted.
                Statements of witnesses who were all well acquainted with facts
                and circumstances of the case recorded. The accused were
                arrested and charge sheet has been filed before the Honourable
                Court.{" "}
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;The Honourable court was pleased to take
                the case on file and allotted CC Number / PRC No.
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {slNo}
                </span>{" "}
              </p>
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
                &emsp;&emsp;&emsp;&nbsp;However, now further evidence has come
                to light and the case needs further detailed probe. Hence, it is
                essential to reopen the case for the following reasons:
              </p>
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
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="6%">1 </td>
                    <td>Further evidence</td>
                  </tr>
                  <tr>
                    <td> 2 </td>
                    <td>
                      Orders from Honourable Court of{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {courtName}
                      </span>{" "}
                      vide No.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {courtOrderNo}
                      </span>{" "}
                      dated{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {courtOrderDate}
                      </span>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 3 </td>
                    <td>
                      Orders of Honourable Commission{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>{" "}
                      vide order no.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {slNo}
                      </span>
                      dated{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {date}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td> 4 </td>
                    <td>
                      Orders from Government vide No.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {slNo}
                      </span>{" "}
                      dated{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {date}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td> 5 </td>
                    <td>
                      Orders from Superior officer vide no.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {slNo}
                      </span>{" "}
                      dated{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {date}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <td
            style={{
              fontSize: 17,
              fontFamily: "Arial",
              textAlign: "justify",
              lineHeight: "20px",
            }}
          >
            <p>
              &emsp;&emsp;&emsp;&nbsp;In the light of the above, it is prayed
              that permission may kindly be accorded u/s 173(8) CrP.C. to reopen
              the case and investigate into the matter.
            </p>
          </td>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <br />
              BE PLEASED TO CONSIDER.
            </td>
          </tr>
          <tr>
            <td>
              Place:
              <span
                style={{
                  padding: "0 10px",
                  borderBottom: "1px dashed #ccc",
                  width: "200px",
                }}
              ></span>
              <br />
              <br />
              Date:
              <span
                style={{
                  padding: "0 10px",
                  borderBottom: "1px dashed #ccc",
                  width: "200px",
                }}
              >
                {dateOfFiling}
              </span>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                    showurfaith={"2"}
                  />
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
