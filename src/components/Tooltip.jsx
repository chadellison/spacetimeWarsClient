import styled from "styled-components"

const StyledTooltip = styled.div`
  margin-left: ${({ marginLeft }) => marginLeft}px;
  margin-top: ${({ marginTop }) => marginTop}px;
  background: #dce0e5;
  width: 350px;
  height: 120px;
  position: absolute;
  border-radius: 5px;
  z-index: 1;
`;

const Title = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  color: #1d2022;
`;

const Price = styled.div`
  margin-top: 5px;
  text-align: left;
  line-height: 16px;
  display: flex;
  font-size: 12px;
  color: #ab8432;
  font-weight: bold;
`;

const TooltipText = styled.div`
  font-size: 11px;
  color: #69757f;
  margin-top: 5px;
  margin-right: 5px;
  font-weight: bold;
  text-align: left;
`;

const IconThumbnail = styled.img`
  height: 100%;
  float: left;
  display: inline-block;
  margin-right: 10px;
`;

const Tooltip = ({ imageSrc, title, price, description, marginLeft, marginTop }) => (
  <StyledTooltip marginLeft={marginLeft} marginTop={marginTop}>
    <IconThumbnail src={imageSrc} />
    {title && <Title>{title}</Title>}
    {price && <Price>{`Price: ${price}`}</Price>}
    <TooltipText>{description}</TooltipText>
  </StyledTooltip>
);

export default Tooltip;