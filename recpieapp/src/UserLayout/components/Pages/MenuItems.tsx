import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCategory } from '../CategoryContext';

interface MenuItem {
  title: string;
  url?: string;
  submenu?: MenuItem[];
  id?: string;
}

interface DropdownProps {
  submenus: MenuItem[];
  dropdown: boolean;
  depthLevel: number;
}

interface MenuItemsProps {
  items: MenuItem;
  depthLevel: number;
}

const Dropdown: React.FC<DropdownProps> = ({ submenus, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";

  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
  );
};

const MenuItems: React.FC<MenuItemsProps> = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const { setCategoryId } = useCategory();

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (dropdown && ref.current && !ref.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    if (window.innerWidth > 960) {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth > 960) {
      setDropdown(false);
    }
  };

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const handleClick = (id: string | undefined) => {
    if (id) {
      setCategoryId(id);
    }
  };

  return (
    <li
      className="menu-items"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      {items.url && items.submenu && items.submenu.length > 0 ? (
        <>

          <button
            type="submit"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={()=>handleClick(items.id)}
          >
            <Link to='' onClick={()=>handleClick(items.id)}>{items.title}</Link>
            <span className={`arrow ${depthLevel === 0 ? "down" : "right"}`}  />
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown}   />
        </>
      ) : items.submenu && items.submenu.length > 0 ? (
        <>
          <button
            type="submit"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={()=>handleClick(items.id)}
          >
            {items.title}
            <span className={`arrow ${depthLevel === 0 ? "down" : "right"}`} />
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown} />
        </>
      ) : (
        <Link to="" onClick={()=>handleClick(items.id)}>{items.title}</Link>
      )}
    </li>
  );
};

export default MenuItems;
