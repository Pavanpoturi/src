import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";

export default function GenerateRequisitionforCourt({ fileName, data }) {
  const { witnessList = [], natureOfItems = [] } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto", fontSize: 17 }}>
      <table className="w-100">
        <tbody>
          <tr>
            <td className="text-center">
              <h5>
                <u>TEST IDENTIFICATION OF Articles</u>
              </h5>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <table
                className="border w-100"
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
                        border: "1px solid black",
                        padding: "8px",
                        width: "10%",
                      }}
                      width="10%"
                    >
                      Sl.No.
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Person identifying the articles
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Nature of item
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Description of article{" "}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Date of identification
                    </td>
                  </tr>

                  {witnessList.map((witEle, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            width: "10%",
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            width: "20%",
                          }}
                        >
                          <>
                            {`${witEle.personalDetails?.name}
                ${
                  data.tipCodes && data.tipCodes[witEle._id]
                    ? `(${data.tipCodes[witEle._id]})`
                    : ""
                } 
                 ${
                   witEle.personalDetails?.gender
                     ? `${witEle.personalDetails?.gender} ,`
                     : ""
                 } 
                      ${
                        witEle.presentAddress?.houseNo
                          ? `${witEle.presentAddress?.houseNo} ,`
                          : ""
                      } 
                      ${
                        witEle.presentAddress?.wardColony
                          ? `${witEle.presentAddress?.wardColony} ,`
                          : ""
                      } 
                      ${
                        witEle.presentAddress?.streetRoadNo
                          ? `${witEle.presentAddress?.streetRoadNo} ,`
                          : ""
                      }
                      ${
                        witEle.presentAddress?.district
                          ? `${witEle.presentAddress?.district} `
                          : ""
                      } 


                      `}
                            <br />
                          </>
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            width: "20%",
                          }}
                          className="dataline"
                        >
                          {natureOfItems.map((natureItems) => {
                            return (
                              <>
                                {natureItems.type ? natureItems.type : ""}
                                <br></br>
                              </>
                            );
                          })}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            width: "20%",
                          }}
                        >
                          {natureOfItems.map((natureItems) => {
                            return (
                              <>
                                {natureItems.subType ? natureItems.subType : ""}
                                <br></br>
                              </>
                            );
                          })}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            width: "10%",
                          }}
                        >
                          {data.requisitionDate
                            ? moment(data.requisitionDate).format(
                                DATE_TIME_FORMAT
                              )
                            : ""}
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
                className="w-100 border"
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
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Panch witnesses{" "}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Officer conducting test identification
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                    >
                      Remarks
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                      className="dataline"
                    >
                      {natureOfItems.map((natureItems) => {
                        return (
                          <>
                            {natureItems.panchWitness
                              ? `${natureItems.panchWitness}(${natureItems.type})`
                              : ""}
                            <br />
                          </>
                        );
                      })}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                      className="dataline"
                    >
                      {data.IOName ? data.IOName : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        width: "20%",
                      }}
                      className="dataline"
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
