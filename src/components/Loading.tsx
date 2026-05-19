import React from "react";

const Loading = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center filter backdrop-blur-sm transition-opacity">
      <div className=" flex flex-row gap-x-2 items-center justify-center">
        <div
          className="wave rounded-full w-2 h-8 bg-purple-600/60"
          style={{ "--i": ".1s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-16 bg-purple-500/60"
          style={{ "--i": ".2s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-8 bg-purple-800/60"
          style={{ "--i": ".4s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-12 bg-purple-700/60"
          style={{ "--i": ".7s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-24 bg-purple-600/60"
          style={{ "--i": ".6s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-36 bg-purple-500/60"
          style={{ "--i": ".5s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-24 bg-purple-600/60"
          style={{ "--i": ".6s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-12 bg-purple-700/60"
          style={{ "--i": ".7s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-8 bg-purple-800/60"
          style={{ "--i": ".4s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-16 bg-purple-500/60"
          style={{ "--i": ".2s" } as React.CSSProperties}
        ></div>
        <div
          className="wave rounded-full w-2 h-8 bg-purple-600/60"
          style={{ "--i": ".1s" } as React.CSSProperties}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
