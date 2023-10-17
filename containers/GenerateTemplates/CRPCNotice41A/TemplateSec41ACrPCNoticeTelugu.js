import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeaderTelugu from "../TemplateHeaderTelugu";

export default function TemplateSec41ACrPCNoticeTelugu({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    dateOfFiling = "",
    sectionOfLaw = "",
    dateOfIssue = "",
    accusedName = "",
    district = "",
    IOName = "",
    noOfDaysGivenForExplanation = "",
    personAddress = "",
  } = !isUndefined(data) && data;

  const totalDays =
    dateOfIssue &&
    !isEmpty(dateOfIssue) &&
    noOfDaysGivenForExplanation &&
    !isEmpty(noOfDaysGivenForExplanation) &&
    moment(moment(dateOfIssue).format(DATE_FORMAT), DATE_FORMAT).add(
      noOfDaysGivenForExplanation,
      "d"
    );

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                తెలంగాణ రాష్ట్ర ప్రభుత్వం
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                (పోలీసు శాఖ)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <TemplateHeaderTelugu
                policeStation={policeStation}
                district={district}
                currentDate={
                  dateOfIssue
                    ? moment(dateOfIssue).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
                shownum={"2"}
              />
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <b style={{ textAlign: "center", padding: "0" }}>
                <u>సెక్షన్ 41A Cr.P.C. నోటీసు</u>
                <br />
              </b>
              <b style={{ textAlign: "center", padding: "0" }}>
                <u>(WP (C)లో ఢిల్లీ హైకోర్టు తీర్పు ప్రకారం 7608/2017)</u>
              </b>
              <br />
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
                &emsp;&emsp;&emsp;&nbsp;సెక్షన్ 41A Cr.P.C. ప్రకారము సంక్రమించిన
                అధికారముతో,{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                పోలీసుస్టేషన్ లో నమోదుచేయబడిన ఎఫ్.ఐ.ఆర్. నెంబర్{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {firNumber}
                </span>{" "}
                తేది{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling ? dateOfFiling : "__________"}
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
                కేసు దర్యాప్తులో భాగంగా సహేతుకమైన ఆధారాలు, మిమ్ములను
                ప్రశ్నించవలసిన అవసరము ఉన్నందున, మీరు తేది{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {totalDays ? moment(totalDays).format(DATE_FORMAT) : ""}
                </span>
                .సమయములకు
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  _________{" "}
                </span>{" "}
                మీ కేసు యొక్క నివాస ఆధారములతో పోలీసుస్టేషన్ కు వచ్చి, కేసు కు
                సంబంధించిన మీ వద్ద ఉన్న ఆధారములను మరియు మీరు చెప్పదలచిన వివరాలను
                సమర్పించ గలరు.{" "}
              </p>
              <br />
              <br />{" "}
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
                &emsp;&emsp;&emsp;&nbsp;ఇందుమూలముగా మీకు తెలియ చేయునది ఏమనగా
                మీరు ఈ క్రింది విధముగా పొందుపరచబడిన నిబంధనలు తప్పకుండ పాటించగలరు
                :
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
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
                    <td width="5%">ఎ) </td>
                    <td>మీరు భవిష్యత్ లో ఎటువంటి నేరము చేయరాదు.</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> బి) </td>
                    <td>
                      మీరు ఎట్టి పరిస్థితుల్లో ఈ కేసుకు సంబంధించిన ఆధారాలను
                      ఏవిధముగా కూడ తారు మారు చేయరాదు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> సి) </td>
                    <td>
                      మీరు ఈ కేసుకు సంబంధించిన వ్యక్తులను బలవంతముగా కాని
                      ఏవిధముగా కాని ప్రలోభాలకు / భయబ్రాంతులకు గురి చేసి తాను
                      చెప్పదలచిన సాక్ష్యాలను కోర్టులో గాని పోలీసు అధికారి
                      ముందరగాని చెప్పకుండా చేయకూడదు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> డి) </td>
                    <td>
                      మీరు సంబంధిత న్యాయస్థానములో అవసరము అయినప్పుడు / కోర్టు
                      ఆదేశాల మేరకు హాజరు కాగలరు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> ఇ) </td>
                    <td>
                      మీరు సంబంధిత కేసు పరిశోధనా నిమిత్తం అవసరమైనప్పుడు సహకారము
                      చేయగలరు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> ఎఫ్) </td>
                    <td>
                      మీరు కేసుకు సంబంధించిన పూర్తి వివరాలను నమ్మశక్యము గా మరియు
                      ఎటువంటి సమాచారము దాచి పెట్టకుండా తెలిపి కేసు పరిశోధనా సరైన
                      రీతిలో న్యాయపరంగా పూర్తి చేయుటకు సహకరించగలరు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> జి)</td>
                    <td>
                      మీరు పరిశోధనా నిమిత్తము కావలసిన సంబంధిత కాగితాలు / ఇతర
                      ఆధారములు చట్టరీత్యా సమర్పిచగలరు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> ఎచ్)</td>
                    <td>
                      మీరు ఎట్టి పరిస్థితుల్లో కేసు దర్యాప్తు / కోర్టులో కేసు
                      విచారణ సంబంధించిన ఆధారాలను నశింప చేయడానికి ప్రయత్నం
                      చేయరాదు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}> ఐ)</td>
                    <td>
                      మీ యొక్క ఇంటి చిరునామా మరియు ఫోన్ నెంబర్ మారినప్పుడు తెలియ
                      చేయగలరు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>జె)</td>
                    <td>
                      కోర్టు వారి/ పరిశోధనా అధికారి పర్మిషన్ లేకుండా దేశము
                      విడిచి వెళ్ళరాదు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>కె)</td>
                    <td>
                      పరిశోధనా అధికారి పర్మిషన్ / తెలియ చేయకుండా మీ హెడ్
                      క్వార్టర్స్ విడిచి వెళ్ళరాదు.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>ఎల్)</td>
                    <td>
                      మీరు పరిశోధనా అధికారి ఏ ఇతర నిభందనలు / కాగితములు ఆదేశించిన
                      విధముగా పాటించగలరు.
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;పై తెలిపిన నిబంధనలు ఉల్లంఘించిన మరియు
                పాటించక పోయిన మీపై సెక్షన్ 41A (3) and (4) of Cr.P.C. ప్రకారము
                చర్య తీసుకొనబడును.
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
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
          <tr>
            <td>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    {" "}
                    <td> To </td>{" "}
                  </tr>
                  <tr>
                    {" "}
                    <td style={{ textAlign: "justify" }}>
                      {accusedName} {personAddress}
                    </td>{" "}
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
