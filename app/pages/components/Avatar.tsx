interface AvatarProps {
  src: string | null | undefined;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ src, onClick }) => {
  return ( 
    <img 
      className="rounded-full" 
      alt="Avatar"
      height="35" 
      width="35" 
      src={src || "/placeholder.jpg"}
      onClick={onClick}
    />
   );
}
 
export default Avatar;
