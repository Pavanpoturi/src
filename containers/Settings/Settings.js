import React from "react";
import PageHeader from "@components/utility/pageHeader";
import IntlMessages from "@components/utility/intlMessages";
import LayoutWrapper from "@components/utility/layoutWrapper";

export default function Settings() {
  return (
    <LayoutWrapper>
      <PageHeader>
        <IntlMessages id="common.settings" />
      </PageHeader>
    </LayoutWrapper>
  );
}
