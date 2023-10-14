import styled from "styled-components"

const StyledTooltip = styled.div`
  margin-left: ${({ marginLeft }) => marginLeft}px;
  margin-top: ${({ marginTop }) => marginTop}px;
  background: #dce0e5;
  width: 350px;
  height: 100px;
  position: absolute;
  border-radius: 5px;
  z-index: 1;
`;

const TooltipText = styled.div`
  font-size: 13px;
  color: #1d2022;
  padding-top: 10px;
  padding-right: 5px;
  font-weight: bold;
  text-align: left;
`;

const IconThumbnail = styled.img`
  height: 100%;
  float: left;
  display: inline-block;
  margin-right: 10px;
`;

const Tooltip = ({ imageSrc, description, marginLeft, marginTop }) => (
  <StyledTooltip marginLeft={marginLeft} marginTop={marginTop}><IconThumbnail src={imageSrc} /><TooltipText>{description}</TooltipText></StyledTooltip>
);

export default Tooltip;