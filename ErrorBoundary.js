import React from "react";
import { Card } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#EC0D0D",
            }}
          >
            Something went wrong! Please reload.
          </p>
        </Card>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
