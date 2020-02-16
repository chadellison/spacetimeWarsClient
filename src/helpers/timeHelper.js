export const findClockDifference = (sentTime, startTime, serverDifference) => {
  const responseTime = Date.now();
  const roundTripTime = responseTime - sentTime;
  console.log('round trip time: ***********', roundTripTime)
  const clientDifference = responseTime - startTime - roundTripTime;
  return serverDifference - clientDifference;
}
