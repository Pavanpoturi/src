import React from "react";
import { StickerWidgetWrapper } from "./StickerWidget.styles";

export default function StickerWidget({
  fontColor,
  bgColor,
  width,
  value,
  title,
  isHigherOfficer = false,
  isGraveCrime,
  isGraveHeight = false,
  marginBottom,
}) {
  const textColor = {
    color: fontColor,
  };
  const labelColor = {
    color: isHigherOfficer && title !== "Grave Crimes" ? fontColor : "#7b7b7b",
  };
  const widgetStyle = {
    backgroundColor: bgColor,
    width: width,
    minHeight: isGraveHeight ? 80 : 100,
    height: isGraveHeight ? 80 : 100,
    display: isGraveHeight ? "flex" : "",
    justifyContent: isGraveHeight ? "center" : "",
    alignItems: isGraveHeight ? "center" : "",
  };

  return (
    <StickerWidgetWrapper className="stickerWidget" style={widgetStyle}>
      <div className="contentWrapper">
        {isGraveCrime ? (
          <>
            <h3
              className="statNumber"
              style={{
                fontSize: "27px",
                color: fontColor,
              }}
            >
              {value}
            </h3>
            <span className="label" style={{ fontSize: "15px", color: "gray" }}>
              {title}
            </span>
          </>
        ) : (
          <>
            <span
              className="label"
              style={{ labelColor, marginBottom: marginBottom }}
            >
              {title}
            </span>
            <h3 className="statNumber" style={textColor}>
              {value}
            </h3>
          </>
        )}
      </div>
    </StickerWidgetWrapper>
  );
}
