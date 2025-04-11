"use client";
import React, { useState } from "react";
import { BottomNavigation } from "./BottomMenu";
import MenuSelector from "./MenuSelector";
import SearchBar from "./SearchBar";
import { NavigationItem } from "./NavigationItem";
import { AnalyticsIcon } from "./icons";
import styles from "./styles/BottomNavigation.module.css";
import Image from "next/image";
import { SearchInput } from "./SearchInput";
import { IoMdClose } from "react-icons/io";
import SearchStyles from "./styles/SearchBar.module.css";
import LoginNavButton from "../Navbuttons/LoginNavButton";
import navStyles from "@/styles/navbar.module.css";
import Link from "next/link";

const MobileNavNew = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenuSlide = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <>
      <div className={styles.mobile_navbar}>
        <div
        // className={styles.menuslide}
        >
          <nav className={SearchStyles.searchBar} role="search">
            <Link href="/">
              {" "}
              <Image
                src="/images/black logo.png"
                alt="logo nav"
                width={35}
                height={35}
              />
            </Link>
            <SearchInput />
            {/* <IoIosLogIn 
            className={SearchStyles.closeButton}
            onClick={() => setMenuVisible(false)}
            style={{cursor:'pointer'}}
          /> */}
            <div className="ms-auto">
              <LoginNavButton />
            </div>
          </nav>
        </div>
        <div
          className={`${styles.menuslide} ${
            menuVisible ? styles.slideUp : styles.hidden
          }`}
        >
          <nav className={SearchStyles.searchBar} role="search">
            <Link href="/">
              {" "}
              <Image
                src="/images/black logo.png"
                alt="logo nav"
                width={35}
                height={35}
              />
            </Link>
            <SearchInput />
            <IoMdClose
              className={SearchStyles.closeButton}
              onClick={() => setMenuVisible(false)}
              style={{ cursor: "pointer" }}
            />
          </nav>
          {menuVisible && <MenuSelector />}
        </div>

        <nav className={styles.navigation}>
          <Link href="/">
            <div className={styles.navItem}>
              <AnalyticsIcon />
            </div>
          </Link>

          <Link href="/">
            <div className={styles.navItem}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bea4fecc4446a86382647a281d085cc6da533bfd"
                alt="Exclusive"
                className={styles.navIcon}
              />
            </div>
          </Link>

          <Link href="/subscription">
            <div className={styles.navItem}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd0a2d0065b792df2f57953f8ba1df037b02fbe5"
                alt="Subscription"
                className={styles.navIcon}
              />
            </div>
          </Link>

          <div className={`${styles.navItem} ${styles.menuItem}`}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7e777268e3b3553a615a027fb85af09e61bcaf02"
              alt="Menu"
              className={styles.menuIcon}
            />
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileNavNew;
