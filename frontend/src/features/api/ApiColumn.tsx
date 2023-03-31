import React from "react";
import { ApiQueryParam, ApiResponseType, ApiTitle } from "./types";

export const ApiColumn = ({
  title,
  param,
  resType,
}: {
  title: ApiTitle;
  param: ApiQueryParam[];
  resType: ApiResponseType;
}) => {
  const required = (bool: boolean) => {
    if (bool) {
      return <span>* required</span>;
    } else {
      return null;
    }
  };
  const contentList = (param: ApiQueryParam[]) => {
    return (
      <ul>
        {param.map((e) => (
          <>
            <li className="flex ">
              <div>Name</div>
              <div>Description</div>
            </li>
            <li className="flex">
              <div>
                <p>
                  {e.param}
                  {required(true)}
                </p>

                <p>{e.type}</p>
              </div>
              <div className="flex flex-col">
                <p>{e.example}</p>
                <input type="text" placeholder={e.placeholder} />
              </div>
            </li>
          </>
        ))}
      </ul>
    );
  };
  const resTypeContent = (resType: ApiResponseType) => {
    const types = resType.description.split(";");
    return (
      <>
        {"{"}
        {types.map((e) =>
          e.includes("{") || e.includes("}") ? (
            <div className="">{e}</div>
          ) : (
            <div className="ml-6">{e}</div>
          )
        )}
        {"}"}
      </>
    );
  };
  return (
    <>
      <div className="">
        <span>{title.method}</span>
        <span>{title.queryRoute}</span>
      </div>
      <div className="">
        <p>Parameters</p>
      </div>
      <div>{contentList(param)}</div>
      <div>
        <span>Responses</span>
      </div>
      <div>
        <span>Code</span>
        <span>Description</span>
      </div>
      <div className="flex">
        <span>{resType.code}</span>
        <span> {resTypeContent(resType)}</span>
      </div>
    </>
  );
};
