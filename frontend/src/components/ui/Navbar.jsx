import { FloatingNav } from "@/components/ui/floating-navbar";

import {
  MdHome,
  MdNotifications,
  MdPerson
} from "react-icons/md";

const Navbar = () => {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <MdHome size={20} className="text-white" />,
    },
    {
      name: "Notifications",
      link: "/notifications",
      icon: <MdNotifications size={20} className="text-white" />,
    },
    {
      name: "Profile",
      link: "/profile",
      icon: <MdPerson size={20} className="text-white" />,
    },
  ];

  return (
    <div>
      <FloatingNav navItems={navItems} />
    </div>
  );
};

export default Navbar;
