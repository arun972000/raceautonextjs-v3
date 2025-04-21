/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles/BottomNavigation.module.css";
import Image from "next/image";
import { SearchInput } from "./SearchInput";
import { IoMdClose } from "react-icons/io";
import SearchStyles from "./styles/SearchBar.module.css";
import LoginNavButton from "../Navbuttons/LoginNavButton";
import Link from "next/link";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import menuStyles from "./styles/MenuSelector.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiBarChart2, FiStar, FiCreditCard, FiMenu } from "react-icons/fi";
import { TbChartHistogram } from "react-icons/tb";

const MobileNavNew = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [mainCategory, setMainCategory] = useState<any[]>([]);
  const [market, setMarket] = useState([]);
  const [subCategories, setSubCategories] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [moreOption, setMoreOption] = useState<any[]>([]);
  const router = useRouter();
  const iconColor = "black";
  const iconSize = 28;

  const toggleMenuSlide = () => setMenuVisible((prev) => !prev);

  const main_category_api = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/category/main-category`
      );
      const Main_Category = res.data
        .filter((item: any) => item.show_on_menu == 1)
        .sort((a: any, b: any) => a.category_order - b.category_order);
      setMainCategory(Main_Category);
    } catch (err) {
      console.log(err);
    }
  };

  const market_api = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/market`
      );
      const marketFilteredValue = res.data!.filter(
        (item: any) => item.show_on_menu == 1
      );
      setMarket(marketFilteredValue);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSubCategory = async (mainCategoryId: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/category/sub-category/parent/${mainCategoryId}`
      );
      setSubCategories((prev) => ({
        ...prev,
        [mainCategoryId]: res.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMoreApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/pages/main-menu`
      );
      const morePagefiltered = res.data.filter(
        (item: any) =>
          item.parent_id == 7 &&
          item.visibility == 1 &&
          item.location == "main" &&
          !["contact", "about-us", "terms-conditions"].includes(item.name_slug)
      );
      setMoreOption(morePagefiltered);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    main_category_api();
    fetchMoreApi();
    market_api();
  }, []);

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => {
      const isOpening = !prev[id];
      if (isOpening && !subCategories[id]) {
        fetchSubCategory(id);
      }
      return {
        ...prev,
        [id]: isOpening,
      };
    });
  };

  const handleSubcategoryClick = (mainSlug: string, subSlug: string) => {
    router.push(`/category/${mainSlug}/${subSlug.toLowerCase()}`);
    setMenuVisible(false);
  };

  const handleMorePageClick = (path: string) => {
    router.push(path);
    setMenuVisible(false);
  };

  return (
    <>
      <div className={styles.mobile_navbar} style={{ color: "black" }}>
        <div
          style={{
            position: "fixed",
            zIndex: 999999,
            top: 0,
            width: "100%",
            opacity: 0.7,
          }}
        >
          <div className={SearchStyles.searchBar} role="search">
            <Link href="/">
              <Image
                src="/images/black logo.png"
                alt="logo nav"
                width={35}
                height={35}
              />
            </Link>
            <SearchInput />
            <div className="ms-auto">
              <LoginNavButton />
            </div>
          </div>
        </div>

        <div
          className={`${styles.menuslide} ${
            menuVisible ? styles.slideUp : styles.hidden
          }`}
        >
          <div className={SearchStyles.searchBar} role="search">
            <Link href="/">
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
          </div>
          <div className={menuStyles.navMenuContainer}>
            <button
              className={menuStyles.menuSelector}
              onClick={() => toggleMenu(100)}
            >
              <span className={menuStyles.menuText}>Market</span>
              <FaChevronDown className={menuStyles.marketIcon} />
            </button>

            <ul
              className={`${menuStyles.marketList} ${
                openMenus[100] ? menuStyles.show : menuStyles.hide
              }`}
            >
              {market.length > 0 ? (
                market.map((sub: any, i) => (
                  <li
                    key={sub.id}
                    className={menuStyles.marketItem}
                    onClick={() => {
                      router.push(`/market/${sub.title_slug.toLowerCase()}`);
                      setMenuVisible(false);
                    }}
                  >
                    {sub.title}
                    {i !== market.length - 1 && <hr />}
                  </li>
                ))
              ) : (
                <li className={menuStyles.marketItem}>Loading...</li>
              )}
            </ul>
          </div>

          {/* Main Categories with Subcategories */}
          {mainCategory.map((item) => (
            <div className={menuStyles.navMenuContainer} key={item.id}>
              <button
                className={menuStyles.menuSelector}
                onClick={() => toggleMenu(item.id)}
              >
                <span className={menuStyles.menuText}>{item.name}</span>
                <FaChevronDown className={menuStyles.marketIcon} />
              </button>

              <ul
                className={`${menuStyles.marketList} ${
                  openMenus[item.id] ? menuStyles.show : menuStyles.hide
                }`}
              >
                {subCategories[item.id]?.length > 0 ? (
                  subCategories[item.id].map((sub, i) => (
                    <li
                      key={sub.id}
                      className={menuStyles.marketItem}
                      onClick={() =>
                        handleSubcategoryClick(item.name_slug, sub.name_slug)
                      }
                    >
                      {sub.name}
                      {i !== subCategories[item.id]?.length - 1 && <hr />}
                    </li>
                  ))
                ) : (
                  <li className={menuStyles.marketItem}>Loading...</li>
                )}
              </ul>
            </div>
          ))}

          {/* More Pages */}
          <div className={menuStyles.navMenuContainer}>
            <button
              className={menuStyles.menuSelector}
              onClick={() => toggleMenu(2)}
            >
              <span className={menuStyles.menuText}>More</span>
              <FaChevronDown className={menuStyles.marketIcon} />
            </button>
            <ul
              className={`${menuStyles.marketList} ${
                openMenus[2] ? menuStyles.show : menuStyles.hide
              }`}
            >
              {moreOption.map((sub, i) => (
                <li
                  key={sub.id}
                  className={menuStyles.marketItem}
                  onClick={() => handleMorePageClick(`/page/${sub.name_slug}`)}
                >
                  {sub.title}
                  {i !== moreOption.length - 1 && <hr />}
                </li>
              ))}
            </ul>
          </div>

          {/* Static Pages as Main Buttons (no dropdown) */}
          <div className={menuStyles.navMenuContainer}>
            <button
              className={menuStyles.menuSelector}
              onClick={() => handleMorePageClick("/magazine")}
            >
              <span className={menuStyles.menuText}>E-Magazine</span>
            </button>
          </div>
          <div className={menuStyles.navMenuContainer}>
            <button
              className={menuStyles.menuSelector}
              onClick={() => handleMorePageClick("/page/contact")}
            >
              <span className={menuStyles.menuText}>Contact</span>
            </button>
          </div>
          <div className={menuStyles.navMenuContainer}>
            <button
              className={menuStyles.menuSelector}
              onClick={() => handleMorePageClick("/page/about-us")}
            >
              <span className={menuStyles.menuText}>About Us</span>
            </button>
          </div>
          <div className={menuStyles.navMenuContainer}>
            <button
              className={menuStyles.menuSelector}
              onClick={() => handleMorePageClick("/page/terms-conditions")}
            >
              <span className={menuStyles.menuText}>Terms and Conditions</span>
            </button>
          </div>

          {/* Social Icons */}
          <div className={menuStyles.imageContainer}>
            <Link href="https://www.facebook.com/raceautoindia/">
              <Image
                src="/images/facebook (1) 1.png"
                alt="Facebook"
                width={35}
                height={35}
                className={menuStyles.brandLogo}
              />
            </Link>
            <Link href="https://x.com/raceautoindia">
              <Image
                src="/images/twitter (1) 1.png"
                alt="Twitter"
                width={35}
                height={35}
                className={menuStyles.brandLogoCenter}
              />
            </Link>
            <Link href="https://www.instagram.com/race.auto.india/">
              <Image
                src="/images/instagram (1) 1.png"
                alt="Instagram"
                width={35}
                height={35}
                className={menuStyles.brandLogoTop}
              />
            </Link>
            <Link href="https://www.linkedin.com/company/race-auto-india/">
              <Image
                src="/images/linkedin (1) 1.png"
                alt="LinkedIn"
                width={35}
                height={35}
                className={menuStyles.brandLogo}
              />
            </Link>
            <Link href="https://www.youtube.com/@RaceAutoIndia">
              <Image
                src="/images/youtube (1) 1.png"
                alt="LinkedIn"
                width={35}
                height={35}
                className={menuStyles.brandLogo}
              />
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className={styles.navigation}>
          <Link href="/">
            <div className={styles.navItem}>
              <TbChartHistogram
                color={iconColor}
                size={iconSize}
                title="Forecast"
              />
            </div>
          </Link>
          <Link href="/">
            <div className={styles.navItem}>
              <FiStar color={iconColor} size={iconSize} title="Exclusive" />
            </div>
          </Link>
          <Link href="/subscription">
            <div className={styles.navItem}>
              <FiCreditCard
                color={iconColor}
                size={iconSize}
                title="Subscription"
              />
            </div>
          </Link>
          <Link href="/page/event">
            <div className={styles.navItem}>
              <FaCalendarAlt color={iconColor} size={iconSize} title="Events" />
            </div>
          </Link>
          <div
            className={styles.navItem}
            onClick={toggleMenuSlide}
            role="button"
          >
            <FiMenu color={iconColor} size={iconSize} title="Menu" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavNew;
