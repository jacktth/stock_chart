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
import { spawn } from "child_process";
export const ApiColumn = ({
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
      const id = e.target.id;
      setInputObj({ ...inputObj, [id]: e.target.value });
      console.log(inputObj[id]);
    }
    function executeApi() {
      let queryParam: DynamicQueryParam = {};
      setResponse("")
      for (const [key, value] of Object.entries(inputObj)) {
        queryParam = { ...queryParam, [key]: value };
      }

      const fetchStockData = () =>
        axios.get(`http://localhost:3000${title.queryRoute}`, {
          params: queryParam,
        });
      setIsLoading(true);
      fetchStockData().then((e) => {
        console.log(e);
        setResponse(JSON.stringify(e.data));
        setIsLoading(false);
      });
    }
    const resTypeContent = (resType: ApiResponseType) => {
      const types = resType.description.split(";");
      const responseType = (types: string[]) => {
        return (
          <>
            {"{"}
            {types.map((e) =>
              e.includes(":{") ? (
                <div className="">
                  {e.split(":{").map((e) => (
                    <>
                      <p className="ml-6">
                        {e.includes(":") ? (
                          e.split(",").map((str) =>
                            str.includes("}") ? (
                              <>
                                <p className="ml-16">
                                  {str.includes("}[]")
                                    ? str.replace("}[]", "")
                                    : str.replace("}", "")}
                                </p>
                                <p className="ml-6">{"}"}</p>
                              </>
                            ) : (
                              <p className="ml-16">{str}</p>
                            )
                          )
                        ) : (
                          <>
                            <p>{e + ":"}</p>
                            <p className="ml-6">{"{"}</p>
                          </>
                        )}
                      </p>
                    </>
                  ))}
                </div>
              ) : (
                <div className="ml-6">{e}</div>
              )
            )}
            {"}"}
          </>
        );
      };
      return <>{responseType(types)}</>;
    };
    return (
      <>
        <ul>
          {param.map((e) => (
            <>
              <li className="flex w-96">
                <div className="w-4/12">Name</div>
                <div className="w-8/12">Description</div>
              </li>
              <li className="flex w-96">
                <div className="w-4/12">
                  <p>
                    {e.param}
                    {required(true)}
                  </p>

                  <p>{e.type}</p>
                </div>
                <div className="flex flex-col w-8/12">
                  <p>{e.example}</p>
                  <input
                    id={e.param}
                    value={inputObj[e.param]}
                    onChange={(el) => inputChange(el)}
                    type="text"
                    placeholder={e.placeholder}
                  />
                </div>
              </li>
              <button onClick={() => executeApi()}>Execute</button>
            </>
          ))}
        </ul>
        <div>
          <span>Responses</span>
        </div>
        <div >
          <div className="flex w-96">
            <div className="w-4/12">Code</div>
            <div className="w-8/12">Description</div>
          </div>

          <div>{isLoading ? "loading..." : null}</div>
          <div>
            {response ? <span>Result</span>:null}
            <div className="text-xs overflow-auto w-auto" style={{ height: "20vh" }}>
              {response ? response : null}
            </div>
          </div>
        </div>
        <div className="flex w-96">
          <span className="w-4/12">{resType.code}</span>
          <span className="w-8/12 text-xs"> {resTypeContent(resType)}</span>
        </div>
      </>
    );
  };

  return (
    <div
      onClick={() => {
        setExpand(expand ? false : true);
      }}
    >
      <details className=" ">
        <summary className="list-none flex justify-between cursor-pointer">
          <div>
            <span>
              {title.method} <span>{title.queryRoute}</span>
            </span>
          </div>

          {expand ? (
            <div>
              <ExpandLessIcon className="to-blue-500 " />
            </div>
          ) : (
            <div>
              <ExpandMoreIcon className="to-blue-500 " />
            </div>
          )}
        </summary>
        <div className="">
          <p>Parameters</p>
        </div>
        <div>{ContentList(param)}</div>
      </details>
    </div>
  );
};
