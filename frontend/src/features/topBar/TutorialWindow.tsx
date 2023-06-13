import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { startTutorial } from "./topBarSlice";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const TutorialWindow = () => {
  const dispatch = useAppDispatch();
  const photos = ["/basicOperation.svg", "/selectData.svg"];
  const [photoIndex, setPhotoIndex] = useState(0);
  function nextPhoto(number: number) {
    const nextNumber = photoIndex + number;
    if (nextNumber > photos.length - 1) {
      setPhotoIndex(0);
    } else {
      setPhotoIndex(nextNumber);
    }
  }
  return (
    <div
      className="absolute view-full bg-slate-600 z-20 bg-opacity-50 
      flex justify-center items-center"
      onClick={() => dispatch(startTutorial(false))}
    >
      <div
        className="h-[90%] w-[90%] bg-white relative z-20 border-r-2 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute view-full justify-center items-end flex">
          {photos.map((e, i) => {
            return (
              <div
                className={`w-3 h-3 rounded-full mr-2
            ${
              photos[photoIndex] === e ? "bg-slate-500" : "bg-slate-200"
            }`}
              ></div>
            );
          })}
        </div>
        <button
          className="absolute  top-0 right-0 z-30"
          onClick={() => dispatch(startTutorial(false))}
        >
          <CloseIcon />
        </button>

        <div className="absolute view-full justify-end items-center flex">
          <button
            className={`h-[10%] w-[5%] z-20 hover:bg-gray-400 
            ${photoIndex === photos.length - 1 ? "hidden" : null}`}
            onClick={() => nextPhoto(1)}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>

        <div className="absolute view-full  items-center flex">
          <button
            className={`h-[10%] w-[5%] z-20 hover:bg-gray-400 
            ${photoIndex === 0 ? "hidden" : null}`}
            onClick={() => nextPhoto(-1)}
          >
            <ArrowBackIosNewIcon />
          </button>
        </div>

        <div className="w-full h-full flex justify-center">
          <div className="w-[90%] flex justify-center items-center">
            <img src={`${photos[photoIndex]}`} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};


export default TutorialWindow;