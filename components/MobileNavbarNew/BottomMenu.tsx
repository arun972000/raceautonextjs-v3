/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { NavigationItem } from "./NavigationItem";
import { AnalyticsIcon } from "./icons";
import styles from "./styles/BottomNavigation.module.css";
import Link from "next/link";

export function BottomNavigation() {
  return (
    <nav className={styles.navigation}>
      <Link href="/">
        {" "}
        <NavigationItem icon={<AnalyticsIcon />} label="Analytics" />
      </Link>
      <Link href="/">
        <NavigationItem
          icon={
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bea4fecc4446a86382647a281d085cc6da533bfd"
              alt="News"
              className={styles.navIcon}
            />
          }
          label="Exclusive"
        />
      </Link>
      <Link href="/subscription">
        <NavigationItem
          icon={
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd0a2d0065b792df2f57953f8ba1df037b02fbe5"
              alt="Subscription"
              className={styles.navIcon}
            />
          }
          label="Subscription"
        />
      </Link>
      <NavigationItem
        icon={
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7e777268e3b3553a615a027fb85af09e61bcaf02"
            alt="Menu"
            className={styles.menuIcon}
          />
        }
        label=""
        className={styles.menuItem}
      />
    </nav>
  );
}
