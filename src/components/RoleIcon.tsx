
import { PlayerRole } from "../types/game";

interface RoleIconProps {
  role: PlayerRole;
}

export const RoleIcon = ({ role }: RoleIconProps) => {
  if (role === "spectator") return null;

  const getIconUrl = (role: PlayerRole) => {
    switch (role) {
      case "mrwhite":
        return "https://images.squarespace-cdn.com/content/v1/6166cfc7f0f9c96fd146e6ca/1634504010959-6RGC6MCE6AQ1Y7DLBVN3/undercover+game+mrwhite";
      case "undercover":
        return "https://images.squarespace-cdn.com/content/v1/6166cfc7f0f9c96fd146e6ca/1634503987177-FNP01OKKAEETWEU0VXU0/underover+role";
      case "civilian":
        return "https://images.squarespace-cdn.com/content/v1/6166cfc7f0f9c96fd146e6ca/1634503933306-I4KDTGU2VDXKD9GK2QR1/undercover+game+civilians+role";
      default:
        return "";
    }
  };

  return (
    <img 
      src={getIconUrl(role)} 
      alt={`${role} role`} 
      className="w-6 h-6 object-contain"
    />
  );
};
