// LogMessage.tsx
import React from "react";

interface LogMessageProps {
  logs: {
    type: string;
    content?: string;
    output?: string;
    link?: string;
    tool_calls?: any[];
  }[];
}

const LogMessage: React.FC<LogMessageProps> = ({ logs }) => {
  const parseMessage = (message: any) => {
    try {
      const parsedData = JSON.parse(message);
      const messages = parsedData?.data?.messages?.after || [];
      return messages.map((msg, idx) => {
        const { content, type } = msg;
        const emoji = type === "human" ? "🙂" : type === "ai" ? "🤖" : "";
        return (
          <p key={idx} className="py-1 text-base leading-relaxed text-white">
            {emoji} {content}
          </p>
        );
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return <p className="py-1 text-base leading-relaxed text-red-500">Error parsing message.</p>;
    }
  };

  return (
    <>
      {logs.map((message, index) => {
        if (message.type === "langgraphButton") {
          return (
            <div
              key={index}
              className="w-full max-w-4xl mx-auto rounded-lg pt-2 mt-3 pb-2 px-4 bg-gray-900 shadow-md"
            >
              <a
                href={message.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                View in Langsmith
              </a>
            </div>
          );
        }

        if (message.type === "report" || message.type === "differences") {
          return (
            <div
              key={index}
              className="w-full max-w-4xl mx-auto rounded-lg pt-2 mt-3 pb-2 px-4 bg-gray-900 shadow-md"
            >
              <div className="py-3 text-base leading-relaxed text-white log-message">
                {parseMessage(message.output)}
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="w-full max-w-4xl mx-auto rounded-lg pt-2 mt-3 pb-2 px-4 bg-gray-900 shadow-md"
          >
            <div
              className={`py-3 text-base leading-relaxed ${
                message.type === "question" ? "text-blue-300" : "text-white"
              }`}
            >
              {parseMessage(message.content)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LogMessage;
