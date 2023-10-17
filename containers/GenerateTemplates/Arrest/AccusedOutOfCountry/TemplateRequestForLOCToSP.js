import { isUndefined } from "lodash";
import TemplateSignature from "../../TemplateSignature";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateRequestForLOCToSP({ fileName, data }) {
  const {
    policeStation = "",
    district = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedDetails = [],
    currentDate = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
    IOName = "",
    selectTeamToGoOut = [],
  } = !isUndefined(data) && data;

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <b>
                GOVERNMENT OF TELANGANA
                <br /> (POLICE DEPARTMENT)
                <br />
              </b>
            </td>
          </tr>
          <tr>
            <td>
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={currentDate}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              To,
              <br />
              The Commissioner of Police / Superintendent of Police
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>
              {" "}
              /through proper channel/
            </td>
          </tr>

          <tr>
            <td> Sir,</td>
          </tr>

          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                paddingLeft: "5.5%",
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
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      - Request for LOC (Look Out Circular) against{" "}
                      {accusedOrCCL} out of Country - Request - reg.{" "}
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
                      . of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      .
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp; It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {complainantname || "__________"}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {complainantaddress || "__________"}
                </span>{" "}
                presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                stating that
                <div
                  style={{
                    padding: "0 10px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </div>
              </p>
              <br />
              <p>
                {" "}
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
              <br />
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp; During the course of investigation, the
                scene of offence was visited, statements of witnesses were
                recorded. The investigation prima facie established offences
                against the {accusedOrCCL}. However, the following{" "}
                {accusedOrCCL} are out of country:
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Sl.No.</b>{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>No of {accusedOrCCL}</b>{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Name and address of {accusedOrCCL} person</b>{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Passport </b>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Address of Country </b>
                    </td>
                  </tr>
                  {accusedDetails.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "100px",
                          }}
                        >
                          {" "}
                          1{" "}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {item.accusedCode || ""}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "400px",
                          }}
                        >
                          {`${item.accusedName}${
                            item.personAddress ? "," : ""
                          } ${item.personAddress || ""}`}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {" "}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {" "}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp;In order to trace the above{" "}
                {accusedOrCCL} LOC (Look Out Circular) is necessary action. As
                such, I have obtained NBW from the Honourable High Court.
              </p>
              <br />
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;Hence, it is requested to forward LOC
                (Look Out Circular) requisition to the Addl DGP, CID, AP,
                Hyderabad who is nodal officer for forwarding the same to
                Ministry of Home Affairs, New Delhi for initiating LOC against
                the {accusedOrCCL}.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <br />
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      <b>Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b> Name and Designation</b>{" "}
                    </td>
                    <td>
                      <b>Police Station</b>{" "}
                    </td>
                  </tr>
                  {selectTeamToGoOut.map((s, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {i + 1}{" "}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {s}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {policeStation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <table
                style={{
                  width: "100%",
                }}
              >
                <TemplateSignature
                  IOName={IOName}
                  policeStation={policeStation}
                  district={district}
                />
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
