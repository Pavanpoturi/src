import Map from "./Map";
import { MapsWidgetWrapper } from "./styles";

export default function MapsWidget({latitude,longitude}) {
  return (
    <MapsWidgetWrapper>
      <Map
        markers={[
          {
            position: [17.3850, 78.4867],
            draggable: true,
            title: "Marker title",
            onClick: (e) => {
              console.log("clicked ");
            },
            onDragend: (e) => {
              console.log("dragged");
            },
          },
        ]}
        center={[latitude, longitude]}
      />
    </MapsWidgetWrapper>
  );
}
