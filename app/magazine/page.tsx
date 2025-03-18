export const dynamic = "force-dynamic";

import React from "react";
import Magazine_v2 from "./Magazine-v2";
import BreakingNews from "@/components/BreakingNews/BreakingNews";
import Navbar from "@/components/Navbar/Navbar";

const page = () => {

  return <>
        <BreakingNews />
      <Navbar />
        <Magazine_v2 />
  </>;
};

export default page;
