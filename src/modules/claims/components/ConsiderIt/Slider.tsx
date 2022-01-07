import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { clamp, get } from "lodash-es";

import styles from "./Slider.module.css";
import { useOpinions } from "modules/claims/hooks/useOpinions";

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

export const Slider: FC = () => {
  const { opinion, setOpinionAcceptance, setShowOpinionId } = useOpinions();
  const { isOpining, setIsOpining } = useOpinions();
  const [isSliding, setIsSliding] = useState(false);
  const sliderThumb = useRef(null);
  const sliderHandle = useRef(null);
  const { acceptance } = opinion;
  const franklinSmileCurve = acceptance * 10;

  const setHandlePosition = (acceptance: number) => {
    if (sliderHandle.current) {
      sliderHandle.current.style.left = `${acceptance * 100}%`;
    }
  };

  const moveSlide = useCallback((event) => {
    event.preventDefault();

    if (!sliderThumb.current) return;

    const { offsetWidth, offsetLeft } = sliderThumb.current;
    const acceptance =
      clamp(event.clientX - offsetLeft, 0, offsetWidth) / offsetWidth;
    setOpinionAcceptance(acceptance);
    setHandlePosition(acceptance);
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
    setShowOpinionId(null);
    setIsSliding(true);
  };

  const acceptanceText = useMemo(() => {
    if (acceptance < 0.01) {
      return "You Fully Disagree";
    } else if (acceptance < 0.23) {
      return "You Firmly Disagree";
    } else if (acceptance < 0.45) {
      return "You Slightly Disagree";
    } else if (acceptance < 0.55) {
      return "You Are Undecided";
    } else if (acceptance < 0.77) {
      return "You Slightly Agree";
    } else if (acceptance < 0.99) {
      return "You Firmly Agree";
    } else {
      return "You Fully Agree";
    }
  }, [acceptance]);

  useEffect(() => {
    setHandlePosition(acceptance || 0.5);
  }, []);

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
              {acceptanceText}
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
