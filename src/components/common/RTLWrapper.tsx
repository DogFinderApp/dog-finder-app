import { ReactNode } from "react";

interface RTLWrapperProps {
  children: ReactNode;
  withMaxWidth?: Boolean;
  notCentered?: Boolean;
}

export const RTLWrapper = ({
  children,
  withMaxWidth,
  notCentered,
}: RTLWrapperProps) => {
  const wrapperStyles = {
    width: withMaxWidth && "100%",
    display: "flex",
    justifyContent: !!notCentered ? "unset" : "center",
  };

  return (
    <div dir="rtl" style={wrapperStyles}>
      {children}
    </div>
  );
};
