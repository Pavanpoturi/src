import styled from "styled-components";
import { borderRadius } from "@lib/helpers/style_utils";

const StickerWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  ${borderRadius("5px")};

  .contentWrapper {
    width: 100%;
    padding: 14px 12px 20px 14px;
    display: flex;
    flex-direction: column;

    .statNumber {
      font-size: 27px;
      font-weight: 500;
      line-height: 1.1;
      margin: 5px 0 5px;
      text-align: center;
    }

    .label {
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      margin: 0;
      line-height: 16px;
    }
  }
`;

export { StickerWidgetWrapper };
