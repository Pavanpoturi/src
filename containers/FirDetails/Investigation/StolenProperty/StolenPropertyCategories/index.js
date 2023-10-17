import ArmsAndAmmunition from "./ArmsAndAmmunition";
import AutoMobiles from "./AutoMobiles";
import CoinsAndCurrency from "./CoinsAndCurrency";
import CulturalProperty from "./CulturalProperty";
import DocumentsAndValuableSecurities from "./DocumentsAndValuableSecurities";
import DrugsAndNarotics from "./DrugsAndNarotics";
import ElectricalAndElectronicGoods from "./ElectricalAndElectronicGoods";
import Explosives from "./Explosives";
import Jewellery from "./Jewellery";
import Miscellaneous from "./Miscellaneous";
import { loadState } from "@lib/helpers/localStorage";
import axios from "axios";
import { notification } from "antd";
import { config } from "@config/site.config";

export default function GenerateStolenPropertyCategories(
  propertyCategoryState,
  commonFunction
) {
  const crimeId = loadState("selectedFirId");

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const handleUpload = (options, params1, params2, params3) => {
    if (params1.length > 0) {
      const mediaFormData = new FormData();
      params1.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/StolenProperty/media`);

      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          params2([]);
          if (response.data.success) {
            params3(response.data.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          params2([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  switch (propertyCategoryState) {
    case "armsAndAmmunition":
      return (
        <ArmsAndAmmunition
          handleUpload={handleUpload}
          setUploadedArmsInsuranceCertificateMedia={
            commonFunction.setUploadedArmsInsuranceCertificateMedia
          }
          viewClicked={commonFunction.viewClicked}
        />
      );
    case "automobiles":
      return <AutoMobiles viewClicked={commonFunction.viewClicked} />;
    case "coinsandCurrency":
      return <CoinsAndCurrency viewClicked={commonFunction.viewClicked} />;
    case "culturalProperty":
      return (
        <CulturalProperty
          handleUpload={handleUpload}
          viewClicked={commonFunction.viewClicked}
          setUploadedCulInsuranceCertificateMedia={
            commonFunction.setUploadedCulInsuranceCertificateMedia
          }
          setUploadedAsiCertificateMedia={
            commonFunction.setUploadedAsiCertificateMedia
          }
        />
      );
    case "documentsandValuableSecurities":
      return (
        <DocumentsAndValuableSecurities
          viewClicked={commonFunction.viewClicked}
        />
      );
    case "drugsNarcotics":
      return (
        <DrugsAndNarotics
          handleUpload={handleUpload}
          viewClicked={commonFunction.viewClicked}
          setUploadedLabAnalysisMedia={
            commonFunction.setUploadedLabAnalysisMedia
          }
          setUploadedDrugReportMedia={commonFunction.setUploadedDrugReportMedia}
          interrogationDoneSelected={commonFunction.interrogationDoneSelected}
          setInterrogationDoneSelected={
            commonFunction.setInterrogationDoneSelected
          }
          drugGangSelected={commonFunction.drugGangSelected}
          setDrugGangSelected={commonFunction.setDrugGangSelected}
          labAnalysisSelected={commonFunction.labAnalysisSelected}
          setlabAnalysisSelected={commonFunction.setlabAnalysisSelected}
          setIsAddressModalVisible={commonFunction.setIsAddressModalVisible}
          setNDPSSelected={commonFunction.setNDPSSelected}
        />
      );
    case "electricalandElectronicGoods":
      return (
        <ElectricalAndElectronicGoods
          viewClicked={commonFunction.viewClicked}
        />
      );
    case "explosives":
      return <Explosives viewClicked={commonFunction.viewClicked} />;

    case "jewellery":
      return <Jewellery viewClicked={commonFunction.viewClicked} />;
    case "miscellaneous":
      return <Miscellaneous viewClicked={commonFunction.viewClicked} />;

    default:
      return "";
  }
}
