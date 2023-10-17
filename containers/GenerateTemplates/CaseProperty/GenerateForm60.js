import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";

export default function GenerateForm60({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    formData = [],
  } = !isUndefined(data) && data;

  return (
    <div
      id={fileName}
      style={{ width: "100%", padding: "0 10%", fontSize: 17 }}
    >
      <TemplatesLogo />
      <table>
        <tbody>
          <td style={{ textAlign: "center" }}>
            <br />
            <h5>LIST OF PROPERTY SENT TO MAGISTRATE</h5>
          </td>
          <tr>
            <td>
              <table
                style={{
                  border: "1px solid black",
                  width: "100%",
                  marginTop: "24px",
                  fontSize: 17,
                }}
              >
                <tbody>
                  <tr style={{ border: "1px solid black" }}>
                    <td
                      style={{
                        width: "30%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      Date of List
                    </td>
                    <td
                      style={{
                        width: "70%",
                        border: "1px solid black",
                        padding: "8px",
                        borderBottom: "1px dashed #ccc",
                        fontSize: 17,
                      }}
                    >
                      {formData[0].dateCreated
                        ? moment(formData[0].dateCreated).format(
                            DATE_TIME_FORMAT
                          )
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "30%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      Police Station
                    </td>
                    <td
                      style={{
                        width: "70%",
                        border: "1px solid black",
                        fontSize: 17,
                      }}
                    >
                      {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "30%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      Date of Dispatch
                    </td>
                    <td
                      style={{
                        width: "70%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      {" "}
                      {formData[0].date
                        ? moment(formData[0].date).format(DATE_TIME_FORMAT)
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <table
                style={{
                  border: "1px solid black",
                  width: "100%",
                  marginTop: "40px",
                  fontSize: 17,
                }}
              >
                <tbody>
                  <tr style={{ border: "1px solid black" }}>
                    <td
                      style={{
                        width: "8%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      1
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      No of Case Register
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      Cr. No.{" "}
                      <span
                        style={{
                          borderBottom: "1px dashed #ccc",
                          fontSize: 17,
                        }}
                      >
                        {firNumber}
                      </span>
                      <br />
                      U/s{" "}
                      <span
                        style={{
                          borderBottom: "1px dashed #ccc",
                          fontSize: 17,
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid black", fontSize: 17 }}>
                    <td
                      style={{
                        width: "8%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      2
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      Rank and name of officer making seizure
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      <span
                        style={{
                          borderBottom: "1px dashed #ccc",
                          fontSize: 17,
                        }}
                      >
                        {data.IOName ? data.IOName : ""}
                      </span>
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid black" }}>
                    <td
                      style={{
                        width: "8%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      3
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      List of property seized or found
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      {formData.map((ele) => {
                        return <p>{ele.name ? ele.name : ""}</p>;
                      })}
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid black", fontSize: 17 }}>
                    <td
                      style={{
                        width: "8%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      4
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      When and from whom seized or where found
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      {formData[0].dateCreated
                        ? moment(formData[0].dateCreated).format(
                            DATE_TIME_FORMAT
                          )
                        : ""}
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid black" }}>
                    <td
                      style={{
                        width: "8%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      5
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      When, where and from whom stolen or nature of suspicious
                      circumstances
                    </td>
                    <td
                      style={{
                        width: "40%",
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: 17,
                      }}
                    >
                      {formData[0].dateCreated
                        ? moment(formData[0].dateCreated).format(
                            DATE_TIME_FORMAT
                          )
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ marginTop: "40px", fontSize: 17 }}>
                <tbody>
                  <tr>
                    <td>Station:</td>
                    <td>
                      <span style={{ borderBottom: "1px dashed #ccc" }}>
                        {policeStation}
                      </span>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>DATED:</td>
                    <td>
                      <span
                        style={{
                          borderBottom: "1px dashed #ccc",
                          fontSize: 17,
                        }}
                      >
                        {formData[0].dateCreated
                          ? moment(formData[0].dateCreated).format(
                              DATE_TIME_FORMAT
                            )
                          : ""}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              <b>INVESTIGATING OFFICER</b>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              <span>{data?.IOName}</span>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              <span>{data?.policeStation} </span>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              <span>{data?.district}</span>
            </td>
          </tr>
          <br />
        </tbody>
      </table>
    </div>
  );
}
