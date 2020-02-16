export const findClockDifference = (sentTime, startTime, serverDifference) => {
  const responseTime = Date.now();
  const roundTripTime = responseTime - sentTime;
  const clientDifference = responseTime - startTime - roundTripTime;
  return serverDifference - clientDifference;
}
