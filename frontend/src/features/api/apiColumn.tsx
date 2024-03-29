//The file name must be upper case because of unknown issues of rollup.js
import React, { useState } from "react";
import {
  ApiQueryParam,
  ApiResponseType,
  ApiTitle,
  DynamicInputState,
  DynamicQueryParam,
} from "./types";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LoadingComponent from "../commonUI/loadingComponent";
 const ApiColumn = ({
  title,
  param,
  resType,
}: {
  title: ApiTitle;
  param: ApiQueryParam[];
  resType: ApiResponseType;
}) => {
  const [expand, setExpand] = useState(false);

  const required = (bool: boolean) => {
    if (bool) {
      return <span>* required</span>;
    } else {
      return null;
    }
  };
  const ContentList = (param: ApiQueryParam[]) => {
    let objContainer: DynamicInputState = {};
    param.forEach((e) => {
      objContainer = { ...objContainer, [e.param]: "" };
    });
    const [inputObj, setInputObj] = useState(objContainer);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");

    function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const name = e.target.name;
      setInputObj({ ...inputObj, [name]: e.target.value });
    }

    function executeApi() {
      let queryParam: DynamicQueryParam = {};
      setResponse("");
      for (const [key, value] of Object.entries(inputObj)) {
        queryParam = { ...queryParam, [key]: value };
      }

      const fetchStockData = () =>
        axios.get(`${import.meta.env.VITE_SERVER + title.queryRoute}`, {
          params: queryParam,
        });
      setIsLoading(true);
      fetchStockData().then((e) => {
        setResponse(JSON.stringify(e.data));
        setIsLoading(false);
      });
    }

    return (
      <>
        <ul>
          {param.map((e) => (
            <>
              <li className="flex w-auto px-3 mt-2 mb-7">
                <div className="w-2/12">
                  <p>
                    <span className="font-bold"> {e.param}</span>

                    <span className="text-xs text-red-500 font-bold">
                      {required(e.isRequired)}
                    </span>
                  </p>

                  <p>{e.type}</p>
                </div>
                <div className="flex flex-col w-8/12">
                  <p>{e.example}</p>
                  <input
                    className="border-2 px-2 py-1 border-slate-400 "
                    name={e.param}
                    value={inputObj[e.param]}
                    onChange={(el) => inputChange(el)}
                    type="text"
                    placeholder={e.placeholder}
                  />
                </div>
              </li>
            </>
          ))}
        </ul>
        <div className="justify-items-center w-auto grid px-2 pb-4">
          <button
            className=" h-8 w-full bg-blue-400 border-solid  border-blue-400 rounded-lg"
            onClick={() => executeApi()}
          >
            Execute
          </button>
        </div>

        <div className="bg-white px-2 py-3 border-b-2 border-x-slate-500">
          <span>Responses</span>
        </div>
        <div>
          <div className="flex w-96 pt-6 pb-3 px-3 text-sm font-bold border-b-2 border-slate-300 ">
            <div className="w-4/12">Code</div>
            <div className="w-11/12">Description</div>
          </div>

          <div>{isLoading ? <LoadingComponent /> : null}</div>
          <div className="px-3 mt-2 mb-7">
            {response ? (
              <div className="">
                <span>Result</span>{" "}
                <div
                  className="text-xs overflow-auto w-8/12"
                  style={{ height: "20vh" }}
                >
                  {response ? response : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex w-auto px-3 mt-2 mb-7 border-b-2  border-blue-300">
          <span className="w-4/12">{resType.code}</span>
          <span className="w-11/12 text-xs">
            {resType.description}
          </span>
        </div>
      </>
    );
  };

  return (
    <div
      onClick={() => {
        setExpand(expand ? false : true);
      }}
      className="bg-blue-50 border-solid border-x-2 border-t-2 
       border-blue-300 mx-4 mb-4"
    >
      <details className=" ">
        <summary className="list-none flex  cursor-pointer 
         border-blue-300 border-solid border-b-2 p-1 w-full">
          <div className="flex items-center w-full">
            <div className="bg-blue-400 border-2 rounded-md text-white font-bold px-6 py-2 w-2/12 text-center">
              {title.method}
            </div>
            <div className="mx-5 font-bold text-sm ">{title.queryDisplay}</div>
            <div className="mx-2 ">{title.description}</div>
          </div>

          {expand ? (
            <div>
              <ExpandMoreIcon className="to-blue-500 " />
            </div>
          ) : (
            <div>
              <ExpandLessIcon className="to-blue-500 " />
            </div>
          )}
        </summary>
        <div className="bg-white px-2 py-3 border-b-2 border-x-slate-500 justify-self-end">
          <p>Parameters</p>
        </div>
        <>
          <li className="flex w-auto pt-6 pb-3 px-3 text-sm font-bold border-b-2 border-slate-300">
            <div className="w-4/12">Name</div>
            <div className="w-11/12">Description</div>
          </li>
          {ContentList(param)}
        </>
      </details>
    </div>
  );
};

export default ApiColumn;