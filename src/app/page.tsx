import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className=" bg-blue-500 flex justify-center items-center h-20 text-4xl text-white">
          Next js with tailwind 3 starter code
        </div>
      </main>
    </div>
  );
}
