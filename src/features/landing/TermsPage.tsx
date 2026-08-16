import styles from './TermsPage.module.css';

export function TermsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Terms</h1>
      <p className={styles.updated}>Last updated August 2026</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>The short version</h2>
        <p className={styles.sectionBody}>
          DevLens is a free, local-first browser tool. There is no account to create, no
          subscription, and no data collected about your projects. Everything you import and write
          stays in your browser.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>What this means today</h2>
        <p className={styles.sectionBody}>
          DevLens is under active development. Some features described on this site — such as Figma
          import, audit intelligence, and document export — are not yet implemented and are clearly
          labelled as such where they appear. A full terms of service will be published before
          DevLens reaches general availability.
        </p>
      </div>
    </div>
  );
}
