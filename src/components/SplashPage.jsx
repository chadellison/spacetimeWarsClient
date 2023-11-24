import { GameButton } from './GameButton';
import { useEffect } from 'react';
                   
const PROMO_LINK = 'https://www.youtube.com/embed/iAvjV5dI0Vo?si=JPTIsxhqxkmUlgWT&amp;controls=0';
const SplashPage = ({ updateState }) => {
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['Space', 'Enter'].includes(event.code)) {
        updateState({ showPromo: false })
      }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [])

  return (
    <div className="splashPageContainer" style={{ width: '100%', height: '100%', zIndex: 1, position: 'absolute' }}>
      <iframe
        width="100%"
        height="60%"
        src={PROMO_LINK}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        title="Space wars"
        style={{border: '0px'}}
      />
      <GameButton
        onClick={() => updateState({ showPromo: false })}
        buttonText="Next"
        className="skipPromo"
      />
    </div>
  )
};
export default SplashPage;