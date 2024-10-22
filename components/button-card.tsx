import React from "react";

interface ButtonCardProps {
  title: string;
  imgPath: string;
  description: string;
  onClick: () => void;
}

const ButtonCard: React.FC<ButtonCardProps> = ({
  title,
  imgPath,
  description,
  onClick,
}) => {
  return (
    <button
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary border border-[#1e90ff] text-secondary-foreground shadow-sm hover:bg-[#1e90ff]"
      onClick={onClick}
    >
      <div className="py-[2rem] px-[2rem]" style={{ maxWidth: "22rem" }}>
        <h2 className="text-h2">{title}</h2>
        <img
          className="h-[8rem] flex justify-center items-center w-full py-[1rem]"
          src={imgPath}
        ></img>
        <p
          className="text-body"
          style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
        >
          {description}
        </p>
      </div>
    </button>
  );
};

export default ButtonCard;
