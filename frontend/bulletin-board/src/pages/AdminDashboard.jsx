import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import styles from './style/AdminDashboard.module.css';

// --- Komponen Ikon Sederhana (SVG) ---
const IconDashboard = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /></svg>;
const IconUsers = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
const IconShield = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

const BubblyAdminPanel = () => {
    // Data Statistik Dummy
    const statsData = {
        totalUsers: 5,
        totalPremiumUsers: 1,
        totalFreeUsers: 3,
        totalPosts: 3,
        activePosts: 3,
        totalPostsThisMonth: 3,
    };

    return (
        <div className={styles.appContainer}>
            <Navbar />
            <div className={styles.mainLayout}>

            {/* MAIN CONTENT AREA */}
            <main className={styles.mainContent}>

                {/* Header Dinamis Tergantung Menu */}
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>Overview</h1>
                        <p className={styles.pageSubtitle}>Pantau dan kelola aktivitas forum dengan mudah.</p>
                    </div>
                </header>

                <div className={styles.contentWrapper}>

                        {/* STATS BUBBLY CARDS */}
                        <div className={styles.statsGrid}>

                            {/* Card 1: Users */}
                            <div className={styles.bubblyCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconBubblyBlue}><IconUsers /></div>
                                    <span className={styles.cardLabel}>Total Users</span>
                                </div>
                                <h2 className={styles.cardValue}>{statsData.totalUsers}</h2>
                                <div className={styles.cardFooter}>
                                    <span className={styles.badgePremium}>{statsData.totalPremiumUsers} Premium</span>
                                    <span className={styles.badgeFree}>{statsData.totalFreeUsers} Free</span>
                                </div>
                            </div>

                            {/* Card 2: Posts */}
                            <div className={styles.bubblyCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconBubblyGreen}><IconDashboard /></div>
                                    <span className={styles.cardLabel}>Active Posts</span>
                                </div>
                                <h2 className={styles.cardValue}>{statsData.activePosts}</h2>
                                <div className={styles.cardFooter}>
                                    <span className={styles.textMuted}>Dari total {statsData.totalPosts} post</span>
                                </div>
                            </div>

                            {/* Card 3: Monthly Trend */}
                            <div className={styles.bubblyCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconBubblyOrange}><IconShield /></div>
                                    <span className={styles.cardLabel}>This Month</span>
                                </div>
                                <h2 className={styles.cardValue}>+{statsData.totalPostsThisMonth}</h2>
                                <div className={styles.cardFooter}>
                                    <span className={styles.textSuccess}>Tren Positif🔥</span>
                                </div>
                            </div>

                        </div>

                        {/* Tempat untuk komponen chart atau tabel aktivitas nanti */}
                        <div className={styles.bubblyCardCentered}>
                            <span className={styles.textMuted}>Area untuk Grafik Aktivitas / Tabel Terbaru</span>
                        </div>

                    </div>

            </main>
            </div>
        </div>
    );
};

export default BubblyAdminPanel;