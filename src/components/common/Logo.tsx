import Image from "next/image";

const Logo = () => {
  return (
    <Image 
      src="/login_logo.png" 
      width={150} 
      height={70} 
      alt="Logo" 
      priority 
      style={{ 
        width: "140px", 
        height: "150px" 
      }}
    />
  );
};

export default Logo;
