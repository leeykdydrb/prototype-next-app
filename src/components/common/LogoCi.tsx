import Image from "next/image";

const Logo = () => {
  return (
    <Image 
      src="/next.svg" 
      width={150} 
      height={70} 
      alt="LogoCi" 
      priority 
      style={{ 
        width: "140px", 
        height: "150px" 
      }}
    />
  );
};

export default Logo;
