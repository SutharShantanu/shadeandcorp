"use client";

import Banner from "@/components/homepage/banner";
import FAQ from "@/components/homepage/faq";
import TrustedBrand from "@/components/homepage/trustedBrand";
import React from "react";

const Homepage = () => {
  return (
    <div>
      <Banner />
      <TrustedBrand />
      <FAQ />
    </div>
  );
};

export default Homepage;
