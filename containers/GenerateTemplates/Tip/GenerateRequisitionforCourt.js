import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";

export default function GenerateRequisitionforCourt({ fileName, data }) {
  const { accusedList = [], witnessList = [] } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto", fontSize: 17 }}>
      <table>
        <tbody>
          <tr>
            <td>
              <h5>
                <u>TEST IDENTIFICATION OF ACCUSED</u>
              </h5>
            </td>
          </tr>
          <tr>
            <td>
              <table
                style={{
                  width: "100%",
                  border: "1px solid black",
                  padding: "8px",
                  marginTop: "20px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                      width="10%"
                    >
                      Sl.No.
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      No of accused
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Name of accused
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Person identifying the accused{" "}
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Notice served on accused
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (1)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (2)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (3)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (4)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (5)
                    </td>
                  </tr>
                  {accusedList.map((accEle, i) => {
                    return (
                      <tr>
                        <td
                          style={{
                            width: "33%",
                            border: "1px solid black",
                            padding: "8px",
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{
                            width: "33%",
                            border: "1px solid black",
                            padding: "8px",
                          }}
                        >
                          A-{i + 1}
                        </td>
                        <td
                          style={{
                            width: "33%",
                            border: "1px solid black",
                            padding: "8px",
                          }}
                        >
                          {accEle.personalDetails?.name}
                        </td>
                        <td
                          style={{
                            width: "33%",
                            border: "1px solid black",
                            padding: "8px",
                          }}
                        >
                          {witnessList.map((witEle) => {
                            return (
                              <>
                                {witEle.personalDetails?.name}
                                <br></br>
                              </>
                            );
                          })}
                        </td>

                        <td
                          style={{
                            width: "33%",
                            border: "1px solid black",
                            padding: "8px",
                          }}
                        >
                          {accEle.noticeServedOnAccused ? "Yes" : "No"}
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
                  border: "1px solid black",
                  padding: "8px",
                  marginTop: "20px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Requisition filed on{" "}
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Order of court
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Date of TIP
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Whether identified or not
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      Upload TIP report
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (6)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (7)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (8)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (9)
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      (10)
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      {data.requisitionDate
                        ? moment(data.requisitionDate).format(DATE_TIME_FORMAT)
                        : ""}
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    />
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      {data.tipOrderDate
                        ? moment(data.tipOrderDate).format(DATE_TIME_FORMAT)
                        : ""}
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      {data.identifiedOrNot ? "Yes" : "No"}
                    </td>
                    <td
                      style={{
                        width: "33%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
