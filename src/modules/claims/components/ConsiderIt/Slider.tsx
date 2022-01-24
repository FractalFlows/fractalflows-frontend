import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { clamp, get } from "lodash-es";

import styles from "./Slider.module.css";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { useAuth } from "modules/auth/hooks/useAuth";

export const Slider: FC = () => {
  const { userOpinion, setOpinionAcceptance, setShowOpinionId } = useOpinions();
  const { isOpining, setIsOpining } = useOpinions();
  const [isSliding, setIsSliding] = useState(false);
  const sliderThumb = useRef(null);
  const sliderHandle = useRef(null);
  const acceptance = get(userOpinion, "acceptance", 0);
  const franklinSmileCurve = acceptance * 10;
  const { requireSignIn } = useAuth();

  const setHandlePosition = (acceptance: number) => {
    if (sliderHandle.current) {
      sliderHandle.current.style.left = `${acceptance * 100}%`;
    }
  };

  const moveSlide = useCallback((event) => {
    event.preventDefault();

    if (
      !sliderThumb.current ||
      (isNaN(event.clientX) && event.touches.length === 0)
    )
      return;

    const { offsetWidth, offsetLeft } = sliderThumb.current;
    const position = event.clientX || event.touches[0].pageX;
    const acceptance =
      clamp(position - offsetLeft, 0, offsetWidth) / offsetWidth;
    setOpinionAcceptance(acceptance);
    setHandlePosition(acceptance);
  }, []);

  const stopSlide = useCallback(() => {
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
    setHandlePosition(get(userOpinion, "acceptance", 0.5));
    return () => stopSlide();
  }, [get(userOpinion, "id")]);

  return (
    <div className={styles.slider}>
      <div
        ref={sliderThumb}
        className={`${styles.slider__thumb} ${
          isSliding ? styles["slider__thumb--moving"] : ""
        }`}
      >
        <div
          onMouseDown={requireSignIn(handleSlideStart)}
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

          <Box sx={{ display: { xs: "none", md: "initial" } }}>
            {isOpining ? (
              <Typography variant="h5" className={styles.slider__label}>
                {acceptanceText}
              </Typography>
            ) : (
              <Button
                size="small"
                variant="contained"
                className={styles.slider__cta}
              >
                {userOpinion?.id ? "Update" : "Give"} your opinion
              </Button>
            )}
          </Box>
        </div>
      </div>
      <Stack sx={{ display: { md: "none" }, mt: 5 }} alignItems="center">
        {isOpining ? (
          <Typography
            variant="h5"
            color="primary"
            align="center"
            fontWeight={600}
          >
            {acceptanceText}
          </Typography>
        ) : (
          <Button size="medium" variant="contained" onClick={handleSlideStart}>
            {userOpinion?.id ? "Update" : "Give"} your opinion
          </Button>
        )}
      </Stack>
    </div>
  );
};
