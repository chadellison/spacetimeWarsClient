import { GameButton } from './GameButton';
import { useEffect } from 'react';
import '../styles/trailer.css';

const PROMO_LINK = 'https://www.youtube.com/embed/iAvjV5dI0Vo?si=JPTIsxhqxkmUlgWT&autoplay=1&autohide=0&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&loop=1';
                   
const Trailer = ({ updateState }) => {
  
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
    <div className="trailerContainer" style={{ width: '100%', height: '100%', zIndex: 1, position: 'absolute', background: 'black' }}>
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
export default Trailer;