import React, { Component, useCallback, useRef, useState } from "react";
import { clamp, get } from "lodash-es";

import styles from "./Slider.module.css";
import { Typography } from "@mui/material";

const franklinDiameter = 50;

// const GiveOpinionBtn = styled.div`
//   background-color: ${grey800};
//   border-radius: 4px;
//   padding: 6px;
//   color: white;
//   font-size: 13px;
//   font-weight: bold;
//   position: absolute;
//   white-space: nowrap;
//   user-select: none;
//   transform: translateX(-50%);
//   margin-left: ${franklinDiameter / 2}px;
//   bottom: -30px;
//   cursor: pointer;
//   display: ${(props) => (props.givingOpinion ? "none" : "block")};

//   &:before {
//     content: " ";
//     position: absolute;
//     width: 0;
//     height: 0;
//     left: calc(50% - 8px);
//     top: -16px;
//     border: 8px solid;
//     border-color: transparent transparent ${grey800} transparent;
//   }
// `;

export const Slider: FC<{}> = ({
  isOpining = false,
  setIsOpining,
  acceptance,
  setAcceptance,
  hasOpined = false,
  opinion,
}) => {
  const [isSliding, setIsSliding] = useState(false);
  const sliderThumb = useRef(null);
  const sliderHandle = useRef(null);
  const franklinSmileCurve = acceptance * 10;

  const moveSlide = useCallback((event) => {
    event.preventDefault();

    if (!sliderThumb.current) return;

    const { offsetWidth, offsetLeft } = sliderThumb.current;
    const acceptanceInPixels = clamp(
      event.clientX - offsetLeft,
      0,
      offsetWidth
    );
    setAcceptance(acceptanceInPixels / offsetWidth);
  }, []);

  const stopSlide = useCallback((event) => {
    document.body.removeEventListener("mousemove", moveSlide, false);
    document.body.removeEventListener("touchmove", moveSlide, false);
    document.body.removeEventListener("mouseup", moveSlide, false);
    document.body.removeEventListener("touchend", moveSlide, false);
    setIsSliding(false);
  }, []);

  const handleSlideStart = () => {
    document.body.addEventListener("mousemove", moveSlide, false);
    document.body.addEventListener("touchmove", moveSlide, false);
    document.body.addEventListener("mouseup", stopSlide, false);
    document.body.addEventListener("touchend", stopSlide, false);
    setIsOpining(true);
    setIsSliding(true);
  };

  return (
    <div className={styles.slider}>
      <div
        ref={sliderThumb}
        className={`${styles.slider__thumb} ${
          isSliding ? styles["slider__thumb--moving"] : ""
        }`}
      >
        <div
          onMouseDown={handleSlideStart}
          onTouchStart={handleSlideStart}
          ref={sliderHandle}
          className={styles.slider__handle}
          style={{
            left: `${acceptance * 100}%`,
          }}
        >
          <div
            className={styles.slider__franklin}
            style={{
              transform: isOpining ? "" : "scale(.4)",
            }}
          >
            <svg
              viewBox="-2 -1 104 104"
              style={{
                width: "var(--fractalflows-considerit-franklin-diameter)",
                height: "var(--fractalflows-considerit-franklin-diameter)",
                display: isOpining ? "initial" : "none",
              }}
            >
              <circle cx="33.2755" cy="38" r="4" fill="white" />
              <circle cx="66.7245" cy="38" r="4" fill="white" />

              <path
                d={`M10 ${20 - franklinSmileCurve} C 20 ${
                  10 + franklinSmileCurve
                }, 40 ${10 + franklinSmileCurve}, 50 ${
                  20 - franklinSmileCurve
                }`}
                fill="transparent"
                strokeWidth="4"
                stroke="white"
                transform="translate(20, 53)"
              />
            </svg>
          </div>

          {isOpining ? (
            <Typography variant="h5" className={styles.slider__label}>
              {opinion}
            </Typography>
          ) : null}
          {/* <div givingOpinion={isOpining}>{opinionStrength}</SliderLabel> */}

          {/* <GiveOpinionBtn givingOpinion={isOpining}>
            {hasOpined ? "Update" : "Give"} Your Opinion
          </GiveOpinionBtn> */}
        </div>
      </div>
    </div>
  );
};
