import { Card, Tabs } from "antd";
import CCTVFootage from "./CCTVFootage";
import AudioVideoClippings from "./AudioVideoClippings";
import CDRsCAF from "./CDRsCAF";

const { TabPane } = Tabs;

export default function DigitalEvidence({
  editObj,
  setEditObj,
  viewDetails,
  setViewDetails,
  selectedTab,
  setSelectedTab,
}) {
  const changeTab = (activeKey) => {
    setSelectedTab(activeKey);
    setViewDetails(false);
    setEditObj(null);
  };

  return (
    <Card style={{ width: "100%" }}>
      <Tabs defaultActiveKey="1" onChange={changeTab}>
        <TabPane tab="CCTV Footage" key="1">
          <CCTVFootage
            editCCTVFootageObj={editObj}
            setEditCCTVFootageObj={setEditObj}
            viewCCTVFootageDetails={viewDetails}
            setViewCCTVFootageDetails={setViewDetails}
            selectedTab={selectedTab}
          />
        </TabPane>
        <TabPane tab="Audio, Video Clippings" key="2">
          <AudioVideoClippings
            editAudioVideoClippingObj={editObj}
            setEditAudioVideoClippingObj={setEditObj}
            viewAudioVideoClippingDetails={viewDetails}
            setViewAudioVideoClippingDetails={setViewDetails}
            selectedTab={selectedTab}
          />
        </TabPane>
        <TabPane tab="CDRs / CAF" key="3">
          <CDRsCAF
            editCDRObj={editObj}
            setEditCDRObj={setEditObj}
            viewCDRDetails={viewDetails}
            setViewCDRDetails={setViewDetails}
            selectedTab={selectedTab}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}
