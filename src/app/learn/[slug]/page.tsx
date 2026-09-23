import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, lessons } from "@/content/lessons";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import styles from "./learn.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return {
    title: lesson ? `${lesson.title} — Hand Cal` : "Hand Cal",
  };
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return (
    <div>
      <div className={styles.top}>
        <Link href="/">Hand Cal</Link>
        <Link href="/track">트랙</Link>
      </div>
      <LessonPlayer lesson={lesson} />
    </div>
  );
}
