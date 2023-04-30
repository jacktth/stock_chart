import React from "react";

export const clipsApiParams = {
  title: {
    //queryDisplay is for displaying in the page, as the actual route is without /
    //in the beginning so we have queryRoute for real api fetching
    queryDisplay: "https://stock-chart-server.onrender.com/user-data/clips",
    queryRoute: "user-data/clips",
    method: "GET",
    description: "Return the stock data stored by user in the categories",
  },
  param: [
    {
      param: "apiKey",
      type: "string",
      isRequired: true,
      placeholder: "Your apiKey",
      description: "test",
      example: "",
    },
    {
      param: "categories",
      type: "array[string]",
      isRequired: false,
      placeholder: "Your categories",
      description: "test",
      example:
        "Example record or [Example record,Example record 1,Example record 2]",
    },
  ],

  resType: {
    code: 200,
    description: (
      <>
        {" "}
        <p>{"{"}</p>
        <p className="ml-3">
          symbol: string <br />
          category: string
        </p>
        <p className="ml-3">
          {`date:`} {`{`}
          <p className="ml-10">
            from: string <br />
            to: string
          </p>
        </p>
        <p className="text-transparent ml-3">
          date <span className="text-black">{`}`}</span>
        </p>
        <p className="ml-3">
          {`data:`} {`{`}
          <p className="ml-10">
            date: Date <br />
            open: number <br />
            high: number <br />
            low: number <br />
            close: number <br />
            adjClose?: number <br />
            volume: number <br />
          </p>
        </p>
        <p className="text-transparent ml-3">
          data <span className="text-black">{`}[ ]`}</span>
        </p>
        <p>{"}[ ]"}</p>
      </>
    ),
  },
};

export const categoryApiParams = {
  title: {
    queryDisplay: "https://stock-chart-server.onrender.com/user-data/categories",
    queryRoute: "user-data/categories",
    method: "GET",
    description: "Return the categories name created by user",
  },
  param: [
    {
      param: "apiKey",
      type: "string",
      isRequired: true,
      placeholder: "Your apiKey",
      description: "test",
      example: "",
    },
  ],

  resType: {
    code: 200,
    description: <><p className="ml-3">
    {`categories: string[ ]`}</p></>
  },
};
