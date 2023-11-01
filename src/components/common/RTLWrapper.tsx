import { ReactNode } from "react";

const wrapperStyles = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

interface RTLWrapperProps {
  children: ReactNode;
  withMaxWidth?: Boolean;
}

export const RTLWrapper = ({ children, withMaxWidth }: RTLWrapperProps) => {
  return (
    <div dir="rtl" style={withMaxWidth ? wrapperStyles : {}}>
      {children}
    </div>
  );
};
