import React from "react";

const BackgroundFlare = () => {
  const bgStars = [
    "bg-white w-1 h-1"
  ]
  return (
    <div className="h-screen w-screen ">
      <div className="w-full h-full fixed top-0 left-1/2 -translate-x-1/2 bg-radial to-zinc-800/60 -z-10 inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        
      </div>
    </div>
  );
};

export default BackgroundFlare;
