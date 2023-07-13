import { playerCountDown } from "../helpers/playerHelpers";
import { GameButton } from './GameButton';
import { HeaderButtons } from './HeaderButtons';
import { startEventPayload } from "../helpers/sendEventHelpers";

const renderHeaderButtons = ({ activePlayer, modal, clockDifference, updateState, handleGameEvent }) => {
  const showShop = activePlayer && !modal;
  const countDown = playerCountDown(activePlayer, clockDifference)
  const showStart = !activePlayer.active && countDown <= 0 && !modal;

  return (
    <>
      {
        showShop &&
        <GameButton
          className={'gameButton'}
          onClick={() => updateState({ modal: 'selection' })}
          buttonText={'shop'}
        />
      }

      {
        showStart &&
        <GameButton
          className={'reEnterButton'}
          onClick={() => handleGameEvent(startEventPayload(activePlayer))}
          buttonText={'start'}
        />
      }
    </>
  )
}

const Header = ({ activePlayer, modal, clockDifference, updateState, handleLeaderBoard, handleGameEvent }) => {
  return (
    <>
      {renderHeaderButtons({ activePlayer, modal, clockDifference, updateState, handleGameEvent })}
      {!modal && <HeaderButtons
        updateState={updateState}
        handleLeaderBoard={handleLeaderBoard}
      />}
    </>
  )
}

export default Header;