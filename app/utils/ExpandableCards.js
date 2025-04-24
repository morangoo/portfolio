import React from "react";

const symbolStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  maxWidth: "100vw",
  background:
    "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%)," +
    "linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%)," +
    "linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
  padding: "20px",
  border: "black 3px solid",
  borderRadius: "15px",
  zIndex: 10,
};
const logoStyle = {
  marginRight: 20,
};
const imgStyle = {
  width: 50,
  border: "black 1px solid",
  borderRadius: 10,
  marginRight: 20,
};
const footerLinkStyle = {
  color: "aqua",
  textDecoration: "none",
};

const cards = [
  { text: "Wh", i: -4 },
  { text: "at", i: -3 },
  { text: "can", i: -2 },
  { text: "I", i: -1 },
  { text: "say", i: 0 },
  { text: "man", i: 1 },
  { text: "ba", i: 2 },
  { text: "out", i: 3 },
  { text: "!", i: 4 },
];

const ExpandableCards = () => {
  return (
    <div style={{ minHeight: "100vh", overflow: "hidden" }}>

      {/* Card Container */}
      <div className="container">
        {cards.map(({ text, i }) => (
          <div
            className="card"
            key={i}
            style={{ "--i": i }}
            data-i={i} // For debugging
          >
            {text}
          </div>
        ))}
      </div>

      {/* Inline SCSS-in-JS */}
      <style jsx>{`
        .container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 600px;
          margin-top: 180px;
        }
        .card {
          position: absolute;
          width: 350px;
          height: 520px;
          background-color: #5e5cfc;
          color: rgba(0, 0, 0, 0);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 8em;
          font-weight: 700;
          border: 10px solid rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          cursor: pointer;
          transition: 0.52s;
          transform-origin: 50% 100%;
          filter: hue-rotate(calc(var(--i) * 30deg));
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
          user-select: none;
        }
        .container:hover .card {
          transform: rotate(calc(var(--i) * 8deg)) translate(calc(var(--i) * 140px), -100px);
          color: rgba(0, 0, 0, 0.25);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
        }
        .container:active .card {
          background-color: #333;
        }
        .card:active {
          translate: calc(var(--i) * 20px) -50px;
          z-index: 1;
          background-color: #5e5cfc;
        }
        /* Responsive adjustments */
        @media (max-width: 700px) {
          .card {
            width: 180px;
            height: 230px;
            font-size: 2.5em;
          }
          .container {
            height: 260px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpandableCards;