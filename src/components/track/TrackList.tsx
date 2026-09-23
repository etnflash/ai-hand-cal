"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Lesson } from "@/content/types";
import {
  HUB_EDGES,
  TOPICS,
  chipLabel,
  lessonsInTopic,
  type Topic,
  type TopicId,
} from "@/content/topics";
import { loadProgress, type ProgressState } from "@/lib/progress";
import styles from "./TrackList.module.css";

type Props = {
  lessons: Lesson[];
};

export function TrackList({ lessons }: Props) {
  const search = useSearchParams();
  const router = useRouter();
  const topicParam = search.get("topic");
  const initial =
    topicParam && TOPICS.some((t) => t.id === topicParam)
      ? topicParam
      : "transformer";

  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [activeId, setActiveId] = useState<string>(initial);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    if (topicParam && TOPICS.some((t) => t.id === topicParam)) {
      setActiveId(topicParam);
    }
  }, [topicParam]);

  const completed = progress?.completedLessons ?? [];

  const topics = useMemo(
    () =>
      [...TOPICS]
        .sort((a, b) => a.order - b.order)
        .map((topic) => ({
          topic,
          items: lessonsInTopic(topic, lessons),
        })),
    [lessons],
  );

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.slug.includes(q) ||
        l.kind.includes(q),
    );
  }, [lessons, query]);

  const active = topics.find((t) => t.topic.id === activeId) ?? topics[0];

  const selectTopic = (id: TopicId) => {
    setActiveId(id);
    router.replace(`/track?topic=${id}`, { scroll: false });
  };

  return (
    <div className={styles.mapPage}>
      <div className={styles.searchRow}>
        <input
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="레슨 검색 (예: attention, 드롭아웃)"
          aria-label="레슨 검색"
        />
        <Link href="/daily" className={styles.dailyLink}>
          오늘의 문제
        </Link>
      </div>

      {query.trim() && (
        <div className={styles.searchResults}>
          {searchHits.length === 0 ? (
            <p className={styles.emptySearch}>검색 결과 없음</p>
          ) : (
            searchHits.map((l) => (
              <Link key={l.slug} href={`/learn/${l.slug}`} className={styles.card}>
                <strong>{l.title}</strong>
                <span>{l.subtitle}</span>
              </Link>
            ))
          )}
        </div>
      )}

      <section className={styles.overview}>
        <h2 className={styles.mapTitle}>개념 맵</h2>
        <p className={styles.mapHint}>
          허브를 누르면 그 안의 세부 그래프가 열립니다.
        </p>
        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          role="img"
          aria-label="학습 주제 맵"
        >
          {HUB_EDGES.map((e) => {
            const a = TOPICS.find((t) => t.id === e.from)!;
            const b = TOPICS.find((t) => t.id === e.to)!;
            return (
              <g key={`${e.from}-${e.to}`}>
                <line
                  x1={a.hub.x}
                  y1={a.hub.y}
                  x2={b.hub.x}
                  y2={b.hub.y}
                  className={styles.hubEdge}
                />
                {e.label && (
                  <text
                    x={(a.hub.x + b.hub.x) / 2}
                    y={(a.hub.y + b.hub.y) / 2 - 2}
                    className={styles.edgeLabelSvg}
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {topics.map(({ topic, items }) => {
            const done = items.filter((l) =>
              completed.includes(l.slug),
            ).length;
            const selected = topic.id === activeId;
            return (
              <g
                key={topic.id}
                className={styles.hubGroup}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                aria-label={`${topic.title}, ${done}/${items.length} 완료`}
                onClick={() => selectTopic(topic.id)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    selectTopic(topic.id);
                  }
                }}
              >
                <circle
                  cx={topic.hub.x}
                  cy={topic.hub.y}
                  r={selected ? 9 : 7}
                  className={
                    selected ? styles.hubActive : styles.hubCircle
                  }
                />
                <text
                  x={topic.hub.x}
                  y={topic.hub.y + 0.8}
                  textAnchor="middle"
                  className={styles.hubText}
                >
                  {topic.title}
                </text>
                <text
                  x={topic.hub.x}
                  y={topic.hub.y + 12}
                  textAnchor="middle"
                  className={styles.hubMeta}
                >
                  {done}/{items.length}
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      {active && (
        <TopicSubgraph
          topic={active.topic}
          items={active.items}
          completed={completed}
          progress={progress}
        />
      )}
    </div>
  );
}

function TopicSubgraph({
  topic,
  items,
  completed,
  progress,
}: {
  topic: Topic;
  items: Lesson[];
  completed: string[];
  progress: ProgressState | null;
}) {
  const bySlug = useMemo(
    () => new Map(items.map((l) => [l.slug, l])),
    [items],
  );

  const lanes = topic.lanes ?? [
    { id: "all", title: topic.title, slugs: topic.pipeline },
  ];

  return (
    <section className={styles.subgraph}>
      <header className={styles.subHead}>
        <h2>{topic.title}</h2>
        <p>{topic.blurb}</p>
      </header>

      <div className={styles.lanes} data-map="lanes-v2">
        <p className={styles.lanesHint}>위에서 아래로 이어지는 단계입니다.</p>
        {lanes.map((lane, laneIdx) => (
          <div key={lane.id} className={styles.lane}>
            {laneIdx > 0 && (
              <div className={styles.laneBridge} aria-hidden>
                <span className={styles.laneArrow} />
              </div>
            )}
            <div className={styles.laneBody} data-lane={lane.id}>
              <span className={styles.laneTitle}>{lane.title}</span>
              <div className={styles.laneChips}>
                {lane.slugs.map((slug, i) => {
                  const lesson = bySlug.get(slug);
                  if (!lesson) return null;
                  const done = completed.includes(slug);
                  return (
                    <div key={slug} className={styles.chipWrap}>
                      {i > 0 && <span className={styles.chipJoin} aria-hidden />}
                      <Link
                        href={`/learn/${slug}`}
                        className={`${styles.chip} ${done ? styles.chipDone : ""}`}
                        title={lesson.title}
                      >
                        {chipLabel(slug, lesson.title)}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.listTitle}>레슨 목록</h3>
      <div className={styles.nodeCards}>
        {items.map((lesson) => {
          const done = completed.includes(lesson.slug);
          const exDone =
            progress?.completedExercises[lesson.slug]?.length ?? 0;
          return (
            <Link
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
              className={`${styles.card} ${done ? styles.cardDone : ""}`}
            >
              <strong>{lesson.title}</strong>
              <span>{lesson.subtitle}</span>
              <em>
                {done ? "완료" : `${exDone}/${lesson.exercises.length}`}
              </em>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
