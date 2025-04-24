import React, { useState, useRef, useEffect, useState as useReactState } from "react";

function getRandomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}

const ExpandableCards = ({ cards }) => {
  const containerRef = useRef(null);
  const [cardSize, setCardSize] = useReactState(100);

  useEffect(() => {
    function updateCardSize() {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      const overlap = 0.55;
      const n = cards.length;
      const maxWidth = offsetWidth / (1 + (n - 1) * overlap);
      const maxHeight = offsetHeight;
      setCardSize(Math.floor(Math.min(maxWidth, maxHeight)));
    }
    updateCardSize();
    window.addEventListener("resize", updateCardSize);
    return () => window.removeEventListener("resize", updateCardSize);
  }, [cards.length]);

  const [hovered, setHovered] = useState(null);
  const [hoverColors, setHoverColors] = useState({});

  function handleMouseEnter(i) {
    setHovered(i);
    setHoverColors(prev => ({
      ...prev,
      [i]: getRandomColor(),
    }));
  }

  function renderCardContent(text) {
    if (typeof text === "string" || typeof text === "number") {
      return <span>{text}</span>;
    }
    if (React.isValidElement(text)) {
      return text;
    }
    if (text && typeof text === "object" && text.img) {
      return (
        <div className="card-img-wrapper">
          <img
            src={text.img}
            alt={text.alt || ""}
            className="card-img"
            draggable={false}
          />
          {text.label && (
            <div className="card-img-label" style={{ fontSize: "0.8em", marginTop: "0.5em", color: "#222" }}>
              {text.label}
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "220px",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
      className="expandable-cards-outer"
    >
      <div className="container">
        {cards.map(({ text, i }, idx) => {
          const thisIdx = i ?? idx;
          const isHovered = hovered === thisIdx;
          // Seta a cor aleatória apenas se este card estiver hovered
          const hoveredColor = isHovered && hoverColors[thisIdx] ? hoverColors[thisIdx] : undefined;
          return (
            <div
              className={`card${isHovered ? " card--hovered" : ""}${
                hovered !== null && !isHovered ? " card--faded" : ""
              }`}
              key={thisIdx}
              style={{
                "--i": thisIdx,
                "--card-size": `${cardSize}px`,
                "--font-size": `${Math.max(cardSize * 0.34, 12)}px`,
                "--border-radius": `${Math.max(cardSize * 0.11, 7)}px`,
                "--border-width": `${Math.max(cardSize * 0.045, 2)}px`,
                "--trans-x": `${cardSize * 0.45}px`,
                "--trans-y": `${-cardSize * 0.18}px`,
                "--hover-trans-y": `${-cardSize * 0.27}px`,
                "--active-trans-x": `${cardSize * 0.065}px`,
                "--active-trans-y": `${-cardSize * 0.065}px`,
                "--hovered-bg-color": hoveredColor || "#5e5cfc", // fallback
              }}
              data-i={thisIdx}
              onMouseEnter={() => handleMouseEnter(thisIdx)}
              onMouseLeave={() => setHovered(null)}
            >
              {renderCardContent(text)}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 180px;
        }
        .card {
          position: absolute;
          width: var(--card-size);
          height: var(--card-size);
          background-color: rgba(0, 0, 0, 0.25);
          color: rgba(0, 0, 0, 0);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: var(--font-size);
          font-weight: 700;
          border: var(--border-width) solid rgba(0, 0, 0, 0.1);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition:
            0.42s,
            box-shadow 0.28s,
            background-color 0.28s;
          transform-origin: 50% 100%;
          filter: hue-rotate(calc(var(--i) * 30deg));
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.1);
          user-select: none;
          z-index: 0;
        }
        .container:hover .card {
          transform:
            rotate(calc(var(--i) * 8deg))
            translate(calc(var(--i) * var(--trans-x)), var(--trans-y));
          color: rgba(0, 0, 0, 0.0);
          box-shadow: 0 9px 22px rgba(0, 0, 0, 0);
          border: var(--border-width) solid rgba(0, 0, 0, 0.0);
        }
        .container:active .card {
          background-color: rgba(0, 0, 0, 0.0);
        }
        .card:active {
          translate: calc(var(--i) * var(--active-trans-x)) var(--active-trans-y);
          z-index: 1;
          background-color: #5e5cfc;
          border: var(--border-width) solid rgba(0, 0, 0, 0.1);
        }
        .card--hovered {
          z-index: 10 !important;
          background-color: var(--hovered-bg-color, #5e5cfc) !important; /* cor dinâmica */
          transform:
            scale(1.15)
            rotate(calc(var(--i) * 8deg))
            translate(calc(var(--i) * var(--trans-x)), var(--hover-trans-y)) !important;
          color: #222 !important;
          box-shadow: 0 14px 38px rgba(0,0,0,0.32) !important;
          border: var(--border-width) solid rgba(0, 0, 0, 0.1) !important;
        }
        .card--faded {
          filter: grayscale(1) brightness(0.75) !important;
          opacity: 0.45 !important;
          color: rgba(0,0,0,0.15) !important;
        }
        .card-img-wrapper {
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        :global(.card-img), .card-img-wrapper :global(img.card-img) {
          width: 60% !important;
          height: 60% !important;
          display: block;
          object-fit: contain;
          margin: 0 auto;
          border-radius: 8px;
          pointer-events: none;
          user-select: none;
        }
        .card-img-label {
          text-align: center;
        }
        @media (max-width: 600px) {
          .container {
            min-height: 90px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpandableCards;