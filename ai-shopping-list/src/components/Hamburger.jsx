import PropTypes from "prop-types";

import style from "../assets/style";

const HamburgerMenu = ({ isOpen, onClose, onLogout }) => {
  return (
    <>
      {isOpen && <div className={style.overlay} onClick={onClose}></div>}
      <div
        className={`${style.menu} ${
          isOpen ? style.menuOpen : style.menuClosed
        }`}
      >
        <div className={style.menuList}>
          <div className={style.header}>
            <div className={style.closeMenu} onClick={onClose}>
              <div className={style.closeLineL}></div>
              <div className={style.closeLineR}></div>
            </div>
            <h2 className={style.menuHeader}>Menu</h2>
            <button className={style.signOutButton} onClick={onLogout}>
              Log out
            </button>
          </div>
          <ul className={style.menuItems}>
            <li className={style.menuItem}>Groups</li>
            <li className={style.menuItem}>My lists</li>
          </ul>
        </div>
      </div>
    </>
  );
};

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default HamburgerMenu;
