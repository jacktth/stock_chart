export const clipsApiParams = {
  title: {
    queryRoute: "/user-data/clips",
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
      isRequired: true,
      placeholder: "Your categories",
      description: "test",
      example:
        "Example record or [Example record,Example record 1,Example record 2]",
    },
  ],

  resType: {
    code: 200,
    description: `symbol: string;
  category:string;
  date:{from:string,to:string};
  data:{date: Date,
    open: number,
    high: number,
    low: number,
    close: number,
    adjClose?: number,
    volume: number}[];
  `,
  },
};

export const categoryApiParams = {
  title: { queryRoute: "/user-data/categories", method: "GET",description:"Return the categories name created by user" },
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
    description: `
      categories: string[];
    `,
  },
};
