import React from "react";
import HomeMarketCard from "./HomeMarketCard";
import db from "@/lib/db";

const HomeMarket = async () => {
  const [marketList]: any = await db.execute("SELECT * FROM post_market");

  return (
    <div className="row mt-5">
      <h3>MARKET</h3>
      {marketList
        .map((item: any) => (
          <HomeMarketCard key={item.id} category={item.title_slug} />
        ))
        .slice(0, 4)}
    </div>
  );
};

export default HomeMarket;
