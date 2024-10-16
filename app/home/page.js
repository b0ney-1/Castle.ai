"use client";
import React from "react";
import styles from "../page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Home() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      fetch(`/api/user?_id=${id}`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setUsername(data.username);
          setLoaded(true);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [searchParams]);

  return (
    <div className={styles.landingBox}>
      <div className={styles.navBar}>
        <ul>
          <li>
            <Link href="#">Hi {username} 👋</Link>
          </li>
          <li>
            <Link href="/">Sign out</Link>
          </li>
        </ul>
      </div>
      <div className={styles.landingContainer}>
        <div className={styles.logoWrapper}>
          <Image
            src="/main.gif"
            alt="Logo"
            className={styles.logoImage}
            layout="responsive"
            width={500}
            height={500}
            unoptimized
          />
        </div>
        <div className={styles.actionItemsWrapper}>
          <div className={styles.actionItems}>
            <Link href="/play" className={styles.largeBtn}>
              <button className={`${styles.Button} ${styles.custom}`}>
                <Image
                  src="/play.gif"
                  className={styles.gif}
                  width={50}
                  height={50}
                  unoptimized
                />
                Play vs AI
              </button>
            </Link>
            <Link href="/learn" className={styles.largeBtn}>
              <button className={`${styles.Button} ${styles.custom}`}>
                <Image
                  src="/learn.gif"
                  className={styles.gif}
                  width={50}
                  height={50}
                  unoptimized
                />
                Learn the Moves
              </button>
            </Link>
            <Link href="/puzzle" className={styles.largeBtn}>
              <button className={`${styles.Button} ${styles.custom}`}>
                <Image
                  src="/puzzle.gif"
                  className={styles.gif}
                  width={50}
                  height={50}
                  unoptimized
                />
                Puzzle time
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
