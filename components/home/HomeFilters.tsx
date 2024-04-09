"use client";

import { HomePageFilters } from "@/contants/filter";
import React from "react";
import { Button } from "../ui/button";

function HomeFilters() {
  const isActive = "newest";

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${isActive === filter.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"}`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
}

export default HomeFilters;
