import { useState } from "react";
import type { NextPage } from "next";

// String: Represents textual data.
// Number: Represents numeric data.
// Boolean: Represents true or false values.
// Null: Represents the absence of a value.
// Enum: Represents a specific set of string values, such as "Happy" or "Sad".
// Object: Represents a collection of key-value pairs, allowing for more complex data structures

const tools = [
  {
    type: "function",
    function: {
      name: "search",
      description: "Search on Google",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query",
          },
          location: {
            type: "string",
            description: "The city and state e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["c", "f"],
          },
        },
        required: ["query", "location"],
      },
    },
  },
];

interface Property {
  type: string;
  description?: string;
  enum?: string[];
}

const Stability: NextPage = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      type: "string",
      description: "The city and state e.g. San Francisco, CA",
    },
  ]);

  // const generateJsonOutput = () => {
  //   const jsonOutput = {
  //     name: "get_weather",
  //     description: "Determine weather in my location",
  //     parameters: {
  //       type: "object",
  //       properties: properties.reduce((acc, property, index) => {
  //         acc[`property${index + 1}`] = property;
  //         return acc;
  //       }, {}),
  //       required: ["location"],
  //     },
  //   };

  //   return JSON.stringify(jsonOutput, null, 2);
  // };

  return <div className="flex flex-col justify-center items-center gap-4 p-2">Hello World</div>;
};

export default Stability;
