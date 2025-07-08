"use client";

import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();
  
  return (
    <>
      <title>Weathering With Us</title>
      {/* Cloud animations */}
      <div className={styles.cloudsContainer}>
        <div className={`${styles.cloud} ${styles.cloud1}`}></div>
        <div className={`${styles.cloud} ${styles.cloud2}`}></div>
        <div className={`${styles.cloud} ${styles.cloud3}`}></div>
        <div className={`${styles.cloud} ${styles.cloud4}`}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.Title}>Weathering with us</div>
        
        <div className={styles.Subtitle}>
          <h4>Track Fast, Track Now</h4>
        </div>
        
        <div className={styles.buttonSection}>
          <Button className={styles.Button} variant="secondary" onClick={() => router.push('/tracking')}>
            Track Now
          </Button>
          <Button className={styles.Button2} variant="secondary">
            Learn More
          </Button>
        </div>
        
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${styles.green}`}>90%</span>
            <h2 className={styles.statLabel}>Accuracy</h2>
          </div>
          
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${styles.blue}`}>24/7</span>
            <h2 className={styles.statLabel}>Updates</h2>
          </div>
          
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${styles.green}`}>Global</span>
            <h2 className={styles.statLabel}>Coverage</h2>
          </div>
        </div>
      </div>
    </>
  );
}
