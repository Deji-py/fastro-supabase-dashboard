import { APP_LOGO_BLACK } from "@/app_meta/brand";
import { Paper, Image } from "@mantine/core";
import NextImage from "next/image";
import React from "react";

function Fastro_AppBrand() {
  return (
    <Paper
      p="md"
      style={{
        maxWidth: "100%",
        height: 70,
      }}
    >
      <Image
        component={NextImage}
        src={APP_LOGO_BLACK}
        alt="app logo"
        w="auto"
        h={40}
        fit="contain"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </Paper>
  );
}

export default Fastro_AppBrand;
