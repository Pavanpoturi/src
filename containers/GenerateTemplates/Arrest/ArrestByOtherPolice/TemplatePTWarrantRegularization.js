import { isUndefined } from "lodash";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";

export default function TemplatePTWarrantRegularization({ fileName, data }) {
  const {
    policeStation = "",
    district = "",
    firNumber = "",
    sectionOfLaw = "",
    IOName = "",
    accusedDetails = [],
    currentDate = "",
    courtName = "",
    accusedPersonalDetails = {},
  } = !isUndefined(data) && data;

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <th
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      IN THE COURT OF HONOURABLE{" "}
                      {courtName || "___________________"}
                    </th>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br /> Honoured Sir,
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{ paddingLeft: "5.5%", fontSize: 17, fontFamily: "Arial" }}
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
                      - Production of {accusedOrCCL} on Transit Warrant -
                      Regularization of Transit warrant - Prayed for{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        _________
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp; It is submitted that the Honourable
                court was pleased to issue Transit warrant against the following
                {accusedOrCCL} persons.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="10%">
                      <b> Sl.No. </b>
                    </td>
                    <td>
                      <b>No of {accusedOrCCL} </b>
                    </td>
                    <td>
                      <b>Name and address of {accusedOrCCL} person </b>
                    </td>
                  </tr>
                  {accusedDetails.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "100px",
                          }}
                        >
                          {" "}
                          1{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "150px",
                          }}
                        >
                          {item.accusedCode || "_________"}{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "280px",
                            textAlign: "justify",
                            lineHeight: "20px",
                          }}
                        >
                          {`${item.accusedName}
                          ${
                            item.fatherHusbandGuardianName
                              ? item.gender === "MALE"
                                ? ", s/o : "
                                : "d/o"
                              : ""
                          } ${item.fatherHusbandGuardianName}
                          ${item.gender ? "," : ""} ${item.gender}
                          ${
                            accusedPersonalDetails?.personalDetails?.age
                              ? ", Age : "
                              : ""
                          } ${accusedPersonalDetails?.personalDetails?.age}
                          ${item.occupation ? ", occ : " : ""} ${
                            item.occupation
                          }
                          ${item.caste ? ", caste : " : ""} ${item.caste}
                          ${
                            accusedPersonalDetails?.personalDetails?.nationality
                              ? ", r/o : "
                              : ""
                          } ${
                            accusedPersonalDetails?.personalDetails?.nationality
                          }
                          ${item.phone ? ", Contact No : " : ""} ${item.phone}
                          `}
                        </td>
                      </tr>
                    );
                  })}
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp; Accordingly, the {accusedOrCCL} were
                brought on Transit warrant and are herewith produced before the
                Honourable Court and it is prayed that the Honourable Court may
                kindly remand the {accusedOrCCL} in this case also and thereby
                regularize the presence of {accusedOrCCL}.
              </p>
              <br />{" "}
            </td>
          </tr>
          <tr>
            <td
              style={{ textAlign: "center", fontSize: 17, fontFamily: "Arial" }}
            >
              Be pleased to consider.
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ fontSize: 17, fontFamily: "Arial" }}>
                      <table style={{ width: "100%" }}>
                        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                          <tr>
                            <td width="8%">Place:</td>
                            <td
                              width="65%"
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              {policeStation}
                            </td>
                            <td>{IOName}</td>
                          </tr>
                          <tr>
                            <td>Date:</td>
                            <td
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              {currentDate}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td>{policeStation}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td>{district}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
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
