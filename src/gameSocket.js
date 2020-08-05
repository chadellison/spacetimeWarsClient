import store from './store.js';
import { updateClockAction } '../actions/updateClockAction.js';
import { handleAiEvents } from '../helpers/sendEventHelpers.js';
import { updateGameEventAction } from '../actions/gameEventActions.js';
let gameSocket

export const createGameSocket(userId) {
  let cable = Cable.createConsumer(WEBSOCKET_HOST)
  gameSocket = cable.subscriptions.create({
    channel: 'GameDataChannel',
    userId: userId
  },
  {
    connected: () => {},
    received: (response) => handleReceivedEvent(response.playerData),
    create: function(gameData) {
      this.perform('create', {
        gameData: gameData
      });
    }
  });
};

const handleReceivedEvent = (playerData) => {
  const state = store.getState();
  const clockDifference = state.time.clockDifference;
  const index = state.user.index;
  const gameEventData = state.gameEvent;

  handleEventData(playerData, index, gameEventData);
  const elapsedTime = Date.now() + clockDifference - playerData.serverTime;
  const gameState = handleEventPayload(this.state, playerData, elapsedTime);
  this.setState(gameState);

  if (elapsedTime > 400) {
    // maybe throw away events
    console.log('SLOW RESPONSE TIME DETECTED: ', elapsedTime);
  };
};

const handleEventData = (playerData, index, gameEventData) => {
  if (playerData.index === index) {
    let userEvents = {...gameEventData.userEvents}
    const sentTime = userEvents[playerData.eventId]
    handleClockUpdate(Date.now() - sentTime, playerData.updatedAt - sentTime);
    delete userEvents[playerData.eventId]
    const eventData = handleAiEvents(gameEventData, playerData.team, this.handleGameEvent);

    updateGameEvent({eventData: {...gameEventData, userEvents}})
    // this.setState({eventData: {...eventData, userEvents: userEvents}})
  }
}

const handleGameEvent = (eventPayload) => {
  const state = store.getState();
  const gameEventData = state.gameEvent;
  const clockDifference = state.time.clockDifference;

  let userEvents = {...gameEventData.userEvents}
  const id = Object.keys(userEvents).length
  const sentTime = Date.now();

  gameSocket.create({
    ...eventPayload,
    eventId: id,
    serverTime: sentTime + clockDifference
  });
  userEvents[id] = sentTime;
  let eventData = {...gameEventData}
  eventData.userEvents = userEvents
  // this.setState({eventData})
  updateGameEventAction({eventData})
};

const handleClockUpdate = store.dispatch((roundTripTime, timeDifference) => updateClockAction(roundTripTime, timeDifference));
const updateGameEvent = store.dispatch((payload) => updateGameEventAction(payload));

export gameSocket;
