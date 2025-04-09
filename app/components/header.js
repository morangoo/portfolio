'use client';
import '@/app/styles/header.css';

import Waves from '@/app/utils/Waves';

const Header = () => {
    
    return (
    <div id="header" className="header-container">
        <Waves
            lineColor="#7927cc"
            backgroundColor="rgba(17, 17, 17, 0.2)"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 99 // Garante que o fundo fique atrás do conteúdo
              }}
        />
      <div>
        <h1 className="header-text">Miguel</h1>
        <p style={{textAlign:"center"}}>Developer * Visual Designer * Copywriter</p>
      </div>
    </div>
    );
};

export default Header;