import { useState } from "react";
import { Layout } from "antd";
import { ReportsContainer } from "./style";
import { siderMenu } from "./const";
import SidebarContent from "./sidebarContent";
const { Content, Sider } = Layout;
export default function IcjsReports() {
  const [selectedSiderMenu, setSelectedSiderMenu] =
    useState("chargeSheetReport");
  const displaySiderItems = () => {
    return siderMenu.map((item, index) => {
      return (
        <div
          className={
            selectedSiderMenu === item.value
              ? "siderItems"
              : "siderItemDisabled"
          }
          key={index}
          onClick={() => {
            setSelectedSiderMenu(item.value);
          }}
          style={{
            marginBottom: 10,
            cursor: "pointer",
            height: item.value === "missingUnknwon" ? 65 : 40,
          }}
        >
          {item.name}
        </div>
      );
    });
  };

  return (
    <ReportsContainer>
      <Layout>
        <Content>
          <Layout className="site-layout-background layout">
            <Sider className="site-layout-background" width={200}>
              <div className="siderContainer">{displaySiderItems()}</div>
            </Sider>
            <Content
              className="contentContainer"
              style={{ overflow: "hidden" }}
            >
              <SidebarContent
                selectedSiderMenu={selectedSiderMenu}
                setSelectedSiderMenu={setSelectedSiderMenu}
              />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </ReportsContainer>
  );
}
