import React from "react";
import { Image } from "@taroify/core";
import { PhotoFail } from "@taroify/icons";

interface ImageComponentProps {
  imageUrl: string;
  mode: any;
  onClick?: any;
  radius?: string;
}

const hasNoUnit = (d: string) => /^\d+$/g.test(d);

const ImageComponent = ({
  imageUrl,
  mode,
  onClick,
  radius = "0",
}: ImageComponentProps) => {
  const style = {
    height: "100%",
    width: "100%",
    borderRadius: hasNoUnit(radius) ? `${radius}px` : radius,
  };
  return (
    <Image
      fallback={<PhotoFail />}
      mode={mode}
      onClick={onClick}
      src={imageUrl}
      style={style}
    />
  );
};

export default ImageComponent;
